/** `redirectUrl` en `sessionStorage` (paridad con `authGuard` + `LoginComponent`). */
import { REDIRECT_URL_KEY } from '@/shared/auth/constants';
import { readItem, removeItem, writeItem } from '@/shared/auth/storage';
import { APP_ROUTES } from '@/shared/constants';

const NOT_SAVED: readonly string[] = [APP_ROUTES.LOGIN, APP_ROUTES.ROOT];

/** Solo paths internos (`/x`), nunca `//host` ni URLs absolutas (open redirect). */
function isInternalPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\');
}

export function shouldSaveRedirectUrl(url: string): boolean {
  return isInternalPath(url) && !NOT_SAVED.includes(url);
}

export function saveRedirectUrl(url: string): void {
  if (shouldSaveRedirectUrl(url)) {
    writeItem('session', { key: REDIRECT_URL_KEY, value: url });
  }
}

/** Devuelve (y borra) la URL guardada, o `/dashboard`. */
export function consumeRedirectUrl(): string {
  const saved = readItem('session', REDIRECT_URL_KEY);
  removeItem('session', REDIRECT_URL_KEY);
  return saved && isInternalPath(saved)
    ? saved
    : APP_ROUTES.DEFAULT_AFTER_LOGIN;
}
