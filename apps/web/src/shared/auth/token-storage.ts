/** Tokens en `localStorage` (port del storage de `TokenService`). */
import { TOKEN_KEYS } from '@/shared/auth/constants';
import { readItem, removeItem, writeItem } from '@/shared/storage';

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export function getAccessToken(): string | null {
  return readItem('local', TOKEN_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return readItem('local', TOKEN_KEYS.REFRESH_TOKEN);
}

/** Devuelve `false` si no se pudo guardar alguno (storage lleno/bloqueado/SSR). */
export function setTokens({ accessToken, refreshToken }: TokenPair): boolean {
  const savedAccess = writeItem('local', {
    key: TOKEN_KEYS.ACCESS_TOKEN,
    value: accessToken,
  });
  const savedRefresh = writeItem('local', {
    key: TOKEN_KEYS.REFRESH_TOKEN,
    value: refreshToken,
  });
  return savedAccess && savedRefresh;
}

export function clearTokens(): void {
  removeItem('local', TOKEN_KEYS.ACCESS_TOKEN);
  removeItem('local', TOKEN_KEYS.REFRESH_TOKEN);
}

export function hasTokens(): boolean {
  return getAccessToken() !== null && getRefreshToken() !== null;
}
