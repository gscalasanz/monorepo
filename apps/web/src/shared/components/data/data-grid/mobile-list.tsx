'use client';

import { flexRender, type Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { useDataGrid } from '@/shared/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';
import { LoadingState } from '@/shared/components/feedback';
import { cn } from '@/shared/lib/utils';

export interface MobileListProps<T extends object> {
  readonly renderRow?: (row: T) => ReactNode;
  readonly onRowClick?: (row: T) => void;
  readonly emptyState: ReactNode;
  readonly ariaLabel?: string;
}

/** Layout por defecto: primera columna a la izquierda, segunda a la derecha. */
function DefaultMobileRow<T extends object>({ row }: { readonly row: Row<DataGridFeatures, T> }) {
  const [main, aside] = row.getVisibleCells();
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0 truncate">
        {main ? flexRender(main.column.columnDef.cell, main.getContext()) : null}
      </div>
      {aside ? (
        <div className="shrink-0 text-right tabular-nums">
          {flexRender(aside.column.columnDef.cell, aside.getContext())}
        </div>
      ) : null}
    </div>
  );
}

const ITEM_CLASS = 'flex min-h-14 w-full items-center px-4 py-2.5 text-left text-sm';

/**
 * Lista mobile (<860px) del `AppDataGrid`. Lee la tabla del contexto del
 * DataGrid, así respeta la misma paginación y orden que la vista tabla.
 */
export function MobileList<T extends object>({ renderRow, onRowClick, emptyState, ariaLabel }: MobileListProps<T>) {
  const { table, isLoading } = useDataGrid<T>();
  if (isLoading) return <LoadingState variant="skeleton" className="px-4" />;
  const rows = table.getRowModel().rows;
  if (rows.length === 0) return <div>{emptyState}</div>;
  return (
    <ul aria-label={ariaLabel} className="divide-y divide-border">
      {rows.map((row) => {
        const content = renderRow ? renderRow(row.original) : <DefaultMobileRow row={row} />;
        return (
          <li key={row.id}>
            {onRowClick ? (
              <button
                type="button"
                onClick={() => onRowClick(row.original)}
                className={cn(ITEM_CLASS, 'block hover:bg-recessed/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus')}
              >
                {content}
              </button>
            ) : (
              <div className={ITEM_CLASS}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
