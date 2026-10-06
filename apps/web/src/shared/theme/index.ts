/** `@/shared/theme` — tema claro/oscuro con `[data-theme]` en `<html>`. */
export {
  DEFAULT_THEME,
  THEME_DOM_ATTRIBUTE,
  THEME_INIT_SCRIPT,
  THEME_MODE,
  THEME_STORAGE_KEY,
  isThemeMode,
  type ThemeMode,
} from './constants';
export {
  initializeTheme,
  initializeThemeOnce,
  readStoredTheme,
  setThemeMode,
  themeStore,
  toggleThemeMode,
} from './theme-store';
export { useTheme } from './use-theme';
