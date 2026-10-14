/** Baldes de tiempo del gráfico de evolución: por día, por semana (lunes) o por mes. */
import { addDays, asLocalDate, calculateWeekRange, type LocalDate } from '@/shared/time';
import { MONTHS_PER_YEAR, MONTH_KEY_LENGTH } from '@/features/dashboard/constants/cash-flow';
import { DAYS_PER_WEEK, FLOW_GRANULARITY, FLOW_WINDOW, type FlowGranularity } from '@/features/dashboard/constants/chart';

const monthKey = (index: number): string => {
  const year = Math.floor(index / MONTHS_PER_YEAR);
  const month = (index % MONTHS_PER_YEAR) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
};

/** Últimos `count` meses (`YYYY-MM`) en orden ascendente, el último es el de `today`. */
export function recentMonths(params: { readonly today: LocalDate; readonly count: number }): readonly string[] {
  const year = Number(params.today.slice(0, 4));
  const month = Number(params.today.slice(5, 7));
  const current = year * MONTHS_PER_YEAR + (month - 1);
  return Array.from({ length: params.count }, (_, i) => monthKey(current - (params.count - 1 - i)));
}

/** `2026-12` + 1 → `2027-01`. */
export function shiftMonth(params: { readonly month: string; readonly delta: number }): string {
  const index = Number(params.month.slice(0, 4)) * MONTHS_PER_YEAR + (Number(params.month.slice(5, 7)) - 1);
  return monthKey(index + params.delta);
}

/** Clave del balde al que pertenece un día: el día, el lunes de su semana o `YYYY-MM`. */
export function bucketKeyOf(params: { readonly date: LocalDate; readonly granularity: FlowGranularity }): string {
  const { date, granularity } = params;
  if (granularity === FLOW_GRANULARITY.DIA) return date;
  if (granularity === FLOW_GRANULARITY.SEMANA) return calculateWeekRange(date).startDate;
  return date.slice(0, MONTH_KEY_LENGTH);
}

/** Claves de los últimos `count` baldes en orden ascendente; el último contiene a `today`. */
export function bucketKeys(params: {
  readonly today: LocalDate;
  readonly granularity: FlowGranularity;
  readonly count?: number;
}): readonly string[] {
  const { today, granularity } = params;
  const count = params.count ?? FLOW_WINDOW[granularity];
  if (granularity === FLOW_GRANULARITY.MES) return recentMonths({ today, count });
  const last = granularity === FLOW_GRANULARITY.DIA ? today : calculateWeekRange(today).startDate;
  const step = granularity === FLOW_GRANULARITY.DIA ? 1 : DAYS_PER_WEEK;
  return Array.from({ length: count }, (_, i) => addDays(asLocalDate(last), -step * (count - 1 - i)));
}
