'use client';

import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '../copy';
import { SegmentedTabs } from '../segmented-tabs';
import { DateRangeFilter } from './date-range-filter';
import { hasActiveFilters, rangeValue, setFilterValue, stringValue } from './filter-values';
import { SearchFilter } from './search-filter';
import { SelectFilter } from './select-filter';
import type { ChipsFilterField, FilterField, FilterValue, FilterValues } from './types';

export interface FilterBarProps {
  readonly fields: readonly FilterField[];
  /** Valores controlados (objeto inmutable: cada cambio emite uno nuevo). */
  readonly value: FilterValues;
  readonly onChange: (next: FilterValues) => void;
  /** Override del debounce de búsqueda (tests). */
  readonly debounceMs?: number;
  /** Contenido extra a la derecha (ej. exportar). */
  readonly trailing?: ReactNode;
  readonly className?: string;
}

const ALL_VALUE = '';

function chipsItems(field: ChipsFilterField) {
  const allLabel = field.allLabel === undefined ? DATA_COPY.filters.all : field.allLabel;
  const all = allLabel === null ? [] : [{ value: ALL_VALUE, label: allLabel }];
  return [...all, ...field.options];
}

interface FieldRendererProps {
  readonly field: FilterField;
  readonly value: FilterValue;
  readonly onFieldChange: (value: FilterValue) => void;
  readonly debounceMs?: number;
}

function FilterFieldRenderer({ field, value, onFieldChange, debounceMs }: FieldRendererProps) {
  switch (field.type) {
    case 'search':
      return <SearchFilter field={field} value={stringValue(value)} onChange={onFieldChange} debounceMs={debounceMs} />;
    case 'select':
      return <SelectFilter field={field} value={stringValue(value)} onChange={onFieldChange} />;
    case 'date-range':
      return <DateRangeFilter field={field} value={rangeValue(value)} onChange={onFieldChange} />;
    case 'chips':
      return (
        <SegmentedTabs
          semantics="toggle"
          ariaLabel={field.label}
          items={chipsItems(field)}
          value={stringValue(value)}
          onValueChange={onFieldChange}
        />
      );
  }
}

/** Barra de filtros config-driven (equivale a `generic-filters` + `chips-filter`). */
export function FilterBar({ fields, value, onChange, debounceMs, trailing, className }: FilterBarProps) {
  const active = hasActiveFilters(value);
  return (
    <div role="search" className={cn('flex flex-wrap items-center gap-2', className)}>
      {fields.map((field) => (
        <FilterFieldRenderer
          key={field.key}
          field={field}
          value={value[field.key]}
          debounceMs={debounceMs}
          onFieldChange={(next) => onChange(setFilterValue(value, { key: field.key, value: next }))}
        />
      ))}
      <div className="ml-auto flex items-center gap-2">
        {active ? (
          <button
            type="button"
            onClick={() => onChange({})}
            className="h-11 rounded-md px-2.5 text-sm font-medium text-ink-muted hover:bg-recessed hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:h-8 md:text-[13px]"
          >
            {DATA_COPY.filters.clear}
          </button>
        ) : null}
        {trailing}
      </div>
    </div>
  );
}
