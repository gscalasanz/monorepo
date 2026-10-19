/**
 * Cliente HTTP de la app. Replica el orden de interceptores de Angular
 * (`app-http-interceptors.ts`), de afuera hacia adentro:
 *   keep-alive → error global → auth (token + refresh ante 401) → retry → fetch.
 * Así el error global ve solo el resultado final: un 401 resuelto con refresh no
 * muestra "No autorizado", y los reintentos transitorios no muestran nada.
 */
import type { z } from 'zod';

import {
  ApiError,
  extractErrorMessage,
  isApiError,
  type ContractIssue,
} from '@/shared/api/api-error';
import { logContractViolation } from '@/shared/api/dev-log';
import { buildUrl, type QueryParams } from '@/shared/api/build-url';
import { UNAUTHENTICATED_ENDPOINTS } from '@/shared/api/endpoints';
import type { AuthBridge } from '@/shared/api/registry';
import { withRetry, type HttpMethod } from '@/shared/api/retry';
import {
  isAbortError,
  sendRequest,
  type ResponseType,
} from '@/shared/api/transport';

const UNAUTHORIZED_STATUS = 401;
/** La respuesta llegó OK (2xx) pero con forma inesperada. */
const CONTRACT_STATUS = 200;
const AUTHORIZATION_HEADER = 'Authorization';

export interface RequestOptions {
  readonly params?: QueryParams;
  readonly headers?: Readonly<Record<string, string>>;
  /** No publicar en el bus de errores globales (equivale a `SKIP_GLOBAL_ERROR`). */
  readonly skipGlobalError?: boolean;
  /** No agregar token ni refrescar ante 401 (p. ej. logout con Authorization explícito). */
  readonly skipAuth?: boolean;
  /** Ping de keep-alive: no reinicia el timer de inactividad. */
  readonly isKeepAlive?: boolean;
  readonly signal?: AbortSignal;
}

export interface RequestConfig extends RequestOptions {
  readonly method: HttpMethod;
  readonly endpoint: string;
  readonly body?: unknown;
  readonly responseType: ResponseType;
}

export interface ApiClientDeps {
  readonly baseUrl: string;
  readonly fetchFn: typeof fetch;
  readonly sleep: (ms: number) => Promise<void>;
  readonly random: () => number;
  readonly isOnline: () => boolean;
  readonly publishError: (message: string) => void;
  readonly onActivity: () => void;
  readonly getAuthBridge: () => AuthBridge | null;
}

export type ResponseSchema<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

function isUnauthenticated(endpoint: string): boolean {
  return UNAUTHENTICATED_ENDPOINTS.some((pattern) =>
    endpoint.includes(pattern),
  );
}

/** Único lugar donde se arma el `Authorization: Bearer` (también lo usa el logout). */
export function bearerHeaders(
  token: string | null,
): Readonly<Record<string, string>> {
  return token === null ? {} : { [AUTHORIZATION_HEADER]: `Bearer ${token}` };
}

function withToken(config: RequestConfig, token: string | null): RequestConfig {
  return { ...config, headers: { ...config.headers, ...bearerHeaders(token) } };
}

function isRefreshable(error: unknown, token: string | null): token is string {
  return (
    token !== null &&
    isApiError(error) &&
    error.kind === 'http' &&
    error.status === UNAUTHORIZED_STATUS
  );
}

/** Ejecuta un request con las capas auth → retry → fetch, sin error global. */
function createPipeline(
  deps: ApiClientDeps,
): (config: RequestConfig) => Promise<unknown> {
  const sendWithRetry = (config: RequestConfig): Promise<unknown> =>
    withRetry(
      () =>
        sendRequest(deps.fetchFn, {
          method: config.method,
          url: buildUrl({
            baseUrl: deps.baseUrl,
            endpoint: config.endpoint,
            params: config.params,
          }),
          headers: config.headers ?? {},
          body: config.body,
          responseType: config.responseType,
          signal: config.signal,
        }),
      { method: config.method, endpoint: config.endpoint, ...deps },
    );

  return async (config) => {
    const bridge = deps.getAuthBridge();
    if (
      config.skipAuth ||
      isUnauthenticated(config.endpoint) ||
      bridge === null
    ) {
      return sendWithRetry(config);
    }
    const token = bridge.getAccessToken();
    try {
      return await sendWithRetry(withToken(config, token));
    } catch (error) {
      if (!isRefreshable(error, token)) throw error;
      const freshToken = await bridge.refreshAccessToken(token);
      return sendWithRetry(withToken(config, freshToken));
    }
  };
}

interface ParseInput<T> {
  readonly schema: ResponseSchema<T>;
  readonly data: unknown;
  readonly config: RequestConfig;
}

function toContractIssues(error: z.ZodError): ContractIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function parseWith<T>({ schema, data, config }: ParseInput<T>): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const issues = toContractIssues(result.error);
  logContractViolation({
    method: config.method,
    endpoint: config.endpoint,
    issues,
  });
  throw new ApiError({
    kind: 'contract',
    status: CONTRACT_STATUS,
    method: config.method,
    url: config.endpoint,
    body: data,
    issues,
  });
}

export interface Requester {
  /** Respuesta cruda (blob, texto, o JSON que se descarta). */
  raw(config: RequestConfig): Promise<unknown>;
  /** Respuesta validada con zod en el borde. */
  parsed<T>(config: RequestConfig, schema: ResponseSchema<T>): Promise<T>;
}

/** Núcleo: keep-alive + error global alrededor del pipeline, y validación zod. */
export function createRequester(deps: ApiClientDeps): Requester {
  const pipeline = createPipeline(deps);
  const withGlobalError = async <T>(
    config: RequestConfig,
    handle: (data: unknown) => T,
  ): Promise<T> => {
    if (!config.isKeepAlive) deps.onActivity();
    try {
      return handle(await pipeline(config));
    } catch (error) {
      if (!config.skipGlobalError && !isAbortError(error)) {
        deps.publishError(extractErrorMessage(error));
      }
      throw error;
    }
  };
  return {
    raw: (config) => withGlobalError(config, (data) => data),
    parsed: (config, schema) =>
      withGlobalError(config, (data) => parseWith({ schema, data, config })),
  };
}
