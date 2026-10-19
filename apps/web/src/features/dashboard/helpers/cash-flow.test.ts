import {
  CONCEPTO_MOVIMIENTO,
  ESTADO_PAGO,
  type ConceptoMovimiento,
  type EstadoPago,
  type TipoMovimiento,
} from '@/shared/domain';
import { asInstant, asLocalDate } from '@/shared/time';
import {
  buildFlowDelta,
  buildFlowMetric,
  buildFlowSeries,
  buildMonthlyFlow,
  monthBounds,
  monthName,
  type MonthFlow,
  cashEffect,
  isExternalFlow,
  recentMonths,
  type FlowMovimiento,
} from '@/features/dashboard/helpers/cash-flow';

interface MovParams {
  readonly tipo: TipoMovimiento;
  readonly monto: number;
  readonly fecha: string;
  readonly estadoPago?: EstadoPago;
  readonly concepto?: ConceptoMovimiento;
}

const mov = (p: MovParams): FlowMovimiento => ({
  tipo: p.tipo,
  monto: p.monto,
  fecha: asInstant(p.fecha),
  estadoPago: p.estadoPago ?? ESTADO_PAGO.PAGADO,
  concepto: p.concepto ?? CONCEPTO_MOVIMIENTO.GASTO_GENERAL,
});

describe('cashEffect (misma regla de saldo que el backend)', () => {
  it('ingreso pagado suma y egreso pagado resta', () => {
    expect(cashEffect(mov({ tipo: 'ingreso', monto: 100, fecha: '2026-10-01T15:00:00.000Z' }))).toBe(100);
    expect(cashEffect(mov({ tipo: 'egreso', monto: 40, fecha: '2026-10-01T15:00:00.000Z' }))).toBe(-40);
  });

  it('ingreso pendiente de cobro y egreso pendiente de reembolso no mueven la caja', () => {
    const cobro = mov({ tipo: 'ingreso', monto: 100, fecha: '2026-10-01T15:00:00.000Z', estadoPago: ESTADO_PAGO.PENDIENTE_COBRO });
    const reembolso = mov({ tipo: 'egreso', monto: 40, fecha: '2026-10-01T15:00:00.000Z', estadoPago: ESTADO_PAGO.PENDIENTE_REEMBOLSO });
    expect(cashEffect(cobro)).toBe(0);
    expect(cashEffect(reembolso)).toBe(0);
  });

  it('un ingreso pendiente de reembolso sí cuenta (la regla es por tipo + estado)', () => {
    const raro = mov({ tipo: 'ingreso', monto: 10, fecha: '2026-10-01T15:00:00.000Z', estadoPago: ESTADO_PAGO.PENDIENTE_REEMBOLSO });
    expect(cashEffect(raro)).toBe(10);
  });
});

describe('isExternalFlow', () => {
  it('las transferencias internas no son ingresos ni egresos reales del grupo', () => {
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.TRANSFERENCIA_ENTRE_CAJAS)).toBe(false);
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.ASIGNACION_FONDO_RAMA)).toBe(false);
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.BONIFICACION_OTORGADA)).toBe(false);
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.USO_SALDO_PERSONAL)).toBe(false);
  });

  it('gastos e ingresos de la actividad sí lo son', () => {
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.GASTO_GENERAL)).toBe(true);
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.INSCRIPCION_GRUPO)).toBe(true);
    expect(isExternalFlow(CONCEPTO_MOVIMIENTO.EVENTO_VENTA_INGRESO)).toBe(true);
  });
});

describe('recentMonths', () => {
  it('devuelve los últimos N meses en orden ascendente, terminando en el actual', () => {
    expect(recentMonths({ today: asLocalDate('2026-10-06'), count: 3 })).toEqual(['2026-08', '2026-09', '2026-10']);
  });

  it('cruza el cambio de año', () => {
    expect(recentMonths({ today: asLocalDate('2026-02-10'), count: 3 })).toEqual(['2025-12', '2026-01', '2026-02']);
  });
});

