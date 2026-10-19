import { evaluateAuthGuard, evaluateNoAuthGuard } from '@/shared/auth';

describe('evaluateAuthGuard (port de authGuard)', () => {
  it('deja pasar con access token válido', () => {
    expect(
      evaluateAuthGuard({
        accessValid: true,
        refreshValid: false,
        currentUrl: '/cajas',
      }),
    ).toEqual({ allowed: true });
  });

  it('deja pasar con solo el refresh válido (el cliente refresca en el primer request)', () => {
    expect(
      evaluateAuthGuard({
        accessValid: false,
        refreshValid: true,
        currentUrl: '/cajas',
      }),
    ).toEqual({ allowed: true });
  });

  it('sin tokens válidos manda a /login y guarda la URL intentada', () => {
    expect(
      evaluateAuthGuard({
        accessValid: false,
        refreshValid: false,
        currentUrl: '/cajas?x=1',
      }),
    ).toEqual({
      allowed: false,
      redirectTo: '/login',
      redirectUrlToSave: '/cajas?x=1',
    });
  });

  it.each(['/', '/login'])('no guarda %s como redirectUrl', (currentUrl) => {
    expect(
      evaluateAuthGuard({
        accessValid: false,
        refreshValid: false,
        currentUrl,
      }),
    ).toEqual({
      allowed: false,
      redirectTo: '/login',
      redirectUrlToSave: null,
    });
  });
});

describe('evaluateNoAuthGuard (login: si ya hay sesión va al dashboard)', () => {
  it('con algún token válido redirige al dashboard', () => {
    expect(
      evaluateNoAuthGuard({ accessValid: false, refreshValid: true }),
    ).toEqual({
      allowed: false,
      redirectTo: '/dashboard',
    });
  });

  it('sin sesión deja ver el login', () => {
    expect(
      evaluateNoAuthGuard({ accessValid: false, refreshValid: false }),
    ).toEqual({
      allowed: true,
    });
  });
});
