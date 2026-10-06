'use client';

import type { Column } from '@tanstack/react-table';

import type { DataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/shared/components/reui/data-grid/data-grid-column-header';

/**
 * El botón de ReUI trae `text-sm` + `font-normal`: se lo alinea con los headers
 * no ordenables (caption 12px, 500, `ink-subtle`, DESIGN.md §Tabla densa).
 */
const SORTABLE_HEADER_CLASSES = 'text-xs font-medium text-ink-subtle hover:text-ink data-[state=open]:text-ink';

/**
 * Header ordenable para `AppColumnDef.header` (menú Asc/Desc de ReUI).
 * Uso: `{ accessorKey: 'fecha', header: sortableHeader('Fecha') }`.
 */
export function sortableHeader(title: string) {
  function SortableHeader<T extends object, TValue>({ column }: { readonly column: Column<DataGridFeatures, T, TValue> }) {
    return <DataGridColumnHeader column={column} title={title} className={SORTABLE_HEADER_CLASSES} />;
  }
  return SortableHeader;
}
