import { FLOW_LOCALE } from '@/features/dashboard/constants/cash-flow';

/** Granularidad del gráfico de evolución. */
export const FLOW_GRANULARITY = { DIA: 'dia', SEMANA: 'semana', MES: 'mes' } as const;
export type FlowGranularity = (typeof FLOW_GRANULARITY)[keyof typeof FLOW_GRANULARITY];

/** Cuántos baldes muestra cada granularidad: 30 días, 12 semanas o 12 meses. */
export const FLOW_WINDOW: Readonly<Record<FlowGranularity, number>> = { dia: 30, semana: 12, mes: 12 };
export const DEFAULT_GRANULARITY: FlowGranularity = FLOW_GRANULARITY.MES;

/** `septiembre` → `sep` en el eje X. */
export const MONTH_LABEL_LENGTH = 3;
export const DAYS_PER_WEEK = 7;
export const CHART_BAR_MAX_SIZE = 10;
/** Separación mínima entre ticks del eje X (px): con 30 días no entran todos. */
export const CHART_MIN_TICK_GAP = 16;
/** `5 M`, `800 mil` en el eje Y. */
export const CHART_COMPACT_FORMAT = new Intl.NumberFormat(FLOW_LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
