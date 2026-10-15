'use client';

import { flexRender, type Row } from '@tanstack/react-table';
import { useId, type ReactNode } from 'react';

import { useDataGrid } from '@/shared/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';
import { LoadingState } from '@/shared/components/feedback';
import { cn } from '@/shared/lib/utils';

import { EXPAND_COLUMN_ID } from '@/shared/components/data/data-grid/grid-config';
import { ExpandToggle } from '@/shared/components/data/data-grid/expand-toggle';
import type { AppGridExpandable } from '@/shared/components/data/data-grid/types';

export interface MobileListProps<T extends object> {
  readonly renderRow?: (row: T) => ReactNode;
  readonly onRowClick?: (row: T) => void;
  readonly emptyState: ReactNode;
  readonly ariaLabel?: string;
  readonly expandable?: AppGridExpandable<T>;
}

/** Layout por defecto: primera columna a la izquierda, segunda a la derecha. */
function DefaultMobileRow<T extends object>({
  row,
}: {
  readonly row: Row<DataGridFeatures, T>;
}) {
  const [main, aside] = row
    .getVisibleCells()
    .filter((cell) => cell.column.id !== EXPAND_COLUMN_ID);
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0 truncate">
        {main
          ? flexRender(main.column.columnDef.cell, main.getContext())
          : null}
      </div>
      {aside ? (
        <div className="shrink-0 text-right tabular-nums">
          {flexRender(aside.column.columnDef.cell, aside.getContext())}
        </div>
      ) : null}
    </div>
  );
}

const ITEM_CLASS =
  'flex min-h-14 w-full items-center px-4 py-2.5 text-left text-sm';
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
      <div
        id={labelId}
        className={cn(
          ITEM_CLASS,
          'pointer-events-none relative',
          INTERACTIVE_CHILDREN,
        )}
      >
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}

interface ExpandableItemProps<T extends object> {
  readonly row: Row<DataGridFeatures, T>;
  readonly expandable: AppGridExpandable<T>;
  readonly children: ReactNode;
}

/** Fila con ▸ a la izquierda y el contenido expandido debajo. */
function ExpandableItem<T extends object>({
  row,
  expandable,
  children,
}: ExpandableItemProps<T>) {
  const expanded = row.getIsExpanded();
  return (
    <>
      <div className="flex items-center pl-1">
        <ExpandToggle
          expanded={expanded}
          onToggle={() => row.toggleExpanded()}
          label={expandable.label(row.original)}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {expanded ? (
        <div className="bg-recessed">{expandable.render(row.original)}</div>
      ) : null}
    </>
  );
}

function RowItem<T extends object>(props: {
  readonly row: Row<DataGridFeatures, T>;
  readonly labelId: string;
  readonly list: MobileListProps<T>;
}) {
  const { row, labelId, list } = props;
  const content = list.renderRow ? (
    list.renderRow(row.original)
  ) : (
    <DefaultMobileRow row={row} />
  );
  const { onRowClick } = list;
  const item = onRowClick ? (
    <ClickableRow labelId={labelId} onClick={() => onRowClick(row.original)}>
      {content}
    </ClickableRow>
  ) : (
    <div className={ITEM_CLASS}>{content}</div>
  );
  if (!list.expandable) return item;
  return (
    <ExpandableItem row={row} expandable={list.expandable}>
      {item}
    </ExpandableItem>
  );
}

/**
 * Lista mobile (<860px) del `AppDataGrid`. Lee la tabla del contexto del
 * DataGrid, así respeta la misma paginación y orden que la vista tabla.
 */
export function MobileList<T extends object>(props: MobileListProps<T>) {
  const { emptyState, ariaLabel } = props;
  const { table, isLoading } = useDataGrid<T>();
  const baseId = useId();
  if (isLoading) return <LoadingState variant="skeleton" className="px-4" />;
  const rows = table.getRowModel().rows;
  if (rows.length === 0) return <div>{emptyState}</div>;
  return (
    <ul aria-label={ariaLabel} className="divide-y divide-border">
      {rows.map((row) => (
        <li key={row.id}>
          <RowItem
            row={row}
            labelId={`${baseId}-row-${row.index}`}
            list={props}
          />
        </li>
      ))}
    </ul>
  );
}
