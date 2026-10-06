'use client';

import { Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { PopoverTrigger } from '@/shared/components/reui/popover';
import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '../copy';

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
 */
export function FilterChipTrigger({ label, valueLabel, icon, onClear }: FilterChipTriggerProps) {
  if (!valueLabel) {
    return (
      <PopoverTrigger
        className={cn(CHIP_BASE, 'border border-dashed border-border-strong text-ink-muted hover:bg-recessed hover:text-ink')}
      >
        <Plus aria-hidden className="size-3.5" />
        {label}
      </PopoverTrigger>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-brand/40 bg-brand-soft text-brand">
      <PopoverTrigger className={cn(CHIP_BASE, 'pr-1 hover:bg-brand/10')}>
        {icon}
        <span>
          {label}: <b className="font-semibold">{valueLabel}</b>
        </span>
      </PopoverTrigger>
      <button
        type="button"
        aria-label={DATA_COPY.filters.remove(label)}
        onClick={onClear}
        className="mr-1.5 grid size-8 place-items-center rounded-sm hover:bg-brand/15 focus-visible:outline-2 focus-visible:outline-focus md:size-[18px]"
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </span>
  );
}
