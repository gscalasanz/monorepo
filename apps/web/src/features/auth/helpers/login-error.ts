import { isApiError } from '@/shared/api';
import { AUTH_FEATURE_COPY } from '@/features/auth/constants/copy';

const UNAUTHORIZED = 401;

/** Mensaje inline del login (paridad con `LoginComponent.handleLoginError`). */
export function loginErrorMessage(error: unknown): string {
  if (isApiError(error) && error.status === UNAUTHORIZED) {
    return AUTH_FEATURE_COPY.INVALID_CREDENTIALS;
  }
  if (error instanceof Error && error.message.length > 0) return error.message;
  return AUTH_FEATURE_COPY.LOGIN_FALLBACK;
}
