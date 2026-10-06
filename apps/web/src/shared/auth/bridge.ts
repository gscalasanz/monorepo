/**
 * `AuthBridge` que usa el cliente HTTP (`@/shared/api`) para el refresh reactivo
 * ante 401 (port de `authInterceptor.handle401Error`).
 */
import type { AuthBridge } from '@/shared/api';
import { isTokenValid } from '@/shared/auth/jwt';
import { logout, refreshSession } from '@/shared/auth/session';
import { createSingleFlight } from '@/shared/auth/single-flight';
import { AUTH_COPY } from '@/shared/auth/constants';
import { getAccessToken, getRefreshToken } from '@/shared/auth/token-storage';

/** Un solo refresh (y, si falla, un solo logout) para todos los 401 concurrentes. */
const refreshOrLogout = createSingleFlight(async (): Promise<string> => {
  try {
    return (await refreshSession()).accessToken;
  } catch (error) {
    logout();
    throw error;
  }
});

export const sessionAuthBridge: AuthBridge = {
  getAccessToken,
  async refreshAccessToken(staleToken) {
    const current = getAccessToken();
    // Otro request ya refrescó mientras este volaba: reusar el token nuevo.
    if (current && current !== staleToken && isTokenValid(current))
      return current;
    // Sesión ya cerrada (otro logout la limpió): no repetir logout/navegación/toasts.
    if (!getRefreshToken()) throw new Error(AUTH_COPY.NO_REFRESH_TOKEN);
    return refreshOrLogout();
  },
};
