/**
 * Fachada del cliente HTTP: `get/post/patch/delete` con validación zod en el
 * borde, `getBlob` (backups/exports) y `getText` (ping). `apiClient` es la
 * instancia de la app; `createApiClient` existe para tests y composición.
 */
// Side-effect: cablea la sesión (token + refresh) en `apiClient`.
import '@/shared/auth/register';
import { ApiError } from '@/shared/api/api-error';
import {
  createRequester,
  type ApiClientDeps,
  type Requester,
  type RequestConfig,
  type RequestOptions,
  type ResponseSchema,
} from '@/shared/api/client';
import { API_BASE_URL } from '@/shared/api/env';
import { publishGlobalError } from '@/shared/api/global-errors';
import {
  getRegisteredAuthBridge,
  notifyApiActivity,
} from '@/shared/api/registry';
import type { HttpMethod } from '@/shared/api/retry';
import type { ResponseType } from '@/shared/api/transport';

export interface ReadOptions<T> extends RequestOptions {
  readonly schema: ResponseSchema<T>;
}

export interface WriteOptions extends RequestOptions {
  readonly body?: unknown;
}

export interface WriteOptionsWithSchema<T> extends WriteOptions {
  readonly schema: ResponseSchema<T>;
}

/** Mutación: sin `schema` resuelve `void` (el backend responde body vacío). */
export interface MutationFn {
  (endpoint: string, options?: WriteOptions): Promise<void>;
  <T>(endpoint: string, options: WriteOptionsWithSchema<T>): Promise<T>;
}

export interface ApiClient {
  get<T>(endpoint: string, options: ReadOptions<T>): Promise<T>;
  post: MutationFn;
  patch: MutationFn;
  delete: MutationFn;
  getBlob(endpoint: string, options?: RequestOptions): Promise<Blob>;
  getText(endpoint: string, options?: RequestOptions): Promise<string>;
}

const SUCCESS_STATUS = 200;

/** Duck-typed: el `Blob` de `Response` puede venir de otro realm (tests con jsdom). */
function isBlob(value: unknown): value is Blob {
  return (
    typeof value === 'object' &&
    value !== null &&
    'arrayBuffer' in value &&
    'size' in value
  );
}

function createMutation(request: Requester, method: HttpMethod): MutationFn {
  function mutate(endpoint: string, options?: WriteOptions): Promise<void>;
  function mutate<T>(
    endpoint: string,
    options: WriteOptionsWithSchema<T>,
  ): Promise<T>;
  async function mutate<T>(
    endpoint: string,
    options: WriteOptions & { readonly schema?: ResponseSchema<T> } = {},
  ): Promise<T | void> {
    const config: RequestConfig = {
      ...options,
      method,
      endpoint,
      responseType: 'json',
    };
    if (options.schema) return request.parsed(config, options.schema);
    await request.raw(config);
  }
  return mutate;
}

async function getBlobWith(
  request: Requester,
  config: RequestConfig,
): Promise<Blob> {
  const data = await request.raw(config);
  if (isBlob(data)) return data;
  throw new ApiError({
    kind: 'contract',
    status: SUCCESS_STATUS,
    method: config.method,
    url: config.endpoint,
  });
}

type GetTarget = Pick<RequestConfig, 'method' | 'endpoint' | 'responseType'>;

export function createApiClient(deps: ApiClientDeps): ApiClient {
  const request = createRequester(deps);
  const read = (endpoint: string, responseType: ResponseType): GetTarget => ({
    method: 'GET',
    endpoint,
    responseType,
  });

  return {
    get: (endpoint, options) =>
      request.parsed({ ...options, ...read(endpoint, 'json') }, options.schema),
    post: createMutation(request, 'POST'),
    patch: createMutation(request, 'PATCH'),
    delete: createMutation(request, 'DELETE'),
    getBlob: (endpoint, options = {}) =>
      getBlobWith(request, { ...options, ...read(endpoint, 'blob') }),
    getText: async (endpoint, options = {}) =>
      String(await request.raw({ ...options, ...read(endpoint, 'text') })),
  };
}

function isNavigatorOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Instancia de la app. SSR-safe: no toca `window` al importarse. */
export const apiClient: ApiClient = createApiClient({
  baseUrl: API_BASE_URL,
  fetchFn: (input, init) => fetch(input, init),
  sleep,
  random: Math.random,
  isOnline: isNavigatorOnline,
  publishError: publishGlobalError,
  onActivity: notifyApiActivity,
  getAuthBridge: getRegisteredAuthBridge,
});
