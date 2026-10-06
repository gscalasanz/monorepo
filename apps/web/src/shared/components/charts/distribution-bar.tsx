import { formatMoney } from '@/shared/format';
import { cn } from '@/shared/lib/utils';

import { ChartLegend } from '@/shared/components/charts/chart-legend';
import { seriesColor } from '@/shared/components/charts/chart-theme';
import { CHARTS_COPY } from '@/shared/components/charts/copy';

export interface DistributionSegment {
  readonly label: string;
  readonly value: number;
  /** Color CSS (token). Default: serie en orden fijo. */
  readonly color?: string;
}

export interface DistributionBarProps {
  readonly segments: readonly DistributionSegment[];
  readonly format?: (value: number) => string;
  /** Conclusión para lectores; default enumera las partes. */
  readonly ariaLabel?: string;
  readonly showLegend?: boolean;
  readonly className?: string;
}

const defaultFormat = (value: number) => formatMoney(value);

/** Barra segmentada (2px de separación) + leyenda con montos alineados (DESIGN §Panel). */
export function DistributionBar({ segments, format = defaultFormat, ariaLabel, showLegend = true, className }: DistributionBarProps) {
  const colored = segments.map((segment, index) => ({ ...segment, color: segment.color ?? seriesColor(index) }));
  const visible = colored.filter((segment) => segment.value > 0);
  const label =
    ariaLabel ??
    CHARTS_COPY.distributionLabel(colored.map((segment) => `${segment.label} ${format(segment.value)}`).join(', '));
  return (
    <div className={cn('grid gap-3', className)}>
      <div role="img" aria-label={label} className="flex h-2 gap-0.5 overflow-hidden rounded-sm bg-recessed">
        {visible.map((segment) => (
          <span key={segment.label} style={{ flexGrow: segment.value, background: segment.color }} />
        ))}
      </div>
      {showLegend ? (
        <ChartLegend items={colored.map((segment) => ({ label: segment.label, color: segment.color, value: format(segment.value) }))} />
      ) : null}
    </div>
  );
}
