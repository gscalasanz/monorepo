/**
 * Operaciones de sesión (port de `AuthStateService`). Única fuente de verdad del
 * estado de auth: tokens en storage + usuario en `sessionStore`.
 */
import {
  changeEmailRequest,
  changePasswordRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  registerRequest,
} from '@/shared/auth/auth-api';
import { AUTH_COPY } from '@/shared/auth/constants';
import { isTokenValid } from '@/shared/auth/jwt';
import { navigateTo } from '@/shared/auth/navigation';
import { sessionStore } from '@/shared/auth/session-store';
import { createSingleFlight } from '@/shared/auth/single-flight';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasTokens,
  setTokens,
} from '@/shared/auth/token-storage';
import { APP_ROUTES } from '@/shared/constants';
import type {
  AuthResponse,
  AuthUser,
  ChangeEmailDto,
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from '@/shared/domain';

function applyAuthResponse(response: AuthResponse): AuthUser {
  setTokens(response);
  sessionStore.setState({ user: response.user });
  return response.user;
}

export function clearSession(): void {
  clearTokens();
  sessionStore.setState({ user: null });
}

/** Marca loading durante `task` y lo apaga siempre (equivale a `finalize`). */
async function withLoading<T>(task: () => Promise<T>): Promise<T> {
  sessionStore.setState({ isLoading: true });
  try {
    return await task();
  } finally {
    sessionStore.setState({ isLoading: false });
  }
}

export function login(credentials: LoginDto): Promise<AuthUser> {
  return withLoading(async () =>
    applyAuthResponse(await loginRequest(credentials)),
  );
}

export function register(dto: RegisterDto): Promise<AuthUser> {
  return withLoading(async () => applyAuthResponse(await registerRequest(dto)));
}

/**
 * Cierra la sesión: POST `auth/logout` fire-and-forget (con los tokens actuales,
 * antes de borrarlos), limpia el estado y va a `/login`.
 */
export function logout(): void {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    logoutRequest({ refreshToken, accessToken: getAccessToken() }).catch(() => {
      // Intencional: el estado local se limpia igual (paridad con Angular).
    });
  }
  clearSession();
  navigateTo(APP_ROUTES.LOGIN);
}

/** El backend invalida todas las sesiones: se fuerza un login nuevo. */
export function changePassword(dto: ChangePasswordDto): Promise<void> {
  return withLoading(async () => {
    await changePasswordRequest(dto);
    clearSession();
    navigateTo(APP_ROUTES.LOGIN);
  });
}

export function changeEmail(dto: ChangeEmailDto): Promise<void> {
  return withLoading(async () => {
    await changeEmailRequest(dto);
    const { user } = sessionStore.getState();
    if (user) sessionStore.setState({ user: { ...user, email: dto.newEmail } });
  });
}

async function performRefresh(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error(AUTH_COPY.NO_REFRESH_TOKEN);
  const response = await refreshRequest(refreshToken);
  applyAuthResponse(response);
  return response;
}

/** Renueva la sesión (una sola llamada a `auth/refresh` aunque lo pidan N a la vez). */
export const refreshSession: () => Promise<AuthResponse> =
  createSingleFlight(performRefresh);

async function restoreSession(): Promise<AuthUser | null> {
  if (!hasTokens()) return null;
  if (!isTokenValid(getAccessToken())) {
    if (!isTokenValid(getRefreshToken())) {
      clearSession();
      return null;
    }
    await refreshSession();
  }
  const user = await meRequest();
  sessionStore.setState({ user });
  return user;
}

/**
 * Restaura la sesión al arrancar (port de `initializeFromStorage` + el
 * `APP_INITIALIZER`, que ignora fallos): cualquier error → sesión anónima.
 */
export async function initializeSession(): Promise<AuthUser | null> {
  try {
    return await restoreSession();
  } catch {
    clearSession();
    return null;
  } finally {
    sessionStore.setState({ initialized: true });
  }
}
