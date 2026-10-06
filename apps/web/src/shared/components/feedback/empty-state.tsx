import { Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { FEEDBACK_COPY } from '@/shared/components/feedback/copy';

export interface EmptyStateProps {
  /** Qué pasa ("Nada para devolverle a Valentina"). */
  readonly title?: string;
  /** Cuándo aparecerá algo. */
  readonly hint?: ReactNode;
  readonly icon?: LucideIcon;
  /** Acción opcional (ej. `<Button>`). */
  readonly action?: ReactNode;
  readonly className?: string;
}

/** Empty state (DESIGN §Empty state): tile hundido 36px + frase + pista. Sin ilustraciones. */
export function EmptyState({
  title = FEEDBACK_COPY.emptyTitle,
  hint,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'grid justify-items-center gap-2 px-5 py-6 text-center',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-lg bg-recessed text-ink-subtle ring-1 ring-border ring-inset"
      >
        <Icon className="size-4" />
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? (
        <p className="max-w-[32ch] text-[13px] text-ink-muted">{hint}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
