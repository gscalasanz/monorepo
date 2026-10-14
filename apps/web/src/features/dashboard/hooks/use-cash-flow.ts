'use client';

import { useMemo } from 'react';

import { useAsyncData } from '@/shared/hooks';
import { asLocalDate, todayBsAs } from '@/shared/time';
import { HISTORY_MONTHS } from '@/features/dashboard/constants/cash-flow';
import { FLOW_GRANULARITY, type FlowGranularity } from '@/features/dashboard/constants/chart';
import { buildFlowSeries, type FlowPoint, type MonthFlow } from '@/features/dashboard/helpers/cash-flow';
import { bucketKeys } from '@/features/dashboard/helpers/flow-buckets';
import { fetchMovimientosSince } from '@/features/dashboard/services/cash-flow-api';

export type FlowSeries = Readonly<Record<FlowGranularity, readonly FlowPoint[]>>;

const EMPTY_SERIES: FlowSeries = { dia: [], semana: [], mes: [] };
const NO_MONTHS: readonly MonthFlow[] = [];

export interface CashFlowState {
  /** Serie por granularidad; vacía mientras carga o si falló. */
  readonly series: FlowSeries;
  /** Serie mensual (métricas de ingresos/egresos del mes). */
  readonly monthly: readonly MonthFlow[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly truncated: boolean;
}

interface Derived {
  readonly series: FlowSeries;
  readonly monthly: readonly MonthFlow[];
}

/**
 * Evolución del grupo. `currentTotal` (consolidado) ancla el saldo: hasta que llega no se
 * pide el historial (`undefined` = todavía no cargó). Un solo pedido de 12 meses alcanza
 * para 30 días, 12 semanas y 12 meses.
 */
export function useCashFlow(currentTotal: number | undefined): CashFlowState {
  const today = useMemo(() => todayBsAs(), []);
  const from = asLocalDate(`${bucketKeys({ today, granularity: FLOW_GRANULARITY.MES, count: HISTORY_MONTHS })[0]}-01`);
  const { data, error, isLoading } = useAsyncData({
    key: `cash-flow:${from}`,
    enabled: currentTotal !== undefined,
    load: (signal) => fetchMovimientosSince({ from, signal }),
  });
  const derived = useMemo<Derived>(() => {
    if (!data || currentTotal === undefined) return { series: EMPTY_SERIES, monthly: NO_MONTHS };
    const build = (granularity: FlowGranularity) =>
      buildFlowSeries({ movimientos: data.movimientos, keys: bucketKeys({ today, granularity }), granularity, currentTotal });
    const series: FlowSeries = { dia: build('dia'), semana: build('semana'), mes: build('mes') };
    return { series, monthly: series.mes.map(({ key, ...rest }) => ({ month: key, ...rest })) };
  }, [data, today, currentTotal]);
  return { ...derived, isLoading: isLoading || currentTotal === undefined, error, truncated: data?.truncated ?? false };
}
