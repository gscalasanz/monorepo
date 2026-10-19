import {
  CAJA_TYPE,
  CAJA_TYPE_LABELS,
  RAMA_TO_CAJA_TYPE,
  cajaResponseSchema,
  cajaSchema,
  consolidadoSaldosSchema,
  fondoSolidarioSchema,
  saldoCajaSchema,
  saldoPersonalSchema,
} from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  omitKeys,
} from '@/shared/domain/testing/fixtures';

describe('enums de caja', () => {
  it('toda caja tiene label', () => {
    for (const tipo of Object.values(CAJA_TYPE)) {
      expect(CAJA_TYPE_LABELS[tipo]).toBeTruthy();
    }
    expect(CAJA_TYPE_LABELS.fondo_solidario).toBe('Fondo Solidario');
  });

  it('cada rama tiene su fondo', () => {
    expect(RAMA_TO_CAJA_TYPE.Rovers).toBe('rama_rovers');
  });
});

describe('schemas de caja', () => {
  it('CajaResponseDto con saldoActual y propietario', () => {
    const caja = cajaResponseSchema.parse(CAJA_RESPONSE_FIXTURE);
    expect(caja.saldoActual).toBe(2500);
    expect(caja.propietario?.rama).toBe('Manada');
  });

  it('propietario null (caja grupo / fondo solidario)', () => {
    expect(
      cajaResponseSchema.parse({ ...CAJA_RESPONSE_FIXTURE, propietario: null })
        .propietario,
    ).toBeNull();
  });

  it('caja cruda (POST /cajas) sin saldo', () => {
    const raw = omitKeys(CAJA_RESPONSE_FIXTURE, ['saldoActual', 'propietario']);
    expect(cajaSchema.parse({ ...raw, deletedAt: null }).tipo).toBe('personal');
  });

  it('saldo de caja y saldo personal', () => {
    expect(saldoCajaSchema.parse({ cajaId: 'c', saldo: 10 }).saldo).toBe(10);
    expect(saldoPersonalSchema.parse({ saldo: 5 }).saldo).toBe(5);
  });

  it('fondo solidario con historial', () => {
    const fondo = fondoSolidarioSchema.parse({
      caja: null,
      historial: [
        {
          movimientoId: 'm',
          fecha: '2026-03-13T15:00:00.000Z',
          monto: 100,
          personaId: 'p',
          personaNombre: 'Juan',
          destino: 'Inscripción 2026',
        },
      ],
    });
    expect(fondo.historial[0]?.monto).toBe(100);
  });

  it('consolidado de saldos', () => {
    const pair = { total: 1, cantidad: 1 };
    const consolidado = consolidadoSaldosSchema.parse({
      fecha: '2026-03-13T15:00:00.000Z',
      resumen: { totalGeneral: 1, totalDisponible: 1, totalPorCobrar: 0 },
      cajaGrupo: { id: '', saldo: 0 },
      fondosRama: {
        total: 1,
        detalle: [
          { tipo: 'rama_manada', id: 'c', nombre: 'Fondo Manada', saldo: 1 },
        ],
      },
      cuentasPersonales: pair,
      fondoSolidario: { id: null, saldo: 0, bonificacionesOtorgadas: 0 },
      reembolsosPendientes: pair,
      cobrosPendientes: pair,
      deudasTotales: { total: 2, inscripciones: pair, campamentos: pair },
    });
    expect(consolidado.fondosRama.detalle[0]?.tipo).toBe('rama_manada');
  });
});
