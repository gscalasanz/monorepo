'use client';

import { useId, useMemo, useState } from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import {
  AXIS_TICK,
  BAR_RADIUS,
  CHART_COLORS,
  CHART_DEFAULT_HEIGHT,
  ChartTooltip,
  SERIES_COLORS,
} from '@/shared/components/charts';
import { SegmentedTabs } from '@/shared/components/data';
import { Skeleton } from '@/shared/components/reui/skeleton';
import { Panel } from '@/shared/components/ui/panel';
import { formatMoney } from '@/shared/format';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import {
  CHART_BAR_MAX_SIZE,
  CHART_COMPACT_FORMAT,
  CHART_MIN_TICK_GAP,
  DEFAULT_GRANULARITY,
  type FlowGranularity,
} from '@/features/dashboard/constants/chart';
import type { FlowPoint } from '@/features/dashboard/helpers/cash-flow';
import { bucketLabel, bucketTitle } from '@/features/dashboard/helpers/flow-labels';
import type { CashFlowState } from '@/features/dashboard/hooks/use-cash-flow';

const GRANULARITY_ITEMS = [
  { value: 'dia', label: C.GRANULARITY_DIA },
  { value: 'semana', label: C.GRANULARITY_SEMANA },
  { value: 'mes', label: C.GRANULARITY_MES },
] as const;

const compact = (value: number): string => CHART_COMPACT_FORMAT.format(value);

function toRows(params: { readonly points: readonly FlowPoint[]; readonly granularity: FlowGranularity }) {
  const { points, granularity } = params;
  return points.map((point) => ({
    label: bucketLabel({ key: point.key, granularity }),
    title: bucketTitle({ key: point.key, granularity }),
    saldo: point.saldo,
    ingresos: point.ingresos,
    egresos: point.egresos,
  }));
}

type Rows = ReturnType<typeof toRows>;

function summaryOf(rows: Rows): string {
  const first = rows[0];
  const last = rows.at(-1);
  if (!first || !last) return C.EVOLUTION;
  return C.CHART_SUMMARY({ from: first.title, to: last.title, saldo: formatMoney(last.saldo) });
}

function Plot({ rows }: { readonly rows: Rows }) {
  const gradientId = useId();
  return (
    <div role="img" aria-label={summaryOf(rows)} className="px-2" style={{ height: CHART_DEFAULT_HEIGHT }}>
      {/* `initialDimension` evita el primer render a -1×-1 (warning de recharts) antes de medir. */}
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: CHART_DEFAULT_HEIGHT }}>
        <ComposedChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} accessibilityLayer={false}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={SERIES_COLORS[0]} stopOpacity={0.12} />
              <stop offset="100%" stopColor={SERIES_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={CHART_MIN_TICK_GAP} />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width="auto" tickFormatter={compact} />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.axis, strokeDasharray: '3 3' }}
            content={(props) => (
              <ChartTooltip active={props.active} label={props.payload?.[0]?.payload.title} entries={props.payload} format={formatMoney} />
            )}
          />
          <Area dataKey="saldo" name={C.SERIES_SALDO} type="monotone" stroke={SERIES_COLORS[0]} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 4 }} />
          <Bar dataKey="ingresos" name={C.SERIES_INGRESOS} fill={CHART_COLORS.moneyIn} fillOpacity={0.6} radius={BAR_RADIUS.vertical} maxBarSize={CHART_BAR_MAX_SIZE} />
          <Bar dataKey="egresos" name={C.SERIES_EGRESOS} fill={CHART_COLORS.moneyOut} fillOpacity={0.5} radius={BAR_RADIUS.vertical} maxBarSize={CHART_BAR_MAX_SIZE} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function Body({ state, rows }: { readonly state: CashFlowState; readonly rows: Rows }) {
  if (state.error) return <p role="alert" className="px-[18px] py-10 text-sm text-danger">{C.CHART_ERROR}</p>;
  if (state.isLoading) {
    return (
      <div role="status" aria-label={C.CHART_LOADING} className="px-[18px] pb-4">
        <Skeleton className="w-full" style={{ height: CHART_DEFAULT_HEIGHT }} />
      </div>
    );
  }
  return <Plot rows={rows} />;
}

/** Evolución del grupo (panel propio, ancho completo): saldo en línea + barras de ingresos/egresos reales. */
export function CashFlowChart({ state, className }: { readonly state: CashFlowState; readonly className?: string }) {
  const [granularity, setGranularity] = useState<FlowGranularity>(DEFAULT_GRANULARITY);
  const rows = useMemo(() => toRows({ points: state.series[granularity], granularity }), [state.series, granularity]);
  const toggle = (
    <SegmentedTabs items={GRANULARITY_ITEMS} value={granularity} onValueChange={setGranularity} ariaLabel={C.GRANULARITY_LABEL} semantics="toggle" />
  );
  return (
    <Panel title={C.EVOLUTION} headerExtra={toggle} flush className={className}>
      <div className="flex flex-col gap-2 py-3.5">
        <Body state={state} rows={rows} />
        {state.truncated ? <p className="px-4 text-xs text-ink-subtle md:px-[18px]">{C.CHART_TRUNCATED}</p> : null}
      </div>
    </Panel>
  );
}
