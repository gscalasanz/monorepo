'use client';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { formatMoney } from '@/shared/format';
import { cn } from '@/shared/lib/utils';

import { ChartLegend } from '@/shared/components/charts/chart-legend';
import { CHART_COLORS, seriesColor } from '@/shared/components/charts/chart-theme';
import { ChartTooltip } from '@/shared/components/charts/chart-tooltip';
import { CHARTS_COPY } from '@/shared/components/charts/copy';

export interface DonutSlice {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

export interface DonutChartProps {
  readonly data: readonly DonutSlice[];
  /** Conclusión ("La mayor parte del gasto fue comida"). */
  readonly ariaLabel: string;
  readonly format?: (value: number) => string;
  /** Texto chico sobre el total en el centro (default "Total"). */
  readonly centerLabel?: string;
  readonly size?: number;
  readonly className?: string;
}

const DEFAULT_SIZE = 168;
const RING_RATIO = 0.72;
const SLICE_GAP_ANGLE = 1;
const SLICE_STROKE = 2;
const defaultFormat = (value: number) => formatMoney(value);

/** Dona con total al centro y leyenda con montos (2px de separación entre porciones). */
export function DonutChart({ data, ariaLabel, format = defaultFormat, centerLabel = CHARTS_COPY.total, size = DEFAULT_SIZE, className }: DonutChartProps) {
  const slices = data.map((slice, index) => ({ ...slice, color: slice.color ?? seriesColor(index) }));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  // Con una sola porción no hay nada que separar: sin hueco ni trazo en el anillo.
  const separated = slices.length > 1;
  return (
    <div className={cn('flex flex-col items-center gap-4 sm:flex-row sm:items-center', className)}>
      <div role="img" aria-label={ariaLabel} className="relative shrink-0" style={{ width: size, height: size }}>
        {/* Tamaño fijo: sin ResponsiveContainer no hay un primer render a -1×-1 (warning de recharts). */}
        <PieChart width={size} height={size} accessibilityLayer={false}>
          <Pie data={slices.map((slice) => ({ ...slice }))} dataKey="value" nameKey="label" innerRadius={`${RING_RATIO * 100}%`} outerRadius="100%" paddingAngle={separated ? SLICE_GAP_ANGLE : 0} stroke={CHART_COLORS.surface} strokeWidth={separated ? SLICE_STROKE : 0} isAnimationActive={false}>
            {slices.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip content={(props) => <ChartTooltip active={props.active} entries={props.payload} format={format} />} />
        </PieChart>
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-xs text-ink-subtle">{centerLabel}</span>
          <span className="text-base font-semibold text-ink tabular-nums">{format(total)}</span>
        </div>
      </div>
      <ChartLegend className="w-full min-w-0 flex-1" items={slices.map(({ label, color, value }) => ({ label, color, value: format(value) }))} />
    </div>
  );
}
