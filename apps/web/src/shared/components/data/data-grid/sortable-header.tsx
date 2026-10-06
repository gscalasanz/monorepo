'use client';

import type { Column } from '@tanstack/react-table';

import type { DataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/shared/components/reui/data-grid/data-grid-column-header';

/**
 * Header ordenable para `AppColumnDef.header` (menú Asc/Desc de ReUI).
 * Uso: `{ accessorKey: 'fecha', header: sortableHeader('Fecha') }`.
 */
export function sortableHeader(title: string) {
  function SortableHeader<T extends object, TValue>({ column }: { readonly column: Column<DataGridFeatures, T, TValue> }) {
    return <DataGridColumnHeader column={column} title={title} />;
  }
  return SortableHeader;
}
