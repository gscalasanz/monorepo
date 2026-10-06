import { authResponseSchema, authUserSchema, jwtPayloadSchema } from '@/shared/domain';

const USER = { id: 'per-2', nombre: 'Laura', email: 'laura@scout.ar', tipo: 'educador' };

describe('schemas de auth', () => {
  it('AuthResponseDto', () => {
    const response = authResponseSchema.parse({ accessToken: 'a', refreshToken: 'r', user: USER });
    expect(response.user.tipo).toBe('educador');
  });

  it('GET /auth/me: tipo es un PersonaType en minúscula (no PROTAGONISTA como asume el Angular)', () => {
    expect(authUserSchema.parse(USER).tipo).toBe('educador');
    expect(authUserSchema.safeParse({ ...USER, tipo: 'EDUCADOR' }).success).toBe(false);
  });

  it('payload del access token', () => {
    const payload = jwtPayloadSchema.parse({ sub: 'per-2', email: 'x@y.z', tipo: 'educador', iat: 1, exp: 2 });
    expect(payload.exp).toBe(2);
  });

  it('payload sin exp es inválido', () => {
    expect(jwtPayloadSchema.safeParse({ sub: 'per-2', email: 'x@y.z', tipo: 'educador', iat: 1 }).success).toBe(
      false,
    );
  });
});