describe('buildMonthlyFlow', () => {
  const months = ['2026-08', '2026-09', '2026-10'];
  const movimientos = [
    mov({ tipo: 'ingreso', monto: 200, fecha: '2026-09-10T15:00:00.000Z' }),
    mov({ tipo: 'egreso', monto: 50, fecha: '2026-10-02T15:00:00.000Z' }),
    mov({ tipo: 'ingreso', monto: 100, fecha: '2026-10-03T15:00:00.000Z', concepto: CONCEPTO_MOVIMIENTO.TRANSFERENCIA_ENTRE_CAJAS }),
  ];

  it('reconstruye el saldo de cada fin de mes hacia atrás desde el total actual', () => {
    const flow = buildMonthlyFlow({ movimientos, months, currentTotal: 1000 });
    expect(flow.map((m) => [m.month, m.saldo])).toEqual([
      ['2026-08', 750],
      ['2026-09', 950],
      ['2026-10', 1000],
    ]);
  });

  it('las barras excluyen transferencias internas pero el saldo las incluye', () => {
    const flow = buildMonthlyFlow({ movimientos, months, currentTotal: 1000 });
    expect(flow.map((m) => [m.ingresos, m.egresos])).toEqual([
      [0, 0],
      [200, 0],
      [0, 50],
    ]);
  });

  it('el mes se toma en hora de Buenos Aires (00:30 UTC del 1/10 sigue siendo septiembre)', () => {
    const borde = mov({ tipo: 'ingreso', monto: 70, fecha: '2026-10-01T00:30:00.000Z' });
    const flow = buildMonthlyFlow({ movimientos: [borde], months, currentTotal: 500 });
    expect(flow.find((m) => m.month === '2026-09')?.ingresos).toBe(70);
  });

  it('ignora movimientos fuera de la ventana pedida', () => {
    const viejo = mov({ tipo: 'ingreso', monto: 999, fecha: '2025-01-10T15:00:00.000Z' });
    const flow = buildMonthlyFlow({ movimientos: [viejo], months, currentTotal: 10 });
    expect(flow.every((m) => m.ingresos === 0 && m.saldo === 10)).toBe(true);
  });

  it('sin movimientos el saldo es plano en el total actual', () => {
    expect(buildMonthlyFlow({ movimientos: [], months, currentTotal: 42 }).map((m) => m.saldo)).toEqual([42, 42, 42]);
  });
});

describe('buildFlowDelta', () => {
  it('sube: porcentaje con coma decimal y dirección', () => {
    expect(buildFlowDelta({ current: 1124, previous: 1000 })).toEqual({ direction: 'up', value: '12,4 %' });
  });

  it('baja', () => {
    expect(buildFlowDelta({ current: 900, previous: 1000 })).toEqual({ direction: 'down', value: '10 %' });
  });

  it('igual → flat', () => {
    expect(buildFlowDelta({ current: 500, previous: 500 })).toEqual({ direction: 'flat', value: '0 %' });
  });

  it('sin mes previo comparable no hay delta', () => {
    expect(buildFlowDelta({ current: 500, previous: 0 })).toBeUndefined();
  });
});

const flowOf = (ingresos: readonly number[]): readonly MonthFlow[] =>
  ingresos.map((value, i) => ({ month: `2026-0${i + 1}`, ingresos: value, egresos: value / 2, saldo: 0 }));

