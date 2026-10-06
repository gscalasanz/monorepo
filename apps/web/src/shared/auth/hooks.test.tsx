import { act, renderHook, waitFor } from '@testing-library/react';

import {
  sessionStore,
  setTokens,
  useRedirectIfAuthenticated,
  useRequireSession,
  useSession,
} from '@/shared/auth';
import { tokenExpiringIn } from '@/shared/auth/testing/jwt';

const replace = vi.fn();
let pathname = '/cajas';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => pathname,
}));

const USER = {
  id: 'per-2',
  nombre: 'Laura',
  email: 'laura@scout.ar',
  tipo: 'educador',
} as const;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  replace.mockClear();
  pathname = '/cajas';
  sessionStore.setState({ user: null, isLoading: false, initialized: false });
  window.history.pushState({}, '', '/cajas?tab=grupo');
});

describe('useRequireSession', () => {
  it('con sesión válida deja pasar', async () => {
    setTokens({
      accessToken: tokenExpiringIn(3600),
      refreshToken: tokenExpiringIn(7200),
    });
    const { result } = renderHook(() => useRequireSession());
    await waitFor(() => expect(result.current.status).toBe('allowed'));
    expect(replace).not.toHaveBeenCalled();
  });

  it('sin sesión guarda la URL intentada y redirige a /login', async () => {
    const { result } = renderHook(() => useRequireSession());
    await waitFor(() => expect(result.current.status).toBe('redirecting'));
    expect(sessionStorage.getItem('redirectUrl')).toBe('/cajas?tab=grupo');
    expect(replace).toHaveBeenCalledWith('/login');
  });
});

describe('useRequireSession en cada navegación', () => {
  it('re-evalúa al cambiar de ruta: si la sesión se perdió, redirige', async () => {
    setTokens({
      accessToken: tokenExpiringIn(3600),
      refreshToken: tokenExpiringIn(7200),
    });
    const { result, rerender } = renderHook(() => useRequireSession());
    await waitFor(() => expect(result.current.status).toBe('allowed'));
    localStorage.clear();
    pathname = '/movimientos';
    window.history.pushState({}, '', '/movimientos');
    rerender();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(sessionStorage.getItem('redirectUrl')).toBe('/movimientos');
  });
});

describe('useRedirectIfAuthenticated', () => {
  it('con sesión manda al dashboard', async () => {
    setTokens({
      accessToken: tokenExpiringIn(3600),
      refreshToken: tokenExpiringIn(7200),
    });
    const { result } = renderHook(() => useRedirectIfAuthenticated());
    await waitFor(() => expect(result.current.status).toBe('redirecting'));
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });

  it('sin sesión deja ver el login', async () => {
    const { result } = renderHook(() => useRedirectIfAuthenticated());
    await waitFor(() => expect(result.current.status).toBe('allowed'));
  });
});

describe('useSession', () => {
  it('refleja el store reactivo', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(false);
    act(() => {
      sessionStore.setState({ user: USER, initialized: true });
    });
    expect(result.current).toMatchObject({
      user: USER,
      isAuthenticated: true,
      initialized: true,
    });
  });
});
