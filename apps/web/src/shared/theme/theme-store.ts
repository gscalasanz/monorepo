/**
 * Estado del tema (port de `ThemeService`): store vanilla que persiste en
 * localStorage y refleja el modo en `<html data-theme>`.
 */
import { createStore } from 'zustand/vanilla';

import { readItem, writeItem } from '@/shared/storage';
import {
  DEFAULT_THEME,
  THEME_DOM_ATTRIBUTE,
  THEME_MODE,
  THEME_STORAGE_KEY,
  isThemeMode,
  type ThemeMode,
} from '@/shared/theme/constants';

interface ThemeState {
  readonly mode: ThemeMode;
}

function applyToDom(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(THEME_DOM_ATTRIBUTE, mode);
}

export function readStoredTheme(): ThemeMode {
  const stored = readItem('local', THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : DEFAULT_THEME;
}

export const themeStore = createStore<ThemeState>(() => ({ mode: DEFAULT_THEME }));

export function setThemeMode(mode: ThemeMode): void {
  themeStore.setState({ mode });
  applyToDom(mode);
  writeItem('local', { key: THEME_STORAGE_KEY, value: mode });
}

export function toggleThemeMode(): void {
  const current = themeStore.getState().mode;
  setThemeMode(current === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT);
}

/** Sincroniza el store con lo que dejó el script inline / localStorage. */
export function initializeTheme(): void {
  const mode = readStoredTheme();
  themeStore.setState({ mode });
  applyToDom(mode);
}

/** Flag de módulo: la inicialización desde storage corre una vez por carga de página. */
let themeInitialized = false;

/**
 * Como `initializeTheme`, pero solo la primera vez: los mounts posteriores de
 * `useTheme` no pisan el modo en memoria (p. ej. si storage no pudo persistir).
 */
export function initializeThemeOnce(): void {
  if (themeInitialized) return;
  themeInitialized = true;
  initializeTheme();
}
