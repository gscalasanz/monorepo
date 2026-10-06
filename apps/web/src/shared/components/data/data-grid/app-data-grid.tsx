'use client';

import { DataGrid, DataGridContainer } from '@/shared/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/shared/components/reui/data-grid/data-grid-pagination';
import { DataGridTable } from '@/shared/components/reui/data-grid/data-grid-table';
import { EmptyState } from '@/shared/components/feedback';
import { UI_CONFIG } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '../copy';
import { MOBILE_LIST_QUERY, useMediaQuery } from '../use-media-query';
import { DATA_GRID_I18N_ES, DENSE_TABLE_CLASSES } from './grid-config';
import { MobileList } from './mobile-list';
import type { AppDataGridProps, AppGridLayout } from './types';
import { recordCountOf, showsPagination, useAppTable } from './use-app-table';

function useIsList(layout: AppGridLayout): boolean {
  const isMobile = useMediaQuery(MOBILE_LIST_QUERY);
  return layout === 'list' || (layout === 'auto' && isMobile);
}

/**
 * Tabla densa de la app sobre el DataGrid de ReUI (TanStack v9).
 * Paginación cliente por defecto (`UI_CONFIG.PAGINATION`) o servidor; orden
 * interno o controlado; bajo 860px se convierte en lista (`mobileRow`).
 */
export function AppDataGrid<T extends object>(props: AppDataGridProps<T>) {
  const { data, isLoading = false, pagination, onRowClick, mobileRow, layout = 'auto', ariaLabel, className } = props;
  const table = useAppTable(props);
  const isList = useIsList(layout);
  const emptyState = props.emptyState ?? <EmptyState title={DATA_COPY.grid.empty} />;
  return (
    <div className={cn('min-w-0', className)} aria-busy={isLoading || undefined}>
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
        {isLoading ? <span role="status" className="sr-only">{DATA_COPY.grid.loading}</span> : null}
        {isList ? (
          <MobileList<T> renderRow={mobileRow} onRowClick={onRowClick} emptyState={emptyState} ariaLabel={ariaLabel} />
        ) : (
          <DataGridContainer>
            <div role="region" aria-label={ariaLabel} className="overflow-x-auto">
              <DataGridTable />
            </div>
          </DataGridContainer>
        )}
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
