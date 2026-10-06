import { z } from 'zod';

import {
  ApiError,
  apiClient,
  bearerHeaders,
  createApiClient,
  globalErrorStore,
  registerAuthBridge,
  setActivityListener,
  type AuthBridge,
} from '@/shared/api';
import {
  createFakeFetch,
  type FakeFetch,
} from '@/shared/api/testing/fake-fetch';

const BASE = 'http://api.test/api/v1';
const EXPIRED_TOKEN = 'expired-token';
const FRESH_TOKEN = 'fresh-token';
const UNAUTHORIZED = {
  status: 401,
  body: { statusCode: 401, message: 'Unauthorized' },
};
const itemSchema = z.object({ id: z.string() });

interface Harness {
  readonly fake: FakeFetch;
  readonly published: string[];
  readonly activity: { count: number };
  readonly client: ReturnType<typeof createApiClient>;
}

function setup(auth?: AuthBridge): Harness {
  const fake = createFakeFetch();
  const published: string[] = [];
  const activity = { count: 0 };
  const client = createApiClient({
    baseUrl: BASE,
    fetchFn: fake.fetchFn,
    sleep: async () => undefined,
    random: () => 0,
    isOnline: () => true,
    publishError: (message) => published.push(message),
    onActivity: () => {
      activity.count += 1;
    },
    getAuthBridge: () => auth ?? null,
  });
  return { fake, published, activity, client };
}

function bridgeWith(overrides: Partial<AuthBridge> = {}): AuthBridge {
  return {
    getAccessToken: () => EXPIRED_TOKEN,
    refreshAccessToken: vi.fn(async () => FRESH_TOKEN),
    ...overrides,
  };
}

describe('createApiClient — transporte', () => {
  it('GET con query params y respuesta validada con zod', async () => {
    const { fake, client } = setup();
    fake.reply({ status: 200, body: [{ id: 'a', extra: true }] });
    const result = await client.get('personas', {
      schema: z.array(itemSchema),
      params: { tipo: 'protagonista', vacio: '' },
    });
    expect(result).toEqual([{ id: 'a' }]);
    expect(fake.requests[0]).toMatchObject({
      url: `${BASE}/personas?tipo=protagonista`,
      method: 'GET',
    });
  });

  it('POST manda JSON y devuelve undefined si el backend responde body vacío', async () => {
    const { fake, client } = setup();
    fake.reply({ status: 201 });
    await expect(
      client.post('campamentos/c1/gastos', { body: { monto: 10 } }),
    ).resolves.toBeUndefined();
    expect(fake.requests[0]).toMatchObject({
      method: 'POST',
      body: { monto: 10 },
    });
    expect(fake.requests[0]?.headers['content-type']).toBe('application/json');
  });

  it('una mutación sin schema resuelve undefined aunque el backend mande body', async () => {
    const { fake, client } = setup();
    fake.reply({ status: 200, body: { id: 'x' } });
    await expect(client.delete('eventos/e1')).resolves.toBeUndefined();
  });

  it('PATCH y DELETE con schema', async () => {
    const { fake, client } = setup();
    fake.reply(
      { status: 200, body: { id: 'p' } },
      { status: 200, body: { id: 'd' } },
    );
    await expect(
      client.patch('personas/p', { body: {}, schema: itemSchema }),
    ).resolves.toEqual({ id: 'p' });
    await expect(client.delete('x/d', { schema: itemSchema })).resolves.toEqual(
      { id: 'd' },
    );
    expect(fake.requests.map((r) => r.method)).toEqual(['PATCH', 'DELETE']);
  });

  it('descarga blobs (backups) y texto', async () => {
    const { fake, client } = setup();
    fake.reply({ blobText: 'zip' }, { status: 200, raw: 'Hello World!' });
    const blob = await client.getBlob('backups/download');
    expect(await blob.text()).toBe('zip');
    await expect(client.getText('')).resolves.toBe('Hello World!');
  });

  it('una respuesta que no cumple el schema es un ApiError de contrato', async () => {
    const { fake, client, published } = setup();
    fake.reply({ status: 200, body: [{ nope: 1 }] });
    const error = await client
      .get('x', { schema: z.array(itemSchema) })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: 'contract', status: 200 });
    expect(published).toHaveLength(1);
  });

  it('el error de contrato trae los issues de zod (path + message) y se loguea en dev', async () => {
    const { fake, client } = setup();
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fake.reply({ status: 200, body: [{ id: 'a' }, { id: 7 }] });
    const error = await client
      .get('cajas', { schema: z.array(itemSchema) })
      .catch((e: unknown) => e);
    expect(error).toMatchObject({
      kind: 'contract',
      issues: [{ path: '1.id', message: expect.any(String) }],
    });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('GET cajas'), [
      { path: '1.id', message: expect.any(String) },
    ]);
    log.mockRestore();
  });

  it('JSON inválido también es error de contrato', async () => {
    const { fake, client } = setup();
    fake.reply({ status: 200, raw: '<html>' });
    await expect(client.get('x', { schema: itemSchema })).rejects.toMatchObject(
      { kind: 'contract' },
    );
  });

  it('notifica actividad (keep-alive) salvo en los pings', async () => {
    const { fake, client, activity } = setup();
    fake.reply({ status: 200, body: { id: 'a' } }, { status: 200, raw: 'ok' });
    await client.get('x', { schema: itemSchema });
    await client.getText('', { isKeepAlive: true });
    expect(activity.count).toBe(1);
  });
});

