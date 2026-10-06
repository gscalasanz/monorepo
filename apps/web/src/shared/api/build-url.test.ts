import { API_ENDPOINTS, buildUrl, pathSegment } from '@/shared/api';

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

describe('pathSegment (seguridad: ids crudos en el path)', () => {
  it('codifica el id para que no pueda salir de su segmento', () => {
    expect(pathSegment('../backups/download')).toBe('..%2Fbackups%2Fdownload');
    expect(pathSegment('a b?c#d')).toBe('a%20b%3Fc%23d');
  });

  it.each(['', '.', '..'])(
    'rechaza %j (vacío o segmento de navegación)',
    (value) => {
      expect(() => pathSegment(value)).toThrow();
    },
  );

  it('todos los builders con id codifican', () => {
    const evil = '../backups/download';
    expect(API_ENDPOINTS.evento(evil)).toBe('eventos/..%2Fbackups%2Fdownload');
    expect(API_ENDPOINTS.eventoReportePublico(evil)).toBe(
      'eventos/..%2Fbackups%2Fdownload/reporte/publico',
    );
    expect(API_ENDPOINTS.eventoReporte(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.persona(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.personaDashboard(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.personaTransferirSaldo(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.caja(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.saldoPersonal(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.movimiento(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.movimientosSaldo(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.movimientosCaja(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.inscripcion(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.campamento(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.campamentoDetalle(evil)).toContain('..%2F');
    expect(API_ENDPOINTS.producto(evil)).toContain('..%2F');
  });
});

describe('buildUrl (defensa en profundidad)', () => {
  it('rechaza un endpoint que resuelve fuera de la base', () => {
    expect(() => buildUrl({ baseUrl: BASE, endpoint: '../../otro' })).toThrow();
    expect(() => buildUrl({ baseUrl: BASE, endpoint: 'eventos/..' })).toThrow();
    expect(() =>
      buildUrl({ baseUrl: BASE, endpoint: 'eventos/../../v2/x' }),
    ).toThrow();
  });

  it('acepta endpoints normales bajo la base', () => {
    expect(buildUrl({ baseUrl: BASE, endpoint: 'eventos/e1' })).toBe(
      `${BASE}/eventos/e1`,
    );
  });
});
