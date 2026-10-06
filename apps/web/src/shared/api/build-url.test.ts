import { API_ENDPOINTS, buildUrl } from '@/shared/api';

const BASE = 'http://api.test/api/v1';

describe('buildUrl (port de HttpService.buildParams)', () => {
  it('arma ${base}/${endpoint}', () => {
    expect(
      buildUrl({ baseUrl: BASE, endpoint: API_ENDPOINTS.CAJAS_GRUPO }),
    ).toBe('http://api.test/api/v1/cajas/grupo');
  });

  it('agrega query params y descarta undefined, null y ""', () => {
    expect(
      buildUrl({
        baseUrl: BASE,
        endpoint: API_ENDPOINTS.PERSONAS,
        params: {
          tipo: 'protagonista',
          soloActivos: true,
          page: 2,
          rama: '',
          x: undefined,
          y: null,
        },
      }),
    ).toBe(
      'http://api.test/api/v1/personas?tipo=protagonista&soloActivos=true&page=2',
    );
  });

  it('respeta false y 0 (no son "vacíos")', () => {
    expect(
      buildUrl({ baseUrl: BASE, endpoint: 'x', params: { a: false, b: 0 } }),
    ).toBe('http://api.test/api/v1/x?a=false&b=0');
  });

  it('endpoint vacío apunta a la base (ping de keep-alive)', () => {
    expect(buildUrl({ baseUrl: BASE, endpoint: '' })).toBe(BASE);
  });

  it('codifica valores', () => {
    expect(
      buildUrl({ baseUrl: BASE, endpoint: 'x', params: { q: 'a b&c' } }),
    ).toBe('http://api.test/api/v1/x?q=a+b%26c');
  });
});

describe('API_ENDPOINTS', () => {
  it('builders de rutas con id', () => {
    expect(API_ENDPOINTS.saldoPersonal('p1')).toBe('cajas/personal/p1/saldo');
    expect(API_ENDPOINTS.personaDashboard('p1')).toBe('personas/p1/dashboard');
    expect(API_ENDPOINTS.eventoReportePublico('e1')).toBe(
      'eventos/e1/reporte/publico',
    );
    expect(API_ENDPOINTS.producto('pr1')).toBe('eventos/productos/pr1');
  });
});
