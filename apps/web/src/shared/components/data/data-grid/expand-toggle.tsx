'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface ExpandToggleProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  /** Nombre accesible ("Ver pagos de Juan"). */
  readonly label: string;
  readonly className?: string;
}

/** Botón ▸/▾ de fila expandible: no propaga el click (la fila puede ser navegable). */
export function ExpandToggle({
  expanded,
  onToggle,
  label,
  className,
}: ExpandToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-recessed hover:text-ink md:size-7',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
    >
      <ChevronRight
        aria-hidden
        className={cn('size-4 transition-transform', expanded && 'rotate-90')}
      />
    </button>
  );
}
