/**
 * Puntos de extensión del cliente por defecto, para romper el ciclo api ↔ auth:
 * `shared/api` no conoce la sesión; `shared/auth` registra su `AuthBridge` al
 * importarse, y el keep-alive registra su listener de actividad al activarse.
 */

/** Lo que la capa de auth del cliente necesita de la sesión. */
export interface AuthBridge {
  /** Access token actual (o null si no hay sesión). */
  getAccessToken(): string | null;
  /**
   * Token válido para reintentar un request que dio 401 con `staleToken`. Encola
   * N llamadas concurrentes en un solo `auth/refresh`; si falla, cierra la
   * sesión y rechaza con el error del refresh.
   */
  refreshAccessToken(staleToken: string): Promise<string>;
}

let authBridge: AuthBridge | null = null;
let activityListener: (() => void) | null = null;

export function registerAuthBridge(bridge: AuthBridge | null): void {
  authBridge = bridge;
}

export function getRegisteredAuthBridge(): AuthBridge | null {
  return authBridge;
}

export function setActivityListener(listener: (() => void) | null): void {
  activityListener = listener;
}

export function notifyApiActivity(): void {
  activityListener?.();
}
