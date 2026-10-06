import {
  ESTADO_INSCRIPCION,
  ESTADO_INSCRIPCION_LABELS,
  TIPO_DEUDA,
  TIPO_INSCRIPCION,
  TIPO_INSCRIPCION_LABELS,
  inscripcionSchema,
  inscripcionesConsolidadoSchema,
  inscripcionesSchema,
} from '@/shared/domain';
import { INSCRIPCION_RESPONSE_FIXTURE, omitKeys } from '@/shared/domain/testing/fixtures';

describe('enums de inscripción', () => {
  it('labels de tipo y estado', () => {
    expect(TIPO_INSCRIPCION_LABELS[TIPO_INSCRIPCION.SCOUT_ARGENTINA]).toBe('Scout Argentina');
    expect(ESTADO_INSCRIPCION_LABELS[ESTADO_INSCRIPCION.PARCIAL]).toBe('Pago Parcial');
    expect(Object.values(TIPO_DEUDA)).toEqual(['documentacion', 'dinero', 'ambos']);
  });
});

describe('inscripcionSchema (InscripcionResponseDto)', () => {
  it('parsea el DTO con persona y movimientos', () => {
    const inscripcion = inscripcionSchema.parse(INSCRIPCION_RESPONSE_FIXTURE);
    expect(inscripcion.saldoPendiente).toBe(20000);
    expect(inscripcion.persona?.rama).toBe('Manada');
    expect(inscripcion.movimientos[0]?.concepto).toBe('inscripcion_scout_argentina');
  });

  it('persona es opcional (findOne/create/pagar no la traen)', () => {
    const sinPersona = omitKeys(INSCRIPCION_RESPONSE_FIXTURE, ['persona']);
    expect(inscripcionesSchema.parse([sinPersona])[0]?.persona).toBeUndefined();
  });
});

describe('inscripcionesConsolidadoSchema', () => {
  it('parsea el consolidado (filtros con claves omitidas)', () => {
    const porRama = { total: 1, manada: 1, unidad: 0, caminantes: 0, rovers: 0, educadores: 0 };
    const consolidado = inscripcionesConsolidadoSchema.parse({
      filtros: { ano: 2026 },
      total: 1,
      porRama,
      financiero: { montoEsperado: 1, montoPagado: 0, montoAdeudado: 1, montoBonificado: 0 },
      deudores: {
        dinero: { total: 1, monto: 1, porRama },
        documentacion: { total: 0, porRama },
        ambos: porRama,
      },
      fecha: '2026-03-13T15:00:00.000Z',
    });
    expect(consolidado.filtros.tipo).toBeUndefined();
    expect(consolidado.deudores.dinero.monto).toBe(1);
  });
});
