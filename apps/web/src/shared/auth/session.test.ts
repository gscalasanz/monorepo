import { apiClient, ApiError, globalErrorStore } from '@/shared/api';
import {
  AUTH_COPY,
  changeEmail,
  changePassword,
  getAccessToken,
  getRefreshToken,
  initializeSession,
  login,
  logout,
  register,
  sessionStore,
  setAuthNavigator,
  setTokens,
} from '@/shared/auth';
import { tokenExpiringIn } from '@/shared/auth/testing/jwt';
import {
  createFakeFetch,
  type FakeFetch,
} from '@/shared/api/testing/fake-fetch';
import { z } from 'zod';

const USER = {
  id: 'per-2',
  nombre: 'Laura',
  email: 'laura@scout.ar',
  tipo: 'educador',
} as const;
const BASE = 'http://localhost:3001/api/v1';
const okSchema = z.object({ ok: z.boolean() });

let fake: FakeFetch;
let navigations: string[];

function authResponse(accessToken: string, refreshToken: string) {
  return { status: 200, body: { accessToken, refreshToken, user: USER } };
}

beforeEach(() => {
  localStorage.clear();
  sessionStore.setState({ user: null, isLoading: false, initialized: false });
  globalErrorStore.setState({ errors: [] });
  fake = createFakeFetch();
  vi.stubGlobal('fetch', fake.fetchFn);
  navigations = [];
  setAuthNavigator((path) => navigations.push(path));
});

afterEach(() => {
  vi.unstubAllGlobals();
  setAuthNavigator(null);
});

describe('login / register', () => {
  it('login guarda tokens y usuario', async () => {
    fake.reply(authResponse('acc', 'ref'));
    await expect(
      login({ email: 'laura@scout.ar', password: 'x' }),
    ).resolves.toEqual(USER);
    expect(fake.requests[0]).toMatchObject({
      url: `${BASE}/auth/login`,
      method: 'POST',
    });
    expect(fake.requests[0]?.headers.authorization).toBeUndefined();
    expect(getAccessToken()).toBe('acc');
    expect(getRefreshToken()).toBe('ref');
    expect(sessionStore.getState()).toMatchObject({
      user: USER,
      isLoading: false,
    });
  });

  it('login fallido no guarda nada y apaga el loading', async () => {
    fake.reply({
      status: 401,
      body: { statusCode: 401, message: 'Credenciales inválidas' },
    });
    await expect(login({ email: 'x', password: 'y' })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(getAccessToken()).toBeNull();
    expect(sessionStore.getState().isLoading).toBe(false);
  });

  it('si no se pueden guardar los tokens, el login falla con un mensaje claro', async () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
    fake.reply(authResponse('acc', 'ref'));
    await expect(login({ email: 'x', password: 'y' })).rejects.toThrow(
      AUTH_COPY.STORAGE_UNAVAILABLE,
    );
    expect(sessionStore.getState().user).toBeNull();
    spy.mockRestore();
  });

  it('register también inicia sesión', async () => {
    fake.reply(authResponse('acc', 'ref'));
    await register({
      personaId: 'per-2',
      email: 'l@s.ar',
      password: 'Abcdefg1',
    });
    expect(fake.requests[0]?.url).toBe(`${BASE}/auth/register`);
    expect(sessionStore.getState().user).toEqual(USER);
  });
});

