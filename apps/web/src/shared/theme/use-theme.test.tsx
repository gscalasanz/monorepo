import { renderHook } from '@testing-library/react';

import { setThemeMode, themeStore, useTheme } from '@/shared/theme';

describe('useTheme', () => {
  it('inicializa una sola vez por carga: un mount posterior no pisa el modo en memoria', () => {
    localStorage.clear();
    const first = renderHook(() => useTheme());
    expect(first.result.current.mode).toBe('light');
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    setThemeMode('dark');
    spy.mockRestore();
    const second = renderHook(() => useTheme());
    expect(second.result.current.mode).toBe('dark');
    expect(themeStore.getState().mode).toBe('dark');
  });
});
