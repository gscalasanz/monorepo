import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from './copy';

export interface KeyValueItem {
  readonly label: string;
  readonly value: ReactNode;
  /** Clave estable (default: `label`). */
  readonly id?: string;
}

const COLUMN_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
} as const;

export interface KeyValueListProps {
  readonly items: readonly KeyValueItem[];
  readonly columns?: keyof typeof COLUMN_CLASSES;
  readonly className?: string;
}

function isEmptyValue(value: ReactNode): boolean {
  return value === null || value === undefined || value === '';
}

/** Lista de solo lectura label → valor (equivalente a `readonly-card`, «facts» del mockup). */
export function KeyValueList({ items, columns = 2, className }: KeyValueListProps) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-3', COLUMN_CLASSES[columns], className)}>
      {items.map((item) => (
        <div key={item.id ?? item.label} className="min-w-0">
          <dt className="text-xs text-ink-subtle">{item.label}</dt>
          <dd className="mt-0.5 truncate text-sm font-medium text-ink">
            {isEmptyValue(item.value) ? DATA_COPY.emptyValue : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
