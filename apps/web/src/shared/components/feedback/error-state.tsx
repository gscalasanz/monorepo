import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { FEEDBACK_COPY } from '@/shared/components/feedback/copy';

export interface ErrorStateProps {
  /** Mensaje humano (ej. el de `extractErrorMessage`). */
  readonly message?: string;
  readonly title?: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  readonly className?: string;
}

/** Error de carga con reintento. `role="alert"` para que se anuncie. */
export function ErrorState({
  message = FEEDBACK_COPY.errorFallback,
  title = FEEDBACK_COPY.errorTitle,
  onRetry,
  retryLabel = FEEDBACK_COPY.retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('grid justify-items-center gap-2 px-5 py-6 text-center', className)}
    >
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-lg bg-danger-soft text-danger"
      >
        <AlertTriangle className="size-4" />
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-[40ch] text-[13px] text-ink-muted">{message}</p>
      {onRetry ? (
        <Button
          variant="secondary"
          size="sm"
          className="mt-1"
          icon={<RotateCcw aria-hidden className="size-3.5" />}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
