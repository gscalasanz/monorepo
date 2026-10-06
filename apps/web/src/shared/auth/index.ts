/**
 * `@/shared/auth` — sesión JWT (port de `modules/auth/services`, `authGuard`,
 * `authInterceptor`). Importar este módulo registra el refresh reactivo en el
 * cliente HTTP (sin efectos de DOM: SSR-safe).
 */
import { registerAuthBridge } from '@/shared/api';
import { sessionAuthBridge } from '@/shared/auth/bridge';

registerAuthBridge(sessionAuthBridge);

export {
  AUTH_COPY,
  EXPIRATION_BUFFER_SECONDS,
  REDIRECT_URL_KEY,
  TOKEN_KEYS,
} from './constants';
export {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasTokens,
  setTokens,
  type TokenPair,
} from './token-storage';
export {
  decodeJwt,
  isTokenExpiringSoon,
  isTokenValid,
  tokenRemainingSeconds,
} from './jwt';
export {
  consumeRedirectUrl,
  saveRedirectUrl,
  shouldSaveRedirectUrl,
} from './redirect-url';
export {
  evaluateAuthGuard,
  evaluateNoAuthGuard,
  type AuthGuardInput,
  type GuardDecision,
  type TokenValidity,
} from './guard';
export { createSingleFlight } from './single-flight';
export { navigateTo, setAuthNavigator, type AuthNavigator } from './navigation';
export { sessionStore, type SessionState } from './session-store';
export {
  changeEmail,
  changePassword,
  clearSession,
  initializeSession,
  login,
  logout,
  refreshSession,
  register,
} from './session';
export { sessionAuthBridge } from './bridge';
export {
  useRedirectIfAuthenticated,
  useRequireSession,
  useSession,
  type GuardState,
  type GuardStatus,
  type SessionView,
} from './hooks';
