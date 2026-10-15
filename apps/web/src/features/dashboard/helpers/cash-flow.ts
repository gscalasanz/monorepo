/**
 * Flujo de caja mensual del grupo, reconstruido en el front desde `GET /movimientos`
 * (no hay endpoint de evolución). La regla de saldo espeja `SALDO_SUM_EXPRESSION` del backend.
 */
import type { KpiDeltaValue } from '@/shared/components/charts';
import {
  ESTADO_PAGO,
  TIPO_MOVIMIENTO,
  type ConceptoMovimiento,
  type Movimiento,
} from '@/shared/domain';
import { DATE_FORMATS, addDays, asLocalDate, formatDate, localDateOf } from '@/shared/time';
import {
  FLOW_LOCALE,
  FLOW_PERCENT_FRACTION_DIGITS,
  INTERNAL_TRANSFER_CONCEPTOS,
  SPARKLINE_MONTHS,
} from '@/features/dashboard/constants/cash-flow';
import type { FlowGranularity } from '@/features/dashboard/constants/chart';
import { bucketKeyOf, shiftMonth } from '@/features/dashboard/helpers/flow-buckets';

export { recentMonths } from '@/features/dashboard/helpers/flow-buckets';

export type FlowMovimiento = Pick<Movimiento, 'tipo' | 'monto' | 'estadoPago' | 'concepto' | 'fecha'>;

export interface MonthFlow {
  /** `YYYY-MM` en hora de Buenos Aires. */
  readonly month: string;
  readonly ingresos: number;
  readonly egresos: number;
  /** Saldo total del grupo al cierre del mes. */
  readonly saldo: number;
}

/** Efecto del movimiento sobre la caja: los pendientes (cobro/reembolso) no mueven plata. */
export function cashEffect(mov: FlowMovimiento): number {
  if (mov.tipo === TIPO_MOVIMIENTO.INGRESO) {
    return mov.estadoPago === ESTADO_PAGO.PENDIENTE_COBRO ? 0 : mov.monto;
  }
  return mov.estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO ? 0 : -mov.monto;
}

export function isExternalFlow(concepto: ConceptoMovimiento): boolean {
  return !INTERNAL_TRANSFER_CONCEPTOS.has(concepto);
}

interface MonthTotals {
  ingresos: number;
  egresos: number;
  effect: number;
}

interface FlowSeriesInput {
  readonly movimientos: readonly FlowMovimiento[];
  readonly keys: readonly string[];
  readonly granularity: FlowGranularity;
  readonly currentTotal: number;
}

export interface FlowPoint {
  /** Clave del balde: día, lunes de la semana o `YYYY-MM`. */
  readonly key: string;
  readonly ingresos: number;
  readonly egresos: number;
  /** Saldo total del grupo al cierre del balde. */
  readonly saldo: number;
}

function totalsByKey(params: Pick<FlowSeriesInput, 'movimientos' | 'granularity'>): ReadonlyMap<string, MonthTotals> {
  const totals = new Map<string, MonthTotals>();
  for (const mov of params.movimientos) {
    const key = bucketKeyOf({ date: localDateOf(mov.fecha), granularity: params.granularity });
    const acc = totals.get(key) ?? { ingresos: 0, egresos: 0, effect: 0 };
    const effect = cashEffect(mov);
    const real = isExternalFlow(mov.concepto);
    totals.set(key, {
      ingresos: acc.ingresos + (real && effect > 0 ? effect : 0),
      egresos: acc.egresos + (real && effect < 0 ? -effect : 0),
      effect: acc.effect + effect,
    });
  }
  return totals;
}

/** Barras (ingresos/egresos reales) y saldo de cierre por balde, anclado al total actual del último. */
export function buildFlowSeries(params: FlowSeriesInput): readonly FlowPoint[] {
  const totals = totalsByKey(params);
  const empty: MonthTotals = { ingresos: 0, egresos: 0, effect: 0 };
  const result: FlowPoint[] = [];
  let saldo = params.currentTotal;
  for (let i = params.keys.length - 1; i >= 0; i -= 1) {
    const key = params.keys[i] ?? '';
    const bucket = totals.get(key) ?? empty;
    result.unshift({ key, ingresos: bucket.ingresos, egresos: bucket.egresos, saldo });
    saldo -= bucket.effect;
  }
  return result;
}

/** Caso mensual de `buildFlowSeries` (métricas del mes). */
export function buildMonthlyFlow(params: {
  readonly movimientos: readonly FlowMovimiento[];
  readonly months: readonly string[];
  readonly currentTotal: number;
}): readonly MonthFlow[] {
  const series = buildFlowSeries({
    movimientos: params.movimientos,
    keys: params.months,
    granularity: 'mes',
    currentTotal: params.currentTotal,
  });
  return series.map(({ key, ...rest }) => ({ month: key, ...rest }));
}

/** Variación porcentual contra el mes previo; sin base comparable (previo ≤ 0) no hay delta. */
export function buildFlowDelta(params: {
  readonly current: number;
  readonly previous: number;
}): KpiDeltaValue | undefined {
  const { current, previous } = params;
  if (previous <= 0) return undefined;
  const pct = ((current - previous) / previous) * 100;
  const formatted = new Intl.NumberFormat(FLOW_LOCALE, { maximumFractionDigits: FLOW_PERCENT_FRACTION_DIGITS });
  const direction = current === previous ? 'flat' : current > previous ? 'up' : 'down';
  return { direction, value: `${formatted.format(Math.abs(pct))} %` };
}

export interface FlowMetric {
  /** Valor del último mes de la serie. */
  readonly current: number;
  readonly previousMonth: string | undefined;
  readonly delta: KpiDeltaValue | undefined;
  readonly sparkline: readonly number[];
}

/** Métrica mensual (ingresos o egresos): valor actual, delta vs. el mes previo y sparkline. */
export function buildFlowMetric(params: {
  readonly flow: readonly MonthFlow[];
  readonly key: 'ingresos' | 'egresos';
}): FlowMetric {
  const series = params.flow.map((month) => month[params.key]);
  const current = series.at(-1) ?? 0;
  const previous = series.length > 1 ? series.at(-2) : undefined;
  return {
    current,
    previousMonth: previous === undefined ? undefined : params.flow.at(-2)?.month,
    delta: previous === undefined ? undefined : buildFlowDelta({ current, previous }),
    sparkline: series.slice(-SPARKLINE_MONTHS),
  };
}

/** `2026-09` → `septiembre`. */
export function monthName(month: string): string {
  return formatDate(asLocalDate(`${month}-01`), DATE_FORMATS.monthLong);
}

/** Primer y último día (`YYYY-MM-DD`) de un mes `YYYY-MM`, para filtrar la lista de movimientos. */
export function monthBounds(month: string): { readonly fechaInicio: string; readonly fechaFin: string } {
  const nextFirst = asLocalDate(`${shiftMonth({ month, delta: 1 })}-01`);
  return { fechaInicio: `${month}-01`, fechaFin: addDays(nextFirst, -1) };
}
