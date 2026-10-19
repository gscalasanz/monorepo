/** Tema claro/oscuro (port de `shared/constants/theme.constants.ts`). */
export const THEME_MODE = { LIGHT: 'light', DARK: 'dark' } as const;

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

/** Misma clave que Angular: los usuarios conservan su preferencia. */
export const THEME_STORAGE_KEY = 'scout-theme-preference';
export const THEME_DOM_ATTRIBUTE = 'data-theme';
export const DEFAULT_THEME: ThemeMode = THEME_MODE.LIGHT;

export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === THEME_MODE.LIGHT || value === THEME_MODE.DARK;

/**
 * Script inline para `<head>`: aplica el tema guardado antes del primer paint
 * (sin flash de tema claro en usuarios con dark).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.setAttribute('${THEME_DOM_ATTRIBUTE}',t==='${THEME_MODE.DARK}'?'${THEME_MODE.DARK}':'${THEME_MODE.LIGHT}')}catch(e){}})();`;
