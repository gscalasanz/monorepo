'use client';

import { Check } from 'lucide-react';

import { CAJA_TYPE_LABELS, FONDO_RAMA_TYPES } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { RamaChipValue } from '@/features/cajas/helpers/fondos-rama';

const CHIPS: readonly {
  readonly value: RamaChipValue;
  readonly label: string;
}[] = [
  { value: null, label: C.TODAS },
  ...FONDO_RAMA_TYPES.map((tipo) => ({
    value: tipo,
    label: CAJA_TYPE_LABELS[tipo],
  })),
];

export interface RamaChipsFilterProps {
  readonly selected: readonly RamaChipValue[];
  readonly onToggle: (value: RamaChipValue) => void;
}

/** Chips multi-selección de fondos ("Todas" + 4 ramas) con `aria-pressed` y check visible. */
export function RamaChipsFilter({ selected, onToggle }: RamaChipsFilterProps) {
  return (
    <div
      role="group"
      aria-label={C.RAMAS_FILTER_LABEL}
      className="flex flex-wrap gap-2"
    >
      {CHIPS.map((chip) => {
        const pressed = selected.includes(chip.value);
        return (
          <button
            key={chip.value ?? 'todas'}
            type="button"
            aria-pressed={pressed}
            onClick={() => onToggle(chip.value)}
            className={cn(
              'inline-flex h-11 items-center gap-1.5 rounded-pill border px-3 text-sm font-medium transition-colors md:h-8 md:text-[13px]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
              pressed
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-border bg-surface text-ink-muted hover:bg-recessed hover:text-ink',
            )}
          >
            {pressed && <Check className="size-3.5" aria-hidden />}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
