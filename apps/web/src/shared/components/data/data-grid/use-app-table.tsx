'use client';

import {
  functionalUpdate,
  useTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { Skeleton } from '@/shared/components/reui/skeleton';
import { dataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';
import { UI_CONFIG } from '@/shared/constants';

import { EXPAND_COLUMN_ID } from '@/shared/components/data/data-grid/grid-config';
import { ExpandToggle } from '@/shared/components/data/data-grid/expand-toggle';
import type {
  AppColumnDef,
  AppDataGridProps,
  AppGridExpandable,
  ServerPagination,
} from '@/shared/components/data/data-grid/types';

const EXPAND_COLUMN_WIDTH = 44;

const DEFAULT_SKELETON = (
  <Skeleton aria-hidden className="h-4 w-3/4 rounded-sm bg-recessed" />
);

const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
};

/** Agrega un skeleton por defecto a cada columna (sin mutar las del consumidor). */
function withSkeletons<T extends object>(
  columns: readonly AppColumnDef<T>[],
): AppColumnDef<T>[] {
  return columns.map((column) => ({
    ...column,
    meta: { skeleton: DEFAULT_SKELETON, ...column.meta },
  }));
}

/** Columna ▸ al inicio; su `meta.expandedContent` es lo que ReUI dibuja debajo de la fila. */
function expandColumn<T extends object>(
  expandable: AppGridExpandable<T>,
): AppColumnDef<T> {
  return {
    id: EXPAND_COLUMN_ID,
    size: EXPAND_COLUMN_WIDTH,
    header: () => null,
    enableSorting: false,
    meta: { expandedContent: expandable.render, cellClassName: 'pr-0' },
    cell: ({ row }) => (
      <ExpandToggle
        expanded={row.getIsExpanded()}
        onToggle={() => row.toggleExpanded()}
        label={expandable.label(row.original)}
      />
    ),
  };
}

function isServer(
  pagination: AppDataGridProps<object>['pagination'],
): pagination is ServerPagination {
  return typeof pagination === 'object';
}

type TableParams<T extends object> = Pick<
  AppDataGridProps<T>,
  | 'columns'
  | 'data'
  | 'pagination'
  | 'sorting'
  | 'initialSorting'
  | 'getRowId'
  | 'expandable'
>;

/** Instancia TanStack v9 con paginación/orden controlados (cliente o servidor). */
export function useAppTable<T extends object>(params: TableParams<T>) {
  const {
    columns,
    data,
    pagination = 'client',
    sorting,
    initialSorting = [],
    getRowId,
    expandable,
  } = params;
  const [clientPagination, setClientPagination] = useState(INITIAL_PAGINATION);
  const [clientSorting, setClientSorting] =
    useState<SortingState>(initialSorting);
  const server = isServer(pagination) ? pagination : undefined;
  const paginationState = server
    ? { pageIndex: server.pageIndex, pageSize: server.pageSize }
    : clientPagination;
  const sortingState = sorting?.state ?? clientSorting;
  const resolvedColumns = useMemo(
    () =>
      withSkeletons(
        expandable ? [expandColumn(expandable), ...columns] : columns,
      ),
    [columns, expandable],
  );

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = functionalUpdate(updater, paginationState);
    if (server) server.onChange(next);
    else setClientPagination(next);
  };
  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = functionalUpdate(updater, sortingState);
    if (sorting) sorting.onChange(next);
    else setClientSorting(next);
  };

  return useTable({
    features: dataGridFeatures,
    data,
    columns: resolvedColumns,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: { pagination: paginationState, sorting: sortingState },
    onPaginationChange,
    onSortingChange,
    manualPagination: pagination !== 'client',
    manualSorting: sorting?.manual ?? false,
    rowCount: server?.total,
    getRowCanExpand: expandable ? () => true : undefined,
  });
}

export function recordCountOf<T extends object>(params: {
  readonly pagination: AppDataGridProps<T>['pagination'];
  readonly data: readonly T[];
}): number {
  return isServer(params.pagination)
    ? params.pagination.total
    : params.data.length;
}

export function showsPagination<T extends object>(
  pagination: AppDataGridProps<T>['pagination'],
): boolean {
  return pagination !== 'none';
}
