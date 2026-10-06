/** Llamadas HTTP de `/auth` (port de `AuthApiService`), sin estado. */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  authResponseSchema,
  authUserSchema,
  type AuthResponse,
  type AuthUser,
  type ChangeEmailDto,
  type ChangePasswordDto,
  type LoginDto,
  type RegisterDto,
} from '@/shared/domain';

const AUTHORIZATION_HEADER = 'Authorization';

export function loginRequest(dto: LoginDto): Promise<AuthResponse> {
  return apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
    body: dto,
    schema: authResponseSchema,
  });
}

export function registerRequest(dto: RegisterDto): Promise<AuthResponse> {
  return apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
    body: dto,
    schema: authResponseSchema,
  });
}

/** Sin error global: si falla, quien llama cierra la sesión. Rota el refresh token. */
export function refreshRequest(refreshToken: string): Promise<AuthResponse> {
  return apiClient.post(API_ENDPOINTS.AUTH_REFRESH, {
    body: { refreshToken },
    schema: authResponseSchema,
    skipGlobalError: true,
  });
}

export interface LogoutRequest {
  readonly refreshToken: string;
  readonly accessToken: string | null;
}

/**
 * Revoca el refresh token. Lleva el Bearer explícito porque se dispara justo
 * antes de limpiar los tokens; sin refresh ni error global (fire-and-forget).
 */
export function logoutRequest({
  refreshToken,
  accessToken,
}: LogoutRequest): Promise<void> {
  return apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {
    body: { refreshToken },
    headers: accessToken
      ? { [AUTHORIZATION_HEADER]: `Bearer ${accessToken}` }
      : {},
    skipAuth: true,
    skipGlobalError: true,
  });
}

export function meRequest(): Promise<AuthUser> {
  return apiClient.get(API_ENDPOINTS.AUTH_ME, { schema: authUserSchema });
}

export function changePasswordRequest(dto: ChangePasswordDto): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.AUTH_PASSWORD, { body: dto });
}

export function changeEmailRequest(dto: ChangeEmailDto): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.AUTH_EMAIL, { body: dto });
}
