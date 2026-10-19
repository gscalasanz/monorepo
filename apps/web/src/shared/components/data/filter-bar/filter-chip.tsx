'use client';

import { Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { PopoverTrigger } from '@/shared/components/reui/popover';
import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '@/shared/components/data/copy';

const CHIP_BASE =
  'inline-flex h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap transition-colors md:h-8 md:text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export interface FilterChipTriggerProps {
  readonly label: string;
  /** Valor legible si el filtro está activo. */
  readonly valueLabel?: string;
  readonly icon?: ReactNode;
  readonly onClear: () => void;
}

/**
 * Chip de filtro (DESIGN §Chips de filtro). Debe ir dentro de un `<Popover>`.
 * Inactivo: borde punteado + "+ Label". Activo: `brand-soft`, valor en 600 y × de 18px.
 * El wrapper y el `PopoverTrigger` son el mismo elemento en ambos estados (solo
 * cambian clases/contenido): así el popover no se remonta ni pierde el foco.
 */
export function FilterChipTrigger({ label, valueLabel, icon, onClear }: FilterChipTriggerProps) {
  const active = Boolean(valueLabel);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border',
        active
          ? 'border-brand/40 bg-brand-soft text-brand'
          : 'border-dashed border-border-strong text-ink-muted',
      )}
    >
      <PopoverTrigger
        className={cn(
          CHIP_BASE,
          active ? 'pr-1 hover:bg-brand/10' : 'hover:bg-recessed hover:text-ink',
        )}
      >
        {active ? icon : <Plus aria-hidden className="size-3.5" />}
        {active ? (
          <span>
            {label}: <b className="font-semibold">{valueLabel}</b>
          </span>
        ) : (
          <span>{label}</span>
        )}
      </PopoverTrigger>
      {active ? (
        <button
          type="button"
          aria-label={DATA_COPY.filters.remove(label)}
          onClick={onClear}
          className="mr-1.5 grid size-8 place-items-center rounded-sm hover:bg-brand/15 focus-visible:outline-2 focus-visible:outline-focus md:size-[18px]"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      ) : null}
    </span>
  );
}
