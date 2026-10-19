import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

const DEFAULT_LABEL = 'Listado';

export interface ListPanelProps {
  /** Barra de filtros (usar `ListToolbar`); va arriba, separada por hairline. */
  readonly toolbar?: ReactNode;
  readonly ariaLabel?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Card único de toda lista: filtros arriba + tabla (o lista mobile) + paginador
 * adentro de la misma superficie. Todas las pantallas de lista lo usan.
 */
export function ListPanel({
  toolbar,
  ariaLabel = DEFAULT_LABEL,
  children,
  className,
}: ListPanelProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'flex min-w-0 flex-col rounded-xl border border-border bg-surface shadow-xs',
        className,
      )}
    >
      {toolbar}
      {children}
    </section>
  );
}

/** Fila de filtros: tabs + chips en una línea (se parte en mobile). `bare` = sin hairline ni padding (fuera de un card). */
export function ListToolbar({
  children,
  bare = false,
}: {
  readonly children: ReactNode;
  readonly bare?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        !bare && 'border-b border-border p-4 md:px-[18px]',
      )}
    >
      {children}
    </div>
  );
}
