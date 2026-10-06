'use client';

import { flexRender, type Row } from '@tanstack/react-table';
import { useId, type ReactNode } from 'react';

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
/** Hijos interactivos del contenido: recuperan el puntero por encima del overlay. */
const INTERACTIVE_CHILDREN =
  '[&_:is(a,button,input,select,textarea,[role=button])]:pointer-events-auto';

interface ClickableRowProps {
  readonly labelId: string;
  readonly onClick: () => void;
  readonly children: ReactNode;
}

/**
 * Fila clickeable sin anidar interactivos: el `<button>` es un overlay hermano
 * (`absolute inset-0`) nombrado por el contenido; el contenido deja pasar el
 * puntero salvo en sus propios botones/links.
 */
function ClickableRow({ labelId, onClick, children }: ClickableRowProps) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-labelledby={labelId}
        onClick={onClick}
        className="absolute inset-0 hover:bg-recessed/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
      />
      <div id={labelId} className={cn(ITEM_CLASS, 'pointer-events-none relative', INTERACTIVE_CHILDREN)}>
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}

/**
 * Lista mobile (<860px) del `AppDataGrid`. Lee la tabla del contexto del
 * DataGrid, así respeta la misma paginación y orden que la vista tabla.
 */
export function MobileList<T extends object>({ renderRow, onRowClick, emptyState, ariaLabel }: MobileListProps<T>) {
  const { table, isLoading } = useDataGrid<T>();
  const baseId = useId();
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
              <ClickableRow labelId={`${baseId}-row-${row.index}`} onClick={() => onRowClick(row.original)}>
                {content}
              </ClickableRow>
            ) : (
              <div className={ITEM_CLASS}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
