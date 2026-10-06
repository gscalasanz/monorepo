import { act, renderHook, waitFor } from '@testing-library/react';

import { useAsyncData } from '@/shared/hooks';

function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe('useAsyncData', () => {
  it('carga y expone los datos', async () => {
    const { result } = renderHook(() =>
      useAsyncData({ key: 'a', load: () => Promise.resolve([1, 2]) }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual([1, 2]));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('expone el mensaje de error', async () => {
    const { result } = renderHook(() =>
      useAsyncData({ key: 'a', load: () => Promise.reject(new Error('Falló la API')) }),
    );
    await waitFor(() => expect(result.current.error).toBe('Falló la API'));
  });

  it('ignora la respuesta vieja al cambiar la key', async () => {
    const slow = deferred<string>();
    const { result, rerender } = renderHook(
      ({ k }: { k: string }) =>
        useAsyncData({ key: k, load: () => (k === 'a' ? slow.promise : Promise.resolve('b')) }),
      { initialProps: { k: 'a' } },
    );
    rerender({ k: 'b' });
    await waitFor(() => expect(result.current.data).toBe('b'));
    await act(async () => {
      slow.resolve('a');
    });
    expect(result.current.data).toBe('b');
  });

  it('enabled=false no carga; reload vuelve a pedir', async () => {
    const load = vi.fn().mockResolvedValue('x');
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => useAsyncData({ key: 'k', load, enabled }),
      { initialProps: { enabled: false } },
    );
    expect(load).not.toHaveBeenCalled();
    rerender({ enabled: true });
    await waitFor(() => expect(result.current.data).toBe('x'));
    await act(() => result.current.reload());
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('setData actualiza en memoria', async () => {
    const { result } = renderHook(() => useAsyncData({ key: 'a', load: () => Promise.resolve(1) }));
    await waitFor(() => expect(result.current.data).toBe(1));
    act(() => result.current.setData((n) => (n ?? 0) + 1));
    expect(result.current.data).toBe(2);
  });
});
