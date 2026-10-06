/** Config de UI (port de `shared/constants/ui.constants.ts`). */
export const UI_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  /** Debounce de inputs de búsqueda. */
  DEBOUNCE_TIME_MS: 300,
  /** Duración de los toasts. */
  TOAST_DURATION_MS: 3000,
} as const;

/** Locale y moneda de toda la app. */
export const LOCALE = 'es-AR';
export const CURRENCY = 'ARS';
