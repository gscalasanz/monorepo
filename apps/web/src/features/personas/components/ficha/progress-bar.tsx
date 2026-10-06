import { cn } from '@/shared/lib/utils';

const PERCENT = 100;

export interface ProgressBarProps {
  /** 0–1. */
  readonly ratio: number;
  /** Clase de color del relleno (token: `bg-success`, `bg-danger`…). */
  readonly fillClassName: string;
  readonly className?: string;
}

/** Track hundido de 4px con relleno proporcional (decorativo: el dato va en texto al lado). */
export function ProgressBar({
  ratio,
  fillClassName,
  className,
}: ProgressBarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'block h-1 w-full overflow-hidden rounded-pill bg-recessed',
        className,
      )}
    >
      <span
        className={cn('block h-full rounded-pill', fillClassName)}
        style={{ width: `${Math.round(ratio * PERCENT)}%` }}
      />
    </span>
  );
}
