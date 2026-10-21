import { API_BASE_URL, parseApiBaseUrl } from '@/shared/api';

describe('parseApiBaseUrl', () => {
  it('acepta una URL http(s) y le quita la barra final', () => {
    expect(parseApiBaseUrl('http://localhost:3001/api/v1/')).toBe(
      'http://localhost:3001/api/v1',
    );
  });

  it('acepta una ruta del mismo origen (Vercel Services: /api → api)', () => {
    expect(parseApiBaseUrl('/api/v1/')).toBe('/api/v1');
  });

  it.each([
    undefined,
    '',
    'localhost:3001',
    'ftp://x',
    'api/v1',
    '//evil.test/api/v1',
    '/\\evil.test/api/v1',
  ])('falla rápido con %s', (value) => {
    expect(() => parseApiBaseUrl(value)).toThrow(/API_URL/);
  });
});

describe('API_BASE_URL', () => {
  it('se resuelve de API_URL al cargar el módulo', () => {
    expect(API_BASE_URL).toBe('http://localhost:3001/api/v1');
  });
});
