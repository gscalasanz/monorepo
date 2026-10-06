/**
 * Decodificación y validez de JWT (port de `TokenService`). Solo lee el payload:
 * la firma la valida el backend. Un payload que no cumple el contrato
 * `{ sub, email, tipo, iat, exp }` se trata como token inválido.
 */
import { EXPIRATION_BUFFER_SECONDS } from '@/shared/auth/constants';
import { jwtPayloadSchema, type JwtPayload } from '@/shared/domain';
import { MS_PER_SECOND, nowMs } from '@/shared/time';

const JWT_PARTS = 3;
const BASE64_BLOCK = 4;

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padding =
    (BASE64_BLOCK - (base64.length % BASE64_BLOCK)) % BASE64_BLOCK;
  const binary = atob(base64 + '='.repeat(padding));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== JWT_PARTS) return null;
  try {
    const result = jwtPayloadSchema.safeParse(
      JSON.parse(base64UrlDecode(parts[1] ?? '')),
    );
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function nowSeconds(): number {
  return Math.floor(nowMs() / MS_PER_SECOND);
}

function expiresWithin(token: string | null, bufferSeconds: number): boolean {
  const payload = token ? decodeJwt(token) : null;
  return payload === null || payload.exp < nowSeconds() + bufferSeconds;
}

/** Decodificable y no vencido. */
export function isTokenValid(token: string | null): boolean {
  return !expiresWithin(token, 0);
}

/** Vencido, inválido o vence dentro de 60 s. */
export function isTokenExpiringSoon(token: string | null): boolean {
  return expiresWithin(token, EXPIRATION_BUFFER_SECONDS);
}

export function tokenRemainingSeconds(token: string): number {
  const payload = decodeJwt(token);
  return payload ? Math.max(0, payload.exp - nowSeconds()) : 0;
}
