import {
  REDIRECT_URL_KEY,
  consumeRedirectUrl,
  saveRedirectUrl,
} from '@/shared/auth';

describe('redirectUrl en sessionStorage (paridad con auth.guard + login)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('misma clave que Angular', () => {
    expect(REDIRECT_URL_KEY).toBe('redirectUrl');
  });

  it('guarda la URL intentada y la consume una sola vez', () => {
    saveRedirectUrl('/cajas?tab=grupo');
    expect(sessionStorage.getItem('redirectUrl')).toBe('/cajas?tab=grupo');
    expect(consumeRedirectUrl()).toBe('/cajas?tab=grupo');
    expect(sessionStorage.getItem('redirectUrl')).toBeNull();
  });

  it('sin URL guardada vuelve a /dashboard', () => {
    expect(consumeRedirectUrl()).toBe('/dashboard');
  });

  it.each(['/login', '/'])('no guarda %s', (url) => {
    saveRedirectUrl(url);
    expect(sessionStorage.getItem('redirectUrl')).toBeNull();
  });

  it('ignora URLs externas o protocol-relative (open redirect)', () => {
    sessionStorage.setItem('redirectUrl', '//evil.com');
    expect(consumeRedirectUrl()).toBe('/dashboard');
    saveRedirectUrl('https://evil.com');
    expect(sessionStorage.getItem('redirectUrl')).toBeNull();
  });
});
