/**
 * `@/shared/api` — cliente HTTP (fetch) con error global, auth/refresh, retry y
 * keep-alive, `ApiError` tipado, endpoints y bus de errores globales.
 */
export { API_BASE_URL, parseApiBaseUrl } from './env';
export { pathSegment } from './path-segment';
export {
  API_ENDPOINTS,
  HTTP_CONFIG,
  QUERY_PARAMS,
  RETRY_EXCLUDED_ENDPOINTS,
  UNAUTHENTICATED_ENDPOINTS,
} from './endpoints';
export {
  buildUrl,
  type QueryParams,
  type QueryValue,
  type UrlParts,
} from './build-url';
export {
  ApiError,
  extractErrorMessage,
  isApiError,
  nestMessageOf,
  type ApiErrorInit,
  type ApiErrorKind,
} from './api-error';
export { API_ERROR_COPY, HTTP_STATUS_MESSAGES } from './copy';
export {
  backoffDelay,
  isRetryable,
  withRetry,
  type HttpMethod,
  type RetryContext,
} from './retry';
export {
  dismissGlobalError,
  globalErrorStore,
  publishGlobalError,
  useGlobalErrors,
  type GlobalError,
} from './global-errors';
export {
  getRegisteredAuthBridge,
  notifyApiActivity,
  registerAuthBridge,
  setActivityListener,
  type AuthBridge,
} from './registry';
export type { ApiClientDeps, RequestOptions, ResponseSchema } from './client';
export {
  apiClient,
  createApiClient,
  type ApiClient,
  type MutationFn,
  type ReadOptions,
  type WriteOptions,
  type WriteOptionsWithSchema,
} from './api-client';
export {
  KEEP_ALIVE_MS,
  createKeepAlive,
  type KeepAlive,
  type KeepAliveDeps,
} from './keep-alive';
export { useKeepAlive } from './use-keep-alive';
