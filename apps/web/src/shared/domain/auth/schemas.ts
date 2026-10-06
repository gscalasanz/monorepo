/**
 * Contrato de `/auth` (`auth/dtos/auth-response.dto.ts`, `interfaces/jwt-payload`).
 * Ojo: `tipo` es un `PersonaType` en minúscula (`educador`), no el
 * `'PROTAGONISTA' | 'EDUCADOR' | 'EXTERNA'` que asumía el Angular.
 */
import { z } from 'zod';

import { personaTypeSchema } from '@/shared/domain/persona';

export const authUserSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  email: z.string(),
  tipo: personaTypeSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;

/** Login, register y refresh (refresh rota el refresh token: guardar siempre el nuevo). */
export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: authUserSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

/** Payload del access token (el refresh agrega `tokenId`). `iat`/`exp` en segundos epoch. */
export const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  tipo: personaTypeSchema,
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export interface LoginDto {
  readonly email: string;
  readonly password: string;
}

export interface RegisterDto {
  readonly personaId: string;
  readonly email: string;
  readonly password: string;
}

export interface RefreshTokenDto {
  readonly refreshToken: string;
}

/** El backend exige `refreshToken` (sin él responde 400). */
export interface LogoutDto {
  readonly refreshToken: string;
}

export interface ChangePasswordDto {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface ChangeEmailDto {
  readonly newEmail: string;
  readonly currentPassword: string;
}
