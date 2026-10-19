import {
  DEFAULT_INSCRIPCION_CONFIG,
  INSCRIPCION_CONFIG_STORAGE_KEY,
  loadInscripcionConfig,
  montoByTipo,
  saveInscripcionConfig,
  updateInscripcionConfig,
} from '@/shared/settings';

describe('config de montos de inscripción (port de ConfiguracionService)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('misma clave y formato JSON que Angular', () => {
    expect(INSCRIPCION_CONFIG_STORAGE_KEY).toBe('scout_inscripcion_config');
    saveInscripcionConfig({ montoScoutArgentina: 30000, montoGrupo: 12000 });
    expect(
      JSON.parse(localStorage.getItem('scout_inscripcion_config') ?? ''),
    ).toEqual({
      montoScoutArgentina: 30000,
      montoGrupo: 12000,
    });
  });

  it('lee la config que dejó guardada el Angular', () => {
    localStorage.setItem(
      'scout_inscripcion_config',
      JSON.stringify({ montoScoutArgentina: 25000, montoGrupo: 8000 }),
    );
    expect(loadInscripcionConfig()).toEqual({
      montoScoutArgentina: 25000,
      montoGrupo: 8000,
    });
  });

  it('sin config → montos en 0', () => {
    expect(loadInscripcionConfig()).toEqual(DEFAULT_INSCRIPCION_CONFIG);
    expect(DEFAULT_INSCRIPCION_CONFIG).toEqual({
      montoScoutArgentina: 0,
      montoGrupo: 0,
    });
  });

  it('campos faltantes o inválidos caen a 0 sin perder los válidos', () => {
    localStorage.setItem(
      'scout_inscripcion_config',
      JSON.stringify({ montoGrupo: 9000, montoScoutArgentina: 'mucho' }),
    );
    expect(loadInscripcionConfig()).toEqual({
      montoScoutArgentina: 0,
      montoGrupo: 9000,
    });
  });

  it('JSON corrupto → defaults', () => {
    localStorage.setItem('scout_inscripcion_config', '{no-json');
    expect(loadInscripcionConfig()).toEqual(DEFAULT_INSCRIPCION_CONFIG);
  });

  it('update parcial: devuelve una config nueva y la persiste', () => {
    saveInscripcionConfig({ montoScoutArgentina: 1, montoGrupo: 2 });
    const before = loadInscripcionConfig();
    const after = updateInscripcionConfig({ montoGrupo: 5 });
    expect(after).toEqual({ montoScoutArgentina: 1, montoGrupo: 5 });
    expect(before).toEqual({ montoScoutArgentina: 1, montoGrupo: 2 });
    expect(loadInscripcionConfig()).toEqual(after);
  });

  it('monto por tipo de inscripción', () => {
    const config = { montoScoutArgentina: 30000, montoGrupo: 12000 };
    expect(montoByTipo(config, 'scout_argentina')).toBe(30000);
    expect(montoByTipo(config, 'grupo')).toBe(12000);
  });
});
