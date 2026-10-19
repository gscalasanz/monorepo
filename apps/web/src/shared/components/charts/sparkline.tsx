import { useId } from 'react';

import { cn } from '@/shared/lib/utils';

import { SERIES_COLORS } from '@/shared/components/charts/chart-theme';

const WIDTH = 96;
const HEIGHT = 32;
/** Margen para que la línea de 1.5px y el punto final no se recorten. */
const PAD = 3;
const MIN_POINTS = 2;

export interface SparklineProps {
  readonly values: readonly number[];
  /** Color CSS (variable de token). Default `--color-data-1`. */
  readonly color?: string;
  /** Si se omite, es decorativo (la cifra vecina ya cuenta la historia). */
  readonly ariaLabel?: string;
  readonly className?: string;
}

function toPoints(values: readonly number[]): Array<readonly [number, number]> {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const step = (WIDTH - PAD * 2) / (values.length - 1);
  return values.map((value, index) => [
    PAD + index * step,
    HEIGHT - PAD - ((value - min) / range) * (HEIGHT - PAD * 2),
  ] as const);
}

/** Sparkline 96×32: línea 1.5px + área al 10% + punto final (DESIGN §KPI). */
export function Sparkline({ values, color = SERIES_COLORS[0], ariaLabel, className }: SparklineProps) {
  const gradientId = useId();
  if (values.length < MIN_POINTS) return null;
  const points = toPoints(values);
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = points[points.length - 1] ?? [0, 0];
  const area = `${line} L${lastX.toFixed(1)},${HEIGHT} L${PAD},${HEIGHT} Z`;
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn('shrink-0 overflow-visible', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} stroke="none" />
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={2.5} fill="var(--color-surface)" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