describe('buildFlowMetric', () => {
  it('el último mes es el actual, el anterior da el delta y la serie es la sparkline', () => {
    const metric = buildFlowMetric({ flow: flowOf([100, 200, 250]), key: 'ingresos' });
    expect(metric).toEqual({
      current: 250,
      previousMonth: '2026-02',
      delta: { direction: 'up', value: '25 %' },
      sparkline: [100, 200, 250],
    });
  });

  it('lee la serie pedida (egresos)', () => {
    expect(buildFlowMetric({ flow: flowOf([100, 200]), key: 'egresos' }).current).toBe(100);
  });

  it('con un solo mes no hay mes previo ni delta', () => {
    const metric = buildFlowMetric({ flow: flowOf([100]), key: 'ingresos' });
    expect(metric.previousMonth).toBeUndefined();
    expect(metric.delta).toBeUndefined();
  });

  it('la sparkline se limita a los últimos 8 meses', () => {
    const metric = buildFlowMetric({ flow: flowOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), key: 'ingresos' });
    expect(metric.sparkline).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('sin meses devuelve ceros', () => {
    expect(buildFlowMetric({ flow: [], key: 'ingresos' })).toEqual({
      current: 0, previousMonth: undefined, delta: undefined, sparkline: [],
    });
  });
});

describe('monthName', () => {
  it('nombre del mes en castellano y minúscula', () => {
    expect(monthName('2026-09')).toBe('septiembre');
    expect(monthName('2026-01')).toBe('enero');
  });
});

describe('buildFlowSeries (día y semana)', () => {
  it('día: barras y saldo por día en hora de Buenos Aires', () => {
    const series = buildFlowSeries({
      movimientos: [
        mov({ tipo: 'ingreso', monto: 100, fecha: '2026-10-05T15:00:00.000Z' }),
        mov({ tipo: 'egreso', monto: 30, fecha: '2026-10-06T15:00:00.000Z' }),
      ],
      keys: ['2026-10-04', '2026-10-05', '2026-10-06'],
      granularity: 'dia',
      currentTotal: 500,
    });
    expect(series.map((p) => [p.key, p.ingresos, p.egresos, p.saldo])).toEqual([
      ['2026-10-04', 0, 0, 430],
      ['2026-10-05', 100, 0, 530],
      ['2026-10-06', 0, 30, 500],
    ]);
  });

  it('un movimiento de las 22:00 en BsAs (01:00 UTC del día siguiente) cae en su día local', () => {
    const series = buildFlowSeries({
      movimientos: [mov({ tipo: 'ingreso', monto: 50, fecha: '2026-10-06T01:00:00.000Z' })],
      keys: ['2026-10-05', '2026-10-06'],
      granularity: 'dia',
      currentTotal: 50,
    });
    expect(series.map((p) => p.ingresos)).toEqual([50, 0]);
  });

  it('semana: agrupa de lunes a domingo', () => {
    const series = buildFlowSeries({
      movimientos: [
        mov({ tipo: 'ingreso', monto: 40, fecha: '2026-10-01T15:00:00.000Z' }),
        mov({ tipo: 'egreso', monto: 10, fecha: '2026-10-07T15:00:00.000Z' }),
      ],
      keys: ['2026-09-28', '2026-10-05'],
      granularity: 'semana',
      currentTotal: 200,
    });
    expect(series.map((p) => [p.key, p.ingresos, p.egresos, p.saldo])).toEqual([
      ['2026-09-28', 40, 0, 210],
      ['2026-10-05', 0, 10, 200],
    ]);
  });
});

describe('monthBounds', () => {
  it('primer y último día del mes', () => {
    expect(monthBounds('2026-10')).toEqual({ fechaInicio: '2026-10-01', fechaFin: '2026-10-31' });
    expect(monthBounds('2026-09')).toEqual({ fechaInicio: '2026-09-01', fechaFin: '2026-09-30' });
  });

  it('febrero, con y sin año bisiesto', () => {
    expect(monthBounds('2026-02').fechaFin).toBe('2026-02-28');
    expect(monthBounds('2028-02').fechaFin).toBe('2028-02-29');
  });

  it('diciembre cruza de año', () => {
    expect(monthBounds('2026-12').fechaFin).toBe('2026-12-31');
  });
});