describe('logout', () => {
  it('POST auth/logout con refreshToken y Bearer, limpia y va a /login', () => {
    setTokens({ accessToken: 'acc', refreshToken: 'ref' });
    sessionStore.setState({ user: USER });
    fake.reply({ status: 204 });
    logout();
    expect(fake.requests[0]).toMatchObject({
      url: `${BASE}/auth/logout`,
      method: 'POST',
      body: { refreshToken: 'ref' },
    });
    expect(fake.requests[0]?.headers.authorization).toBe('Bearer acc');
    expect(getAccessToken()).toBeNull();
    expect(sessionStore.getState().user).toBeNull();
    expect(navigations).toEqual(['/login']);
  });

  it('si el logout del backend falla no muestra error global (fire-and-forget)', async () => {
    setTokens({ accessToken: 'acc', refreshToken: 'ref' });
    fake.reply({ status: 401 });
    logout();
    await vi.waitFor(() => expect(fake.requests).toHaveLength(1));
    await new Promise((r) => setTimeout(r, 0));
    expect(globalErrorStore.getState().errors).toEqual([]);
  });

  it('sin tokens no llama al backend pero igual limpia y redirige', () => {
    logout();
    expect(fake.requests).toHaveLength(0);
    expect(navigations).toEqual(['/login']);
  });
});

describe('cambio de password y email', () => {
  beforeEach(() => {
    setTokens({ accessToken: tokenExpiringIn(3600), refreshToken: 'ref' });
    sessionStore.setState({ user: USER });
  });

  it('cambiar password invalida sesiones: limpia y fuerza login', async () => {
    fake.reply({ status: 204 });
    await changePassword({ currentPassword: 'a', newPassword: 'B' });
    expect(fake.requests[0]).toMatchObject({
      url: `${BASE}/auth/password`,
      method: 'PATCH',
    });
    expect(getAccessToken()).toBeNull();
    expect(navigations).toEqual(['/login']);
  });

  it('cambiar email actualiza el usuario de la sesión', async () => {
    fake.reply({ status: 204 });
    await changeEmail({ newEmail: 'nuevo@scout.ar', currentPassword: 'a' });
    expect(fake.requests[0]).toMatchObject({
      url: `${BASE}/auth/email`,
      method: 'PATCH',
    });
    expect(sessionStore.getState().user?.email).toBe('nuevo@scout.ar');
  });

  it('un error deja la sesión intacta y propaga', async () => {
    fake.reply({
      status: 400,
      body: { message: 'Contraseña actual incorrecta' },
    });
    await expect(
      changePassword({ currentPassword: 'x', newPassword: 'y' }),
    ).rejects.toThrow('Contraseña actual incorrecta');
    expect(getRefreshToken()).toBe('ref');
    expect(sessionStore.getState().isLoading).toBe(false);
  });
});

