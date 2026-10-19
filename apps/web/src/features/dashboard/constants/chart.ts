/** Granularidad de la serie de flujo de caja (el historial se agrupa por día, semana o mes). */
export const FLOW_GRANULARITY = { DIA: 'dia', SEMANA: 'semana', MES: 'mes' } as const;
export type FlowGranularity = (typeof FLOW_GRANULARITY)[keyof typeof FLOW_GRANULARITY];

/** Cuántos baldes muestra cada granularidad: 30 días, 12 semanas o 12 meses. */
export const FLOW_WINDOW: Readonly<Record<FlowGranularity, number>> = { dia: 30, semana: 12, mes: 12 };
export const DAYS_PER_WEEK = 7;
