import { cn } from '@/shared/lib/utils';

import { SERIES_COLORS } from '@/shared/components/charts/chart-theme';

const FULL_PERCENT = 100;

export interface ProgressTrackProps {
  readonly value: number;
  readonly max: number;
  /** Color CSS (variable de token). Default `--color-data-1`. */
  readonly color?: string;
  /** Si se omite es decorativo (la cifra vecina ya dice el avance). */
  readonly ariaLabel?: string;
  readonly className?: string;
}

function percentOf(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(FULL_PERCENT, Math.max(0, (value / max) * FULL_PERCENT));
}

/** Pista de progreso de 4px (fondos de rama, obligaciones, desglose de deuda). */
export function ProgressTrack({ value, max, color = SERIES_COLORS[0], ariaLabel, className }: ProgressTrackProps) {
  const percent = percentOf(value, max);
  return (
    <div
      role={ariaLabel ? 'progressbar' : undefined}
      aria-label={ariaLabel}
      aria-valuenow={ariaLabel ? Math.round(percent) : undefined}
      aria-valuemin={ariaLabel ? 0 : undefined}
      aria-valuemax={ariaLabel ? FULL_PERCENT : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn('h-1 overflow-hidden rounded-pill bg-recessed', className)}
    >
      <div data-fill className="h-full rounded-pill" style={{ width: `${percent}%`, background: color }} />
    </div>
  );
}
