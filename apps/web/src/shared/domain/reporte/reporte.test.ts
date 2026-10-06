import { REPORTE_VARIANTE, reporteEventoSchema } from '@/shared/domain';
import { omitKeys, REPORTE_VENTA_CAJA_GRUPO_FIXTURE } from '@/shared/domain/testing/fixtures';

const LADO = { recaudado: 1, ganancia: 1, unidades: 1, pendienteCobro: 0, neto: 1 };
const GANANCIA_POR_PERSONA = [{ personaId: 'p', nombre: 'Juan', ganancia: 10 }];

describe('reporteEventoSchema (unión por variante)', () => {
  it('incluye venta_mixta (que el Angular y el Swagger omiten en ReporteVariante)', () => {
    expect(Object.values(REPORTE_VARIANTE)).toEqual([
      'venta_caja_grupo',
      'venta_cuentas_personales',
      'venta_mixta',
      'grupo',
    ]);
  });

  it('venta_caja_grupo', () => {
    const reporte = reporteEventoSchema.parse(REPORTE_VENTA_CAJA_GRUPO_FIXTURE);
    expect(reporte.variante).toBe('venta_caja_grupo');
    expect(reporte.evento.fecha).toBe('2026-05-25');
  });

  it('venta_cuentas_personales trae gananciaPorPersona', () => {
    const reporte = reporteEventoSchema.parse({
      ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE,
      variante: 'venta_cuentas_personales',
      gananciaPorPersona: GANANCIA_POR_PERSONA,
    });
    if (reporte.variante !== 'venta_cuentas_personales') throw new Error('variante inesperada');
    expect(reporte.gananciaPorPersona[0]?.ganancia).toBe(10);
  });

  it('venta_mixta trae porDestino', () => {
    const reporte = reporteEventoSchema.parse({
      ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE,
      variante: 'venta_mixta',
      gananciaPorPersona: GANANCIA_POR_PERSONA,
      porDestino: { cajaGrupo: LADO, cuentasPersonales: LADO },
    });
    if (reporte.variante !== 'venta_mixta') throw new Error('variante inesperada');
    expect(reporte.porDestino.cajaGrupo.neto).toBe(1);
  });

  it('grupo trae ingresos itemizados y no secciones de venta', () => {
    const base = omitKeys(REPORTE_VENTA_CAJA_GRUPO_FIXTURE, ['productos', 'stock']);
    const reporte = reporteEventoSchema.parse({
      ...base,
      variante: 'grupo',
      ingresosItemizados: [
        {
          descripcion: 'Buffet',
          responsableNombre: null,
          medioPago: 'efectivo',
          monto: 100,
          fecha: '2026-05-25T18:00:00.000Z',
        },
      ],
    });
    if (reporte.variante !== 'grupo') throw new Error('variante inesperada');
    expect(reporte.ingresosItemizados).toHaveLength(1);
  });

  it('rechaza una variante desconocida', () => {
    expect(
      reporteEventoSchema.safeParse({ ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE, variante: 'otra' }).success,
    ).toBe(false);
  });
});
