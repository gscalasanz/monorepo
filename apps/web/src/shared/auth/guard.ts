/** Lógica pura de los guards de Angular (`authGuard`, `noAuthGuard`). */
import { shouldSaveRedirectUrl } from '@/shared/auth/redirect-url';
import { APP_ROUTES } from '@/shared/constants';

export interface TokenValidity {
  readonly accessValid: boolean;
  readonly refreshValid: boolean;
}

export interface AuthGuardInput extends TokenValidity {
  /** `pathname + search` actual. */
  readonly currentUrl: string;
}

export type GuardDecision =
  | { readonly allowed: true }
  | {
      readonly allowed: false;
      readonly redirectTo: string;
      readonly redirectUrlToSave?: string | null;
    };

/**
 * Deja pasar si el access O el refresh son válidos (el cliente refresca en el
 * primer request). Si no, a `/login` guardando la URL intentada.
 */
export function evaluateAuthGuard({
  accessValid,
  refreshValid,
  currentUrl,
}: AuthGuardInput): GuardDecision {
  if (accessValid || refreshValid) return { allowed: true };
  return {
    allowed: false,
    redirectTo: APP_ROUTES.LOGIN,
    redirectUrlToSave: shouldSaveRedirectUrl(currentUrl) ? currentUrl : null,
  };
}

/** Login: si ya hay sesión, al dashboard. */
export function evaluateNoAuthGuard({
  accessValid,
  refreshValid,
}: TokenValidity): GuardDecision {
  if (accessValid || refreshValid)
    return { allowed: false, redirectTo: APP_ROUTES.DASHBOARD };
  return { allowed: true };
}
