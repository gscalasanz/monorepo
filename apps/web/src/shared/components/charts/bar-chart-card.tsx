'use client';

import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { cn } from '@/shared/lib/utils';

import { ChartLegend } from '@/shared/components/charts/chart-legend';
import {
  AXIS_TICK,
  BAR_GAP,
  BAR_MAX_SIZE,
  BAR_RADIUS,
  CHART_COLORS,
  CHART_DEFAULT_HEIGHT,
  seriesColor,
} from '@/shared/components/charts/chart-theme';
import { ChartTooltip } from '@/shared/components/charts/chart-tooltip';

export interface BarSeries {
  readonly key: string;
  readonly label: string;
  /** Color CSS (token). Default: serie en orden fijo (`--color-data-n`). */
  readonly color?: string;
}

export interface BarDatum {
  readonly label: string;
  readonly values: Readonly<Record<string, number>>;
}

export interface BarChartCardProps {
  readonly title: string;
  /** Conclusión del gráfico (no "gráfico de barras"): "Septiembre fue el mes con más ingresos". */
  readonly ariaLabel: string;
  readonly data: readonly BarDatum[];
  /** Una serie o un par (ingresos/egresos). */
  readonly series: readonly BarSeries[];
  readonly orientation?: 'vertical' | 'horizontal';
  readonly format?: (value: number) => string;
  readonly height?: number;
  /** Acción del header (ej. `SegmentedTabs` de período). */
  readonly action?: ReactNode;
  readonly className?: string;
}

const defaultFormat = (value: number) => String(value);
const CATEGORY_KEY = 'label';
const HORIZONTAL_LABEL_WIDTH = 96;

function toRows(data: readonly BarDatum[]) {
  return data.map((datum) => ({ [CATEGORY_KEY]: datum.label, ...datum.values }));
}

function BarAxes({ horizontal, format }: { readonly horizontal: boolean; readonly format: (value: number) => string }) {
  const valueAxis = { tick: AXIS_TICK, tickLine: false, axisLine: false, tickFormatter: format } as const;
  const categoryAxis = { dataKey: CATEGORY_KEY, tick: AXIS_TICK, tickLine: false, axisLine: false } as const;
  return horizontal ? (
    <>
      <XAxis type="number" {...valueAxis} />
      <YAxis type="category" width={HORIZONTAL_LABEL_WIDTH} {...categoryAxis} />
    </>
  ) : (
    <>
      <XAxis type="category" {...categoryAxis} />
      <YAxis type="number" width="auto" {...valueAxis} />
    </>
  );
}

/** Panel con barras verticales u horizontales (una serie o pareadas), tooltip y leyenda. */
export function BarChartCard({ title, ariaLabel, data, series, orientation = 'vertical', format = defaultFormat, height = CHART_DEFAULT_HEIGHT, action, className }: BarChartCardProps) {
  const horizontal = orientation === 'horizontal';
  const colored = series.map((item, index) => ({ ...item, color: item.color ?? seriesColor(index) }));
  return (
    <section className={cn('min-w-0 rounded-xl border border-border bg-surface shadow-xs', className)}>
      <header className="flex min-h-13 items-center justify-between gap-3 px-4 py-3.5 md:px-[18px]">
        <h2 className="text-sm leading-5 font-semibold text-ink">{title}</h2>
        {action}
      </header>
      <div role="img" aria-label={ariaLabel} className="px-2 pb-3" style={{ height }}>
        {/* `initialDimension` evita el primer render a -1×-1 (warning de recharts) antes de medir. */}
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height }}>
          <BarChart data={toRows(data)} layout={horizontal ? 'vertical' : 'horizontal'} barGap={BAR_GAP} accessibilityLayer={false}>
            <CartesianGrid stroke={CHART_COLORS.grid} vertical={horizontal} horizontal={!horizontal} />
            {BarAxes({ horizontal, format })}
            <Tooltip cursor={{ fill: CHART_COLORS.cursor }} content={(props) => <ChartTooltip active={props.active} label={props.label} entries={props.payload} format={format} />} />
            {colored.map((item) => (
              <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={horizontal ? BAR_RADIUS.horizontal : BAR_RADIUS.vertical} maxBarSize={BAR_MAX_SIZE} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {colored.length > 1 ? (
        <ChartLegend className="flex flex-wrap gap-x-4 px-4 pb-4 md:px-[18px]" items={colored.map(({ label, color }) => ({ label, color }))} />
      ) : null}
    </section>
  );
}
