import { cn } from '@/shared/lib/utils';

export type MeterTone = 'success' | 'warning' | 'danger' | 'brand' | 'info';

const TONE_CLASSES: Readonly<Record<MeterTone, string>> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  brand: 'bg-brand',
  info: 'bg-info',
};

const MAX = 100;

interface ProgressMeterProps {
  /** 0–100. */
  readonly value: number;
  readonly label: string;
  readonly tone?: MeterTone;
  readonly className?: string;
}

/** Barra de progreso accesible (`role="progressbar"` + etiqueta con la conclusión). */
export function ProgressMeter({
  value,
  label,
  tone = 'brand',
  className,
}: ProgressMeterProps) {
  const clamped = Math.max(0, Math.min(MAX, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={MAX}
      aria-label={label}
      className={cn('h-2 overflow-hidden rounded-pill bg-recessed', className)}
    >
      <div
        className={cn('h-full rounded-pill', TONE_CLASSES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
