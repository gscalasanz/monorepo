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

import type { AppColumnDef, AppDataGridProps, ServerPagination } from './types';

const DEFAULT_SKELETON = <Skeleton aria-hidden className="h-4 w-3/4 rounded-sm bg-recessed" />;

const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
};

/** Agrega un skeleton por defecto a cada columna (sin mutar las del consumidor). */
function withSkeletons<T extends object>(columns: readonly AppColumnDef<T>[]): AppColumnDef<T>[] {
  return columns.map((column) => ({
    ...column,
    meta: { skeleton: DEFAULT_SKELETON, ...column.meta },
  }));
}

function isServer(pagination: AppDataGridProps<object>['pagination']): pagination is ServerPagination {
  return typeof pagination === 'object';
}

type TableParams<T extends object> = Pick<
  AppDataGridProps<T>,
  'columns' | 'data' | 'pagination' | 'sorting' | 'initialSorting' | 'getRowId'
>;

/** Instancia TanStack v9 con paginación/orden controlados (cliente o servidor). */
export function useAppTable<T extends object>(params: TableParams<T>) {
  const { columns, data, pagination = 'client', sorting, initialSorting = [], getRowId } = params;
  const [clientPagination, setClientPagination] = useState(INITIAL_PAGINATION);
  const [clientSorting, setClientSorting] = useState<SortingState>(initialSorting);
  const server = isServer(pagination) ? pagination : undefined;
  const paginationState = server
    ? { pageIndex: server.pageIndex, pageSize: server.pageSize }
    : clientPagination;
  const sortingState = sorting?.state ?? clientSorting;
  const resolvedColumns = useMemo(() => withSkeletons(columns), [columns]);

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
  });
}

export function recordCountOf<T extends object>(params: {
  readonly pagination: AppDataGridProps<T>['pagination'];
  readonly data: readonly T[];
}): number {
  return isServer(params.pagination) ? params.pagination.total : params.data.length;
}

export function showsPagination<T extends object>(pagination: AppDataGridProps<T>['pagination']): boolean {
  return pagination !== 'none';
}
