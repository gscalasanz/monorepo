import {
  TOKEN_KEYS,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasTokens,
  setTokens,
} from '@/shared/auth';

describe('token storage (port de TokenService)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('usa las mismas claves que Angular (no desloguea a nadie)', () => {
    expect(TOKEN_KEYS).toEqual({
      ACCESS_TOKEN: 'accessToken',
      REFRESH_TOKEN: 'refreshToken',
    });
    setTokens({ accessToken: 'a', refreshToken: 'r' });
    expect(localStorage.getItem('accessToken')).toBe('a');
    expect(localStorage.getItem('refreshToken')).toBe('r');
  });

  it('lee, detecta y limpia', () => {
    expect(hasTokens()).toBe(false);
    setTokens({ accessToken: 'a', refreshToken: 'r' });
    expect(getAccessToken()).toBe('a');
    expect(getRefreshToken()).toBe('r');
    expect(hasTokens()).toBe(true);
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(hasTokens()).toBe(false);
  });

  it('hasTokens exige los dos tokens', () => {
    localStorage.setItem('accessToken', 'a');
    expect(hasTokens()).toBe(false);
  });

  it('si localStorage no está disponible (modo privado, bloqueado) no explota', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('SecurityError');
      });
    expect(getAccessToken()).toBeNull();
    spy.mockRestore();
  });
});
