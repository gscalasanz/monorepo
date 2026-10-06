import { renderHook, waitFor } from '@testing-library/react';

import { KEEP_ALIVE_MS } from '@/shared/api';
import { createFakeFetch } from '@/shared/api/testing/fake-fetch';
import { logout, sessionStore, useSessionBootstrap } from '@/shared/auth';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

describe('useSessionBootstrap (montar una vez en el layout (app))', () => {
  beforeEach(() => {
    localStorage.clear();
    replace.mockClear();
    sessionStore.setState({ user: null, isLoading: false, initialized: false });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('restaura la sesión al montar', async () => {
    renderHook(() => useSessionBootstrap());
    await waitFor(() => expect(sessionStore.getState().initialized).toBe(true));
  });

  it('registra el router como navegador de la sesión mientras está montado', () => {
    const { unmount } = renderHook(() => useSessionBootstrap());
    logout();
    expect(replace).toHaveBeenCalledWith('/login');
    unmount();
    replace.mockClear();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      assign: vi.fn(),
    });
    logout();
    expect(replace).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('activa el keep-alive', async () => {
    vi.useFakeTimers();
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    fake.reply({ status: 200, raw: 'Hello World!' });
    const { unmount } = renderHook(() => useSessionBootstrap());
    await vi.advanceTimersByTimeAsync(KEEP_ALIVE_MS);
    expect(fake.requests.map((r) => r.url)).toEqual([
      'http://localhost:3001/api/v1',
    ]);
    unmount();
  });
});
