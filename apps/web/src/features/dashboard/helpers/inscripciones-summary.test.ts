import { ESTADO_INSCRIPCION, type EstadoInscripcion } from '@/shared/domain';
import { buildInscripcionesSummary } from '@/features/dashboard/helpers/inscripciones-summary';

const insc = (estado: EstadoInscripcion, montoTotal = 60000, montoBonificado = 0) => ({
  estado,
  montoTotal,
  montoBonificado,
});

describe('buildInscripcionesSummary', () => {
  it('cuenta por estado y calcula las que están al día', () => {
    const summary = buildInscripcionesSummary([
      insc(ESTADO_INSCRIPCION.PAGADO),
      insc(ESTADO_INSCRIPCION.PAGADO),
      insc(ESTADO_INSCRIPCION.PARCIAL),
      insc(ESTADO_INSCRIPCION.PENDIENTE),
    ]);
    expect(summary).toEqual({ total: 4, alDia: 2, pagadas: 2, bonificadas: 0, parciales: 1, pendientes: 1 });
  });

  it('una inscripción 100 % bonificada llega como `pagado`: se cuenta como bonificada', () => {
    const summary = buildInscripcionesSummary([insc(ESTADO_INSCRIPCION.PAGADO, 60000, 60000)]);
    expect(summary).toMatchObject({ pagadas: 0, bonificadas: 1, alDia: 1 });
  });

  it('bonificación parcial + pago completo sigue siendo pagada', () => {
    const summary = buildInscripcionesSummary([insc(ESTADO_INSCRIPCION.PAGADO, 60000, 20000)]);
    expect(summary).toMatchObject({ pagadas: 1, bonificadas: 0 });
  });

  it('monto 0 no es bonificación', () => {
    const summary = buildInscripcionesSummary([insc(ESTADO_INSCRIPCION.PAGADO, 0, 0)]);
    expect(summary).toMatchObject({ pagadas: 1, bonificadas: 0 });
  });

  it('respeta el estado `bonificado` si el backend alguna vez lo emite', () => {
    expect(buildInscripcionesSummary([insc(ESTADO_INSCRIPCION.BONIFICADO)])).toMatchObject({ bonificadas: 1 });
  });

  it('sin inscripciones todo es cero', () => {
    expect(buildInscripcionesSummary([])).toEqual({
      total: 0, alDia: 0, pagadas: 0, bonificadas: 0, parciales: 0, pendientes: 0,
    });
  });
});
