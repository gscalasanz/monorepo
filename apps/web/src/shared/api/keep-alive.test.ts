import { act, renderHook } from '@testing-library/react';

import {
  KEEP_ALIVE_MS,
  createKeepAlive,
  notifyApiActivity,
  useKeepAlive,
} from '@/shared/api';
import { createFakeFetch } from '@/shared/api/testing/fake-fetch';

describe('createKeepAlive (port de KeepAliveService)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('el intervalo es de 14 minutos (Render free tier duerme a los 15)', () => {
    expect(KEEP_ALIVE_MS).toBe(14 * 60 * 1000);
  });

  it('hace ping recién tras 14 min sin actividad', async () => {
    const ping = vi.fn(async () => undefined);
    const keepAlive = createKeepAlive({ ping });
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS - 1);
    expect(ping).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(ping).toHaveBeenCalledTimes(1);
    keepAlive.stop();
  });

  it('cada actividad reinicia el timer', async () => {
    const ping = vi.fn(async () => undefined);
    const keepAlive = createKeepAlive({ ping });
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS - 1000);
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS - 1000);
    expect(ping).not.toHaveBeenCalled();
    keepAlive.stop();
  });

  it('tras cada ping (ok o fallido) reprograma el siguiente', async () => {
    const ping = vi
      .fn<() => Promise<unknown>>()
      .mockRejectedValueOnce(new Error('dormido'))
      .mockResolvedValue(undefined);
    const keepAlive = createKeepAlive({ ping });
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    expect(ping).toHaveBeenCalledTimes(2);
    keepAlive.stop();
  });

  it('un ping en vuelo al hacer stop() no re-arma el timer (sin zombie)', async () => {
    let resolvePing: () => void = () => undefined;
    const ping = vi.fn(
      () => new Promise<void>((resolve) => (resolvePing = resolve)),
    );
    const keepAlive = createKeepAlive({ ping });
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    keepAlive.stop();
    resolvePing();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS * 2);
    expect(ping).toHaveBeenCalledTimes(1);
  });

  it('notifyActivity después de stop() vuelve a activarlo', async () => {
    const ping = vi.fn(async () => undefined);
    const keepAlive = createKeepAlive({ ping });
    keepAlive.stop();
    keepAlive.notifyActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    expect(ping).toHaveBeenCalledTimes(1);
    keepAlive.stop();
  });

  it('stop cancela el ping pendiente', async () => {
    const ping = vi.fn(async () => undefined);
    const keepAlive = createKeepAlive({ ping });
    keepAlive.notifyActivity();
    keepAlive.stop();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS * 2);
    expect(ping).not.toHaveBeenCalled();
  });
});

describe('useKeepAlive', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('mientras está montado, la actividad del cliente reinicia el timer y el ping va a GET / sin reiniciarlo', async () => {
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    fake.reply({ status: 200, raw: 'Hello World!' });
    const { unmount } = renderHook(() => useKeepAlive());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    });
    expect(fake.requests).toHaveLength(1);
    expect(fake.requests[0]).toMatchObject({
      url: 'http://localhost:3001/api/v1',
      method: 'GET',
    });
    unmount();
  });

  it('al desmontar deja de escuchar actividad y cancela el timer', async () => {
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    const { unmount } = renderHook(() => useKeepAlive());
    unmount();
    notifyApiActivity();
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS * 2);
    expect(fake.requests).toHaveLength(0);
  });
});
