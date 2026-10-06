import { PERSONA_TYPE } from '@/shared/domain';
import { APP_ROUTES, PERSONA_TYPE_ROUTES, UI_CONFIG } from '@/shared/constants';

describe('rutas de la app', () => {
  it('login, dashboard por defecto post-login y reporte público', () => {
    expect(APP_ROUTES.LOGIN).toBe('/login');
    expect(APP_ROUTES.DEFAULT_AFTER_LOGIN).toBe('/dashboard');
    expect(APP_ROUTES.eventoReportePublico('evt-1')).toBe('/eventos/evt-1/reporte');
  });

  it('cada tipo de persona tiene ruta (agrupación → listado)', () => {
    expect(PERSONA_TYPE_ROUTES[PERSONA_TYPE.EXTERNA]).toBe('/personas/personas-externas');
    expect(PERSONA_TYPE_ROUTES[PERSONA_TYPE.AGRUPACION]).toBe('/personas');
  });

  it('config de UI de Angular', () => {
    expect(UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE).toBe(10);
    expect(UI_CONFIG.DEBOUNCE_TIME_MS).toBe(300);
  });
});
