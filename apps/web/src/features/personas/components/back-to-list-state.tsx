import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/shared/components/feedback';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';

export interface BackToListStateProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly actionLabel: string;
  /** `alert` para errores (se anuncian). */
  readonly role?: 'alert';
}

/** Estado de error / no encontrado con link de vuelta al listado de personas. */
export function BackToListState({
  icon,
  title,
  actionLabel,
  role,
}: BackToListStateProps) {
  return (
    <div
      role={role}
      className="rounded-xl border border-border bg-surface py-6 shadow-xs"
    >
      <EmptyState
        icon={icon}
        title={title}
        action={
          <Link
            href={PERSONA_ROUTES.LIST}
            className="inline-flex min-h-11 items-center rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-ink hover:bg-recessed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:min-h-[38px]"
          >
            {actionLabel}
          </Link>
        }
      />
    </div>
  );
}
