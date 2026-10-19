/**
 * Reintentos ante errores transitorios (port de `core/interceptors/retry.interceptor.ts`):
 * - GET/HEAD/OPTIONS: 502, 503, 504 y 0 (red);
 * - mutaciones: solo 503 y 0 (el server seguro no procesó);
 * - nunca errores de negocio, nunca `auth/refresh`, nunca offline.
 * Backoff exponencial 1s · 2^intento + jitter (≤300 ms) para no sincronizar clientes.
 */
import { isApiError } from '@/shared/api/api-error';
import { HTTP_CONFIG, RETRY_EXCLUDED_ENDPOINTS } from '@/shared/api/endpoints';

export type HttpMethod =
  'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const READ_ONLY_METHODS: readonly HttpMethod[] = ['GET', 'HEAD', 'OPTIONS'];
const READ_RETRY_STATUSES: readonly number[] = [502, 503, 504];
const MUTATION_RETRY_STATUSES: readonly number[] = [503];
const BACKOFF_BASE = 2;

export interface RetryCheck {
  readonly error: unknown;
  readonly method: HttpMethod;
  readonly isOnline: () => boolean;
}

export function isRetryable({ error, method, isOnline }: RetryCheck): boolean {
  if (!isApiError(error)) return false;
  if (error.kind === 'network') return isOnline();
  if (error.kind !== 'http') return false;
  const statuses = READ_ONLY_METHODS.includes(method)
    ? READ_RETRY_STATUSES
    : MUTATION_RETRY_STATUSES;
  return statuses.includes(error.status);
}

export interface BackoffInput {
  /** 0 para el primer reintento. */
  readonly attempt: number;
  readonly random: () => number;
}

export function backoffDelay({ attempt, random }: BackoffInput): number {
  return (
    HTTP_CONFIG.RETRY_DELAY_MS * BACKOFF_BASE ** attempt +
    random() * HTTP_CONFIG.RETRY_MAX_JITTER_MS
  );
}

export interface RetryContext {
  readonly method: HttpMethod;
  readonly endpoint: string;
  readonly sleep: (ms: number) => Promise<void>;
  readonly random: () => number;
  readonly isOnline: () => boolean;
}

function isExcluded(endpoint: string): boolean {
  return RETRY_EXCLUDED_ENDPOINTS.some((pattern) => endpoint.includes(pattern));
}

export async function withRetry<T>(
  send: () => Promise<T>,
  context: RetryContext,
): Promise<T> {
  const maxAttempts = isExcluded(context.endpoint)
    ? 0
    : HTTP_CONFIG.RETRY_ATTEMPTS;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await send();
    } catch (error) {
      const retryable = isRetryable({
        error,
        method: context.method,
        isOnline: context.isOnline,
      });
      if (attempt >= maxAttempts || !retryable) throw error;
      await context.sleep(backoffDelay({ attempt, random: context.random }));
    }
  }
}
