/**
 * Fachada del cliente HTTP: `get/post/patch/delete` con validación zod en el
 * borde, `getBlob` (backups/exports) y `getText` (ping). `apiClient` es la
 * instancia de la app; `createApiClient` existe para tests y composición.
 */
import { ApiError } from '@/shared/api/api-error';
import {
  createRequester,
  type ApiClientDeps,
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

export function createApiClient(deps: ApiClientDeps): ApiClient {
  const request = createRequester(deps);
  const call = <T>(
    config: RequestConfig,
    schema?: ResponseSchema<T>,
  ): Promise<T> => request(config, schema) as Promise<T>;

  const mutation = (method: HttpMethod): MutationFn =>
    (<T>(
      endpoint: string,
      options: WriteOptions & { schema?: ResponseSchema<T> } = {},
    ) =>
      call<T>(
        { ...options, method, endpoint, responseType: 'json' },
        options.schema,
      )) as MutationFn;

  return {
    get: (endpoint, options) =>
      call(
        { ...options, method: 'GET', endpoint, responseType: 'json' },
        options.schema,
      ),
    post: mutation('POST'),
    patch: mutation('PATCH'),
    delete: mutation('DELETE'),
    getBlob: async (endpoint, options = {}) => {
      const data = await request({
        ...options,
        method: 'GET',
        endpoint,
        responseType: 'blob',
      });
      if (isBlob(data)) return data;
      throw new ApiError({
        kind: 'contract',
        status: SUCCESS_STATUS,
        method: 'GET',
        url: endpoint,
      });
    },
    getText: async (endpoint, options = {}) =>
      String(
        await request({
          ...options,
          method: 'GET',
          endpoint,
          responseType: 'text',
        }),
      ),
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
