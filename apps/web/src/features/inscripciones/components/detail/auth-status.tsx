import { BadgeCheck, CircleDashed } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { AUTH_COPY as C } from '@/features/inscripciones/constants/copy';
import type { AuthSummary } from '@/features/inscripciones/helpers/detail';

/** "Listo para actividades / Todo completado" o "Pendientes / N de 5". */
export function AuthStatus({ summary }: { readonly summary: AuthSummary }) {
  const Icon = summary.complete ? BadgeCheck : CircleDashed;
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-md',
          summary.complete
            ? 'bg-success-soft text-success'
            : 'bg-warning-soft text-warning',
        )}
      >
        <Icon aria-hidden className="size-[18px]" />
      </span>
      <p className="grid">
        <strong className="text-sm font-semibold text-ink">
          {summary.complete ? C.COMPLETE_TITLE : C.PENDING_TITLE}
        </strong>
        <span className="text-xs text-ink-muted">
          {summary.complete
            ? C.COMPLETE_DESC
            : C.pendingCount(summary.pending, summary.total)}
        </span>
      </p>
    </div>
  );
}
