import { cn } from '@/shared/lib/utils';

const FULL_PERCENT = 100;

export interface ProgressBarProps {
  /** 0–100. */
  readonly percent: number;
  readonly label: string;
  /** Texto visible a la derecha del label (ej. "45%"). */
  readonly valueText?: string;
  readonly className?: string;
}

/** Barra de avance accesible (`role="progressbar"`): verde al completar, marca si no. */
export function ProgressBar({
  percent,
  label,
  valueText,
  className,
}: ProgressBarProps) {
  const value = Math.max(0, Math.min(FULL_PERCENT, percent));
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-ink-muted">{label}</span>
        <span className="font-semibold text-ink tabular-nums">
          {valueText ?? `${value}%`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={FULL_PERCENT}
        className="h-2 overflow-hidden rounded-pill bg-recessed"
      >
        <div
          className={cn(
            'h-full rounded-pill',
            value >= FULL_PERCENT ? 'bg-success' : 'bg-brand',
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
