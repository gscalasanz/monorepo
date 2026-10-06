import { Loader2 } from 'lucide-react';

import { Skeleton } from '@/shared/components/reui/skeleton';
import { cn } from '@/shared/lib/utils';

import { FEEDBACK_COPY } from './copy';

const DEFAULT_SKELETON_ROWS = 3;

export interface LoadingStateProps {
  readonly variant?: 'spinner' | 'skeleton';
  /** Filas del skeleton. */
  readonly rows?: number;
  /** Texto visible junto al spinner; para lectores siempre se anuncia. */
  readonly label?: string;
  readonly className?: string;
}

/** Estado de carga accesible (`role="status"` + texto sr-only). */
export function LoadingState({
  variant = 'spinner',
  rows = DEFAULT_SKELETON_ROWS,
  label = FEEDBACK_COPY.loading,
  className,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div role="status" className={cn('grid gap-3 py-2', className)}>
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} aria-hidden className="h-10 w-full bg-recessed" />
        ))}
      </div>
    );
  }
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-2 py-8 text-[13px] text-ink-muted',
        className,
      )}
    >
      <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
      <span>{label}</span>
    </div>
  );
}
