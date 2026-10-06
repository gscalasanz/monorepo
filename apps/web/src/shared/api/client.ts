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
} from '@/shared/api/api-error';
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

function withToken(config: RequestConfig, token: string | null): RequestConfig {
  if (token === null) return config;
  return {
    ...config,
    headers: { ...config.headers, [AUTHORIZATION_HEADER]: `Bearer ${token}` },
  };
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

function parseWith<T>(
  schema: ResponseSchema<T>,
  data: unknown,
  config: RequestConfig,
): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new ApiError({
    kind: 'contract',
    status: 200,
    method: config.method,
    url: config.endpoint,
    body: data,
  });
}

/** Núcleo: keep-alive + error global alrededor del pipeline, y validación zod. */
export function createRequester(deps: ApiClientDeps) {
  const pipeline = createPipeline(deps);
  return async function request<T>(
    config: RequestConfig,
    schema?: ResponseSchema<T>,
  ): Promise<T | unknown> {
    if (!config.isKeepAlive) deps.onActivity();
    try {
      const data = await pipeline(config);
      return schema ? parseWith(schema, data, config) : data;
    } catch (error) {
      if (!config.skipGlobalError && !isAbortError(error)) {
        deps.publishError(extractErrorMessage(error));
      }
      throw error;
    }
  };
}
