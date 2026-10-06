'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent } from '@/shared/components/reui/popover';
import { cn } from '@/shared/lib/utils';

import { FilterChipTrigger } from './filter-chip';
import type { SelectFilterField } from './types';

export interface SelectFilterProps {
  readonly field: SelectFilterField;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

/** Filtro de opción única detrás de un chip. */
export function SelectFilter({ field, value, onChange }: SelectFilterProps) {
  const [open, setOpen] = useState(false);
  const selected = field.options.find((option) => option.value === value);
  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FilterChipTrigger
        label={field.label}
        valueLabel={selected?.label}
        onClear={() => onChange('')}
      />
      <PopoverContent align="start" className="w-56 gap-0 bg-surface-raised p-1 text-ink shadow-md ring-border">
        <div role="group" aria-label={field.label} className="grid">
          {field.options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => choose(option.value)}
                className={cn(
                  'flex h-11 items-center justify-between gap-2 rounded-sm px-2 text-left text-sm hover:bg-recessed md:h-8 md:text-[13px]',
                  'focus-visible:outline-2 focus-visible:outline-focus',
                  isSelected && 'font-semibold text-brand',
                )}
              >
                {option.label}
                {isSelected ? <Check aria-hidden className="size-3.5" /> : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
