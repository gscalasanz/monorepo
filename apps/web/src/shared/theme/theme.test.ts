import {
  THEME_STORAGE_KEY,
  initializeTheme,
  setThemeMode,
  themeStore,
  toggleThemeMode,
} from '@/shared/theme';

describe('theme store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    themeStore.setState({ mode: 'light' });
  });

  it('por defecto es light', () => {
    initializeTheme();
    expect(themeStore.getState().mode).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('respeta la preferencia guardada con la clave de Angular', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    initializeTheme();
    expect(themeStore.getState().mode).toBe('dark');
  });

  it('ignora valores inválidos en storage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    initializeTheme();
    expect(themeStore.getState().mode).toBe('light');
  });

  it('setThemeMode persiste y aplica en el DOM', () => {
    setThemeMode('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggle alterna light ↔ dark', () => {
    toggleThemeMode();
    expect(themeStore.getState().mode).toBe('dark');
    toggleThemeMode();
    expect(themeStore.getState().mode).toBe('light');
  });
});
