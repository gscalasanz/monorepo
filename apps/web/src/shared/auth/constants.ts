/** Claves de storage: IGUALES a Angular para no desloguear a nadie en la migración. */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

/** `sessionStorage`: URL a la que volver después del login. */
export const REDIRECT_URL_KEY = 'redirectUrl';

/** Margen para considerar "por vencer" un access token (port de `EXPIRATION_BUFFER_SECONDS`). */
export const EXPIRATION_BUFFER_SECONDS = 60;

export const AUTH_COPY = {
  NO_REFRESH_TOKEN: 'No hay sesión para renovar. Inicie sesión nuevamente.',
  SESSION_CLOSED: 'La sesión se cerró mientras se renovaba. Inicie sesión nuevamente.',
  STORAGE_UNAVAILABLE:
    'No se pudo guardar la sesión en este navegador. Revisá que no esté en modo privado o sin espacio.',
} as const;
