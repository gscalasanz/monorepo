'use client';

import { Calendar } from 'lucide-react';
import { useId, useState } from 'react';

import { Popover, PopoverContent } from '@/shared/components/reui/popover';
import { DATE_FORMATS, formatDate } from '@/shared/time';

import { DATA_COPY } from '../copy';
import { FilterChipTrigger } from './filter-chip';
import type { DateRangeFilterField, DateRangeValue } from './types';

export interface DateRangeFilterProps {
  readonly field: DateRangeFilterField;
  readonly value: DateRangeValue;
  readonly onChange: (value: DateRangeValue) => void;
}

const INPUT_CLASS =
  'h-11 w-full rounded-md border border-border-strong bg-surface px-2.5 text-base text-ink md:h-[38px] md:text-sm focus-visible:border-focus focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus/24';

/** "1 sep – 30 sep" / "desde 1 sep" / "hasta 30 sep". */
export function describeDateRange(value: DateRangeValue): string | undefined {
  const from = value.from ? formatDate(value.from, DATE_FORMATS.dayMonth) : '';
  const to = value.to ? formatDate(value.to, DATE_FORMATS.dayMonth) : '';
  if (from && to) return `${from} – ${to}`;
  if (from) return DATA_COPY.filters.rangeFrom(from);
  if (to) return DATA_COPY.filters.rangeTo(to);
  return undefined;
}

/** Rango de fechas (inputs nativos `date`, valores `yyyy-MM-dd`). */
export function DateRangeFilter({ field, value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FilterChipTrigger
        label={field.label}
        valueLabel={describeDateRange(value)}
        icon={<Calendar aria-hidden className="size-3.5" />}
        onClear={() => onChange({})}
      />
      <PopoverContent align="start" className="w-64 bg-surface-raised p-3 text-ink shadow-md ring-border">
        <div className="grid gap-3">
          <label htmlFor={`${id}-from`} className="grid gap-1 text-[13px] font-medium">
            {DATA_COPY.filters.dateFrom}
            <input
              id={`${id}-from`}
              type="date"
              value={value.from ?? ''}
              max={value.to}
              onChange={(event) => onChange({ ...value, from: event.target.value || undefined })}
              className={INPUT_CLASS}
            />
          </label>
          <label htmlFor={`${id}-to`} className="grid gap-1 text-[13px] font-medium">
            {DATA_COPY.filters.dateTo}
            <input
              id={`${id}-to`}
              type="date"
              value={value.to ?? ''}
              min={value.from}
              onChange={(event) => onChange({ ...value, to: event.target.value || undefined })}
              className={INPUT_CLASS}
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
