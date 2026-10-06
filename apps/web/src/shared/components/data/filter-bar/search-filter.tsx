'use client';

import { Search } from 'lucide-react';

import { DATA_COPY } from '../copy';
import type { SearchFilterField } from './types';
import { useDebouncedCommit } from './use-debounced-commit';

export interface SearchFilterProps {
  readonly field: SearchFilterField;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly debounceMs?: number;
}

/** Búsqueda de texto con debounce (`UI_CONFIG.DEBOUNCE_TIME_MS`). */
export function SearchFilter({ field, value, onChange, debounceMs }: SearchFilterProps) {
  const [draft, setDraft] = useDebouncedCommit({ value, onCommit: onChange, delayMs: debounceMs });
  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 text-ink-subtle focus-within:border-focus focus-within:ring-3 focus-within:ring-focus/24 md:h-8 md:w-58">
      <Search aria-hidden className="size-[15px] shrink-0" />
      <span className="sr-only">{field.label}</span>
      <input
        type="search"
        value={draft}
        placeholder={field.placeholder ?? DATA_COPY.filters.searchPlaceholder}
        onChange={(event) => setDraft(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle md:text-[13px]"
      />
    </label>
  );
}
