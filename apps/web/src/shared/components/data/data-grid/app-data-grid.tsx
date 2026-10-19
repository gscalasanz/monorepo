'use client';

import type { ReactNode } from 'react';

import {
  DataGrid,
  DataGridContainer,
} from '@/shared/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/shared/components/reui/data-grid/data-grid-pagination';
import { DataGridTable } from '@/shared/components/reui/data-grid/data-grid-table';
import { EmptyState } from '@/shared/components/feedback';
import { UI_CONFIG } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '@/shared/components/data/copy';
import {
  MOBILE_LIST_QUERY,
  useMediaQuery,
} from '@/shared/components/data/use-media-query';
import {
  DATA_GRID_I18N_ES,
  DENSE_TABLE_CLASSES,
} from '@/shared/components/data/data-grid/grid-config';
import { MobileList } from '@/shared/components/data/data-grid/mobile-list';
import type {
  AppDataGridProps,
  AppGridLayout,
} from '@/shared/components/data/data-grid/types';
import {
  recordCountOf,
  showsPagination,
  useAppTable,
} from '@/shared/components/data/data-grid/use-app-table';

/** Sin `onRowClick` propio, una grilla `expandable` abre/cierra la fila al hacer clic en ella. */
function useRowClick<T extends object>(params: {
  readonly table: ReturnType<typeof useAppTable<T>>;
  readonly ownRowClick: AppDataGridProps<T>['onRowClick'];
  readonly expandable: AppDataGridProps<T>['expandable'];
}): AppDataGridProps<T>['onRowClick'] {
  const { table, ownRowClick, expandable } = params;
  if (ownRowClick || !expandable) return ownRowClick;
  return (data) => {
    table
      .getRowModel()
      .rows.find((row) => row.original === data)
      ?.toggleExpanded();
  };
}

function useIsList(layout: AppGridLayout): boolean {
  const isMobile = useMediaQuery(MOBILE_LIST_QUERY);
  return layout === 'list' || (layout === 'auto' && isMobile);
}

interface GridViewProps<T extends object> {
  readonly isList: boolean;
  readonly grid: AppDataGridProps<T>;
  readonly emptyState: ReactNode;
}

/** Lista mobile o tabla, según el layout resuelto. */
function GridView<T extends object>({
  isList,
  grid,
  emptyState,
}: GridViewProps<T>) {
  if (isList) {
    return (
      <MobileList<T>
        renderRow={grid.mobileRow}
        onRowClick={grid.onRowClick}
        emptyState={emptyState}
        ariaLabel={grid.ariaLabel}
        expandable={grid.expandable}
      />
    );
  }
  return (
    <DataGridContainer>
      <div
        role="region"
        aria-label={grid.ariaLabel}
        className="overflow-x-auto"
      >
        <DataGridTable />
      </div>
    </DataGridContainer>
  );
}

/**
 * Tabla densa de la app sobre el DataGrid de ReUI (TanStack v9).
 * Paginación cliente por defecto (`UI_CONFIG.PAGINATION`) o servidor; orden
 * interno o controlado; bajo 860px se convierte en lista (`mobileRow`).
 * `expandable` agrega un ▸ por fila que abre contenido debajo (tabla y lista).
 */
export function AppDataGrid<T extends object>(props: AppDataGridProps<T>) {
  const {
    data,
    isLoading = false,
    pagination,
    onRowClick: ownRowClick,
    expandable,
    layout = 'auto',
    className,
  } = props;
  const table = useAppTable(props);
  const isList = useIsList(layout);
  const onRowClick = useRowClick({ table, ownRowClick, expandable });
  const emptyState = props.emptyState ?? (
    <EmptyState title={DATA_COPY.grid.empty} />
  );
  return (
    <div
      className={cn('min-w-0', className)}
      aria-busy={isLoading || undefined}
    >
      <DataGrid
        table={table}
        recordCount={recordCountOf({ pagination, data })}
        isLoading={isLoading}
        loadingMode="skeleton"
        emptyMessage={emptyState}
        onRowClick={onRowClick}
        i18n={DATA_GRID_I18N_ES}
        tableLayout={{ headerBorder: true, rowBorder: true }}
        tableClassNames={DENSE_TABLE_CLASSES}
      >
        {isLoading ? (
          <span role="status" className="sr-only">
            {DATA_COPY.grid.loading}
          </span>
        ) : null}
        <GridView<T> isList={isList} grid={props} emptyState={emptyState} />
        {showsPagination(pagination) ? (
          <DataGridPagination
            sizes={[...UI_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS]}
            className="border-t border-border px-4 py-2.5 text-[13px] text-ink-muted md:px-[18px]"
          />
        ) : null}
      </DataGrid>
    </div>
  );
}