describe('createApiClient — seguridad', () => {
  it('un endpoint que escapa de la base nunca llega a fetch', async () => {
    const { fake, client } = setup(bridgeWith());
    await expect(
      client.get('eventos/../../../otro', { schema: itemSchema }),
    ).rejects.toThrow(/fuera de la URL base/);
    expect(fake.requests).toHaveLength(0);
  });
});

describe('createApiClient — errores globales', () => {
  it('un 4xx publica el mensaje de NestJS y propaga el ApiError', async () => {
    const { fake, client, published } = setup();
    fake.reply({
      status: 404,
      body: {
        statusCode: 404,
        message: 'Evento no encontrado',
        error: 'Not Found',
      },
    });
    await expect(
      client.get('eventos/e', { schema: itemSchema }),
    ).rejects.toMatchObject({ status: 404 });
    expect(published).toEqual(['Evento no encontrado']);
  });

  it('skipGlobalError no publica pero igual propaga (reporte público 404)', async () => {
    const { fake, client, published } = setup();
    fake.reply({
      status: 404,
      body: { statusCode: 404, message: 'Not Found' },
    });
    await expect(
      client.get('eventos/e/reporte/publico', {
        schema: itemSchema,
        skipGlobalError: true,
      }),
    ).rejects.toMatchObject({ status: 404 });
    expect(published).toEqual([]);
  });

  it('error de red: reintenta el GET y al final publica el mensaje de conexión', async () => {
    const { fake, client, published } = setup();
    fake.reply(
      { networkError: true },
      { networkError: true },
      { networkError: true },
      { networkError: true },
    );
    await expect(client.get('x', { schema: itemSchema })).rejects.toMatchObject(
      { status: 0, kind: 'network' },
    );
    expect(fake.requests).toHaveLength(4);
    expect(published).toEqual([
      'No se pudo conectar con el servidor. Verifique su conexión.',
    ]);
  });

  it('un abort del caller no se reintenta ni dispara error global', async () => {
    const { client, published } = setup();
    const controller = new AbortController();
    controller.abort();
    await expect(
      client.get('x', { schema: itemSchema, signal: controller.signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(published).toEqual([]);
  });
});

describe('createApiClient — auth (port de app-http-interceptors.spec)', () => {
  it('agrega el Bearer del access token', async () => {
    const { fake, client } = setup(bridgeWith({ getAccessToken: () => 'tok' }));
    fake.reply({ status: 200, body: { id: 'a' } });
    await client.get('auth/me', { schema: itemSchema });
    expect(fake.requests[0]?.headers.authorization).toBe('Bearer tok');
  });

  it('no muestra error global si el 401 se resuelve refrescando el token', async () => {
    const bridge = bridgeWith();
    const { fake, client, published } = setup(bridge);
    fake.reply(UNAUTHORIZED, { status: 200, body: { id: 'ok' } });
    await expect(
      client.get('backups/download-meta', { schema: itemSchema }),
    ).resolves.toEqual({ id: 'ok' });
    expect(bridge.refreshAccessToken).toHaveBeenCalledWith(EXPIRED_TOKEN);
    expect(fake.requests[1]?.headers.authorization).toBe(
      `Bearer ${FRESH_TOKEN}`,
    );
    expect(published).toEqual([]);
  });

  it('muestra un único error global si el refresh también falla', async () => {
    const refreshError = new ApiError({
      kind: 'http',
      status: 401,
      body: { message: 'Refresh token inválido' },
      method: 'POST',
      url: 'auth/refresh',
    });
    const bridge = bridgeWith({
      refreshAccessToken: vi.fn(async () => Promise.reject(refreshError)),
    });
    const { fake, client, published } = setup(bridge);
    fake.reply(UNAUTHORIZED);
    await expect(client.get('x', { schema: itemSchema })).rejects.toBe(
      refreshError,
    );
    expect(published).toEqual(['Refresh token inválido']);
  });

  it('un 401 sin token no intenta refrescar', async () => {
    const bridge = bridgeWith({ getAccessToken: () => null });
    const { fake, client } = setup(bridge);
    fake.reply(UNAUTHORIZED);
    await expect(client.get('x', { schema: itemSchema })).rejects.toMatchObject(
      { status: 401 },
    );
    expect(bridge.refreshAccessToken).not.toHaveBeenCalled();
    expect(fake.requests[0]?.headers.authorization).toBeUndefined();
  });

  it.each(['auth/login', 'auth/register', 'auth/refresh'])(
    '%s va sin token y sin refresh',
    async (endpoint) => {
      const bridge = bridgeWith();
      const { fake, client } = setup(bridge);
      fake.reply(UNAUTHORIZED);
      await expect(client.post(endpoint, { body: {} })).rejects.toMatchObject({
        status: 401,
      });
      expect(fake.requests[0]?.headers.authorization).toBeUndefined();
      expect(bridge.refreshAccessToken).not.toHaveBeenCalled();
    },
  );

  it('skipAuth respeta el Authorization explícito y no refresca (logout)', async () => {
    const bridge = bridgeWith();
    const { fake, client } = setup(bridge);
    fake.reply(UNAUTHORIZED);
    await expect(
      client.post('auth/logout', {
        body: {},
        skipAuth: true,
        headers: { Authorization: 'Bearer old' },
      }),
    ).rejects.toBeTruthy();
    expect(fake.requests[0]?.headers.authorization).toBe('Bearer old');
    expect(bridge.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('el retry corre adentro del auth: un 503 transitorio se reintenta con el mismo token', async () => {
    const { fake, client } = setup(bridgeWith({ getAccessToken: () => 'tok' }));
    fake.reply({ status: 503 }, { status: 200, body: { id: 'ok' } });
    await expect(client.get('x', { schema: itemSchema })).resolves.toEqual({
      id: 'ok',
    });
    expect(fake.requests.map((r) => r.headers.authorization)).toEqual([
      'Bearer tok',
      'Bearer tok',
    ]);
  });
});

describe('bearerHeaders', () => {
  it('arma el Authorization Bearer, o nada sin token', () => {
    expect(bearerHeaders('abc')).toEqual({ Authorization: 'Bearer abc' });
    expect(bearerHeaders(null)).toEqual({});
  });
});

describe('apiClient (instancia de la app)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    registerAuthBridge(null);
    globalErrorStore.setState({ errors: [] });
  });

  it('usa fetch global, la base de NEXT_PUBLIC_API_URL y el AuthBridge registrado', async () => {
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    registerAuthBridge(bridgeWith({ getAccessToken: () => 'tok' }));
    fake.reply({ status: 200, body: { id: 'a' } });
    await expect(
      apiClient.get('auth/me', { schema: itemSchema }),
    ).resolves.toEqual({ id: 'a' });
    expect(fake.requests[0]).toMatchObject({
      url: 'http://localhost:3001/api/v1/auth/me',
    });
    expect(fake.requests[0]?.headers.authorization).toBe('Bearer tok');
  });

  it('publica en el bus global y notifica actividad al listener registrado', async () => {
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    const listener = vi.fn();
    setActivityListener(listener);
    fake.reply({
      status: 400,
      body: { message: ['nombre should not be empty'] },
    });
    await expect(
      apiClient.post('personas/externas', { body: {} }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(globalErrorStore.getState().errors.map((e) => e.message)).toEqual([
      'nombre should not be empty',
    ]);
    expect(listener).toHaveBeenCalledTimes(1);
    setActivityListener(null);
  });

  it('getBlob con una respuesta que no es blob es error de contrato', async () => {
    const client = createApiClient({
      baseUrl: BASE,
      fetchFn: (async () => ({
        ok: true,
        status: 200,
        blob: async () => 'x',
      })) as unknown as typeof fetch,
      sleep: async () => undefined,
      random: () => 0,
      isOnline: () => true,
      publishError: () => undefined,
      onActivity: () => undefined,
      getAuthBridge: () => null,
    });
    await expect(client.getBlob('backups/download')).rejects.toMatchObject({
      kind: 'contract',
    });
  });
});