describe('initializeSession (port de initializeFromStorage)', () => {
  it('sin tokens → anónimo, sin requests', async () => {
    await expect(initializeSession()).resolves.toBeNull();
    expect(fake.requests).toHaveLength(0);
    expect(sessionStore.getState().initialized).toBe(true);
  });

  it('access válido → GET auth/me', async () => {
    setTokens({
      accessToken: tokenExpiringIn(3600),
      refreshToken: tokenExpiringIn(7200),
    });
    fake.reply({ status: 200, body: USER });
    await expect(initializeSession()).resolves.toEqual(USER);
    expect(fake.requests[0]?.url).toBe(`${BASE}/auth/me`);
  });

  it('access vencido y refresh válido → refresh y después me', async () => {
    const fresh = tokenExpiringIn(3600);
    setTokens({
      accessToken: tokenExpiringIn(-10),
      refreshToken: tokenExpiringIn(7200),
    });
    fake.reply(authResponse(fresh, 'ref2'), { status: 200, body: USER });
    await expect(initializeSession()).resolves.toEqual(USER);
    expect(fake.requests.map((r) => r.url)).toEqual([
      `${BASE}/auth/refresh`,
      `${BASE}/auth/me`,
    ]);
    expect(fake.requests[1]?.headers.authorization).toBe(`Bearer ${fresh}`);
    expect(getRefreshToken()).toBe('ref2');
  });

  it('ambos vencidos → limpia y anónimo', async () => {
    setTokens({
      accessToken: tokenExpiringIn(-10),
      refreshToken: tokenExpiringIn(-10),
    });
    await expect(initializeSession()).resolves.toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it('si me falla → limpia y anónimo (el error no rompe el arranque)', async () => {
    setTokens({
      accessToken: tokenExpiringIn(3600),
      refreshToken: tokenExpiringIn(7200),
    });
    fake.reply({ status: 500 });
    await expect(initializeSession()).resolves.toBeNull();
    expect(getAccessToken()).toBeNull();
  });
});

describe('refresh reactivo ante 401 (AuthBridge registrado por @/shared/auth)', () => {
  it('N requests concurrentes con 401 → una sola llamada a auth/refresh y se reintentan todas', async () => {
    const stale = tokenExpiringIn(-10);
    const fresh = tokenExpiringIn(3600);
    setTokens({ accessToken: stale, refreshToken: 'ref' });
    fake.reply(
      { status: 401 },
      { status: 401 },
      { status: 401 },
      authResponse(fresh, 'ref2'),
      { status: 200, body: { ok: true } },
      { status: 200, body: { ok: true } },
      { status: 200, body: { ok: true } },
    );
    const results = await Promise.all([
      apiClient.get('a', { schema: okSchema }),
      apiClient.get('b', { schema: okSchema }),
      apiClient.get('c', { schema: okSchema }),
    ]);
    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    const refreshCalls = fake.requests.filter((r) =>
      r.url.endsWith('/auth/refresh'),
    );
    expect(refreshCalls).toHaveLength(1);
    expect(refreshCalls[0]?.body).toEqual({ refreshToken: 'ref' });
    expect(
      fake.requests
        .slice(4)
        .every((r) => r.headers.authorization === `Bearer ${fresh}`),
    ).toBe(true);
    expect(globalErrorStore.getState().errors).toEqual([]);
  });

  it('un 401 que llega después de que otro request ya refrescó reusa el token nuevo', async () => {
    const fresh = tokenExpiringIn(3600);
    setTokens({ accessToken: 'viejo', refreshToken: 'ref' });
    fake.reply({ status: 401 });
    const pending = apiClient.get('a', { schema: okSchema });
    setTokens({ accessToken: fresh, refreshToken: 'ref2' });
    fake.reply({ status: 200, body: { ok: true } });
    await expect(pending).resolves.toEqual({ ok: true });
    expect(fake.requests.some((r) => r.url.endsWith('/auth/refresh'))).toBe(
      false,
    );
  });

  it('si el refresh falla: rechaza todas, un solo logout, limpia y va a /login', async () => {
    setTokens({ accessToken: tokenExpiringIn(-10), refreshToken: 'ref' });
    fake.reply(
      { status: 401 },
      { status: 401 },
      {
        status: 401,
        body: { statusCode: 401, message: 'Refresh token inválido' },
      },
      { status: 401 },
    );
    const results = await Promise.allSettled([
      apiClient.get('a', { schema: okSchema }),
      apiClient.get('b', { schema: okSchema }),
    ]);
    expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected']);
    await vi.waitFor(() =>
      expect(
        fake.requests.filter((r) => r.url.endsWith('/auth/logout')),
      ).toHaveLength(1),
    );
    expect(
      fake.requests.filter((r) => r.url.endsWith('/auth/refresh')),
    ).toHaveLength(1);
    expect(getAccessToken()).toBeNull();
    expect(navigations).toEqual(['/login']);
    expect(globalErrorStore.getState().errors.map((e) => e.message)).toEqual([
      'Refresh token inválido',
      'Refresh token inválido',
    ]);
  });

  it('sesión ya cerrada (sin refresh token): rechaza sin refresh, sin logout ni navegación', async () => {
    localStorage.setItem('accessToken', 'acc');
    fake.reply({ status: 401 });
    await expect(apiClient.get('a', { schema: okSchema })).rejects.toThrow(
      AUTH_COPY.NO_REFRESH_TOKEN,
    );
    expect(fake.requests.map((r) => r.url)).toEqual([`${BASE}/a`]);
    expect(navigations).toEqual([]);
  });
});
