import {
  ApiError,
  HTTP_CONFIG,
  backoffDelay,
  isRetryable,
  withRetry,
} from '@/shared/api';
import type { HttpMethod } from '@/shared/api';

function errorWith(status: number): ApiError {
  return new ApiError({
    kind: status === 0 ? 'network' : 'http',
    status,
    method: 'GET',
    url: '/x',
  });
}

describe('isRetryable (port de retry.interceptor)', () => {
  const online = { isOnline: () => true };

  it.each([502, 503, 504])('GET reintenta ante %i', (status) => {
    expect(
      isRetryable({ error: errorWith(status), method: 'GET', ...online }),
    ).toBe(true);
  });

  it('GET reintenta ante error de red (0) si hay conexión', () => {
    expect(isRetryable({ error: errorWith(0), method: 'GET', ...online })).toBe(
      true,
    );
  });

  it('no reintenta error de red si navigator está offline', () => {
    expect(
      isRetryable({
        error: errorWith(0),
        method: 'GET',
        isOnline: () => false,
      }),
    ).toBe(false);
  });

  it.each<HttpMethod>(['POST', 'PATCH', 'DELETE'])(
    '%s reintenta solo ante 503 y 0',
    (method) => {
      expect(isRetryable({ error: errorWith(503), method, ...online })).toBe(
        true,
      );
      expect(isRetryable({ error: errorWith(0), method, ...online })).toBe(
        true,
      );
      expect(isRetryable({ error: errorWith(502), method, ...online })).toBe(
        false,
      );
      expect(isRetryable({ error: errorWith(504), method, ...online })).toBe(
        false,
      );
    },
  );

  it.each([400, 401, 403, 404, 409, 422, 500])(
    'nunca reintenta errores de negocio (%i)',
    (status) => {
      expect(
        isRetryable({ error: errorWith(status), method: 'GET', ...online }),
      ).toBe(false);
    },
  );

  it('no reintenta lo que no es ApiError (bug, abort, contrato)', () => {
    expect(
      isRetryable({ error: new Error('x'), method: 'GET', ...online }),
    ).toBe(false);
    const contract = new ApiError({
      kind: 'contract',
      status: 200,
      method: 'GET',
      url: '/x',
    });
    expect(isRetryable({ error: contract, method: 'GET', ...online })).toBe(
      false,
    );
  });
});

describe('backoffDelay', () => {
  it('1s · 2^intento + jitter de hasta 300 ms', () => {
    expect(backoffDelay({ attempt: 0, random: () => 0 })).toBe(1000);
    expect(backoffDelay({ attempt: 1, random: () => 0 })).toBe(2000);
    expect(backoffDelay({ attempt: 2, random: () => 0.5 })).toBe(4150);
  });
});

describe('withRetry', () => {
  const sleeps: number[] = [];
  const deps = {
    sleep: async (ms: number) => {
      sleeps.push(ms);
    },
    random: () => 0,
    isOnline: () => true,
  };

  beforeEach(() => {
    sleeps.length = 0;
  });

  it(`GET ante 503 hace ${HTTP_CONFIG.RETRY_ATTEMPTS} reintentos con backoff y propaga el último error`, async () => {
    let calls = 0;
    const send = async (): Promise<never> => {
      calls += 1;
      throw errorWith(503);
    };
    await expect(
      withRetry(send, { method: 'GET', endpoint: 'x', ...deps }),
    ).rejects.toMatchObject({
      status: 503,
    });
    expect(calls).toBe(HTTP_CONFIG.RETRY_ATTEMPTS + 1);
    expect(sleeps).toEqual([1000, 2000, 4000]);
  });

  it('se recupera si el server vuelve', async () => {
    let calls = 0;
    const send = async (): Promise<string> => {
      calls += 1;
      if (calls === 1) throw errorWith(503);
      return 'ok';
    };
    await expect(
      withRetry(send, { method: 'POST', endpoint: 'x', ...deps }),
    ).resolves.toBe('ok');
    expect(calls).toBe(2);
  });

  it('no reintenta un error no transitorio', async () => {
    let calls = 0;
    const send = async (): Promise<never> => {
      calls += 1;
      throw errorWith(502);
    };
    await expect(
      withRetry(send, { method: 'POST', endpoint: 'x', ...deps }),
    ).rejects.toMatchObject({
      status: 502,
    });
    expect(calls).toBe(1);
  });

  it('nunca reintenta auth/refresh', async () => {
    let calls = 0;
    const send = async (): Promise<never> => {
      calls += 1;
      throw errorWith(503);
    };
    await expect(
      withRetry(send, { method: 'POST', endpoint: 'auth/refresh', ...deps }),
    ).rejects.toBeTruthy();
    expect(calls).toBe(1);
  });

  it('reintenta auth/login ante 503 (es POST)', async () => {
    let calls = 0;
    const send = async (): Promise<string> => {
      calls += 1;
      if (calls === 1) throw errorWith(503);
      return 'token';
    };
    await expect(
      withRetry(send, { method: 'POST', endpoint: 'auth/login', ...deps }),
    ).resolves.toBe('token');
  });
});
