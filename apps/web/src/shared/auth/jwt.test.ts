import {
  decodeJwt,
  isTokenValid,
  isTokenExpiringSoon,
  tokenRemainingSeconds,
} from '@/shared/auth';
import { makeJwt, tokenExpiringIn } from '@/shared/auth/testing/jwt';

const PAYLOAD = {
  sub: 'per-2',
  email: 'x@y.z',
  tipo: 'educador',
  iat: 1,
  exp: 2,
};

describe('decodeJwt (port de TokenService.decodeToken)', () => {
  it('decodifica el payload base64url', () => {
    expect(decodeJwt(makeJwt(PAYLOAD))).toEqual(PAYLOAD);
  });

  it('soporta caracteres que base64url cambia (- y _) y sin padding', () => {
    const email = 'ñandú+?>@scout.ar';
    expect(decodeJwt(makeJwt({ ...PAYLOAD, email }))?.email).toBe(email);
  });

  it.each([
    ['sin tres partes', 'a.b'],
    ['base64 inválido', 'a.%%%.c'],
    ['JSON inválido', `a.${btoa('no-json')}.c`],
    [
      'payload sin exp',
      makeJwt({ sub: 'x', email: 'x', tipo: 'educador', iat: 1 }),
    ],
  ])('devuelve null si %s', (_label, token) => {
    expect(decodeJwt(token)).toBeNull();
  });
});

describe('validez', () => {
  it('un token vigente es válido; vencido o basura no', () => {
    expect(isTokenValid(tokenExpiringIn(3600))).toBe(true);
    expect(isTokenValid(tokenExpiringIn(-1))).toBe(false);
    expect(isTokenValid('basura')).toBe(false);
    expect(isTokenValid(null)).toBe(false);
  });

  it('por vencer con buffer de 60 s', () => {
    expect(isTokenExpiringSoon(tokenExpiringIn(30))).toBe(true);
    expect(isTokenExpiringSoon(tokenExpiringIn(3600))).toBe(false);
    expect(isTokenExpiringSoon(null)).toBe(true);
  });

  it('segundos restantes (0 si vencido o inválido)', () => {
    expect(tokenRemainingSeconds(tokenExpiringIn(100))).toBeGreaterThan(98);
    expect(tokenRemainingSeconds(tokenExpiringIn(-100))).toBe(0);
    expect(tokenRemainingSeconds('basura')).toBe(0);
  });
});
