import { nowMs } from '@/shared/time';

/** Arma un JWT (firma falsa) con el payload dado. Solo para tests. */
function base64Url(value: string): string {
  const utf8 = String.fromCharCode(...new TextEncoder().encode(value));
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const SECONDS_PER_HOUR = 3600;

export function makeJwt(payload: Record<string, unknown>): string {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  return `${header}.${base64Url(JSON.stringify(payload))}.firma`;
}

/** Token del usuario de prueba que vence en `expiresInSeconds` (negativo = vencido). */
export function tokenExpiringIn(expiresInSeconds: number): string {
  const nowSeconds = Math.floor(nowMs() / 1000);
  return makeJwt({
    sub: 'per-2',
    email: 'laura@scout.ar',
    tipo: 'educador',
    iat: nowSeconds,
    exp: nowSeconds + expiresInSeconds,
  });
}
