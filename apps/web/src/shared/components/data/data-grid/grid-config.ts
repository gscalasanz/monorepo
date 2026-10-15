import type { DataGridI18nOverrides } from '@/shared/components/reui/data-grid/data-grid-i18n';

import { DATA_COPY } from '@/shared/components/data/copy';

const { grid } = DATA_COPY;

/** Labels en español para el `i18n` del DataGrid de ReUI. */
export const DATA_GRID_I18N_ES: DataGridI18nOverrides = {
  labels: {
    sortAscending: grid.sortAscending,
    sortDescending: grid.sortDescending,
    pinColumnStart: grid.pinColumnStart,
    pinColumnEnd: grid.pinColumnEnd,
    moveColumnStart: grid.moveColumnStart,
    moveColumnEnd: grid.moveColumnEnd,
    columnsMenu: grid.columnsMenu,
    unpinColumn: grid.unpinColumn,
    toggleColumns: grid.toggleColumns,
    selectRow: grid.selectRow,
    selectAll: grid.selectAll,
    expandRow: grid.expandRow,
    collapseRow: grid.collapseRow,
    loading: grid.loading,
    empty: grid.empty,
    allRowsLoaded: grid.allRowsLoaded,
    rowsPerPage: grid.rowsPerPage,
    paginationInfo: grid.paginationInfo,
    previousPage: grid.previousPage,
    nextPage: grid.nextPage,
    goToPage: grid.goToPage,
    filterSelectedCount: grid.filterSelectedCount,
    filterNoResults: grid.filterNoResults,
    filterClear: grid.filterClear,
  },
};

/** Tabla densa (DESIGN §Tabla densa): header 12px ink-subtle, filas 48px, hover recessed 70%. */
export const DENSE_TABLE_CLASSES = {
  headerRow:
    '[&>th]:h-9 [&>th]:text-xs [&>th]:font-medium [&>th]:text-ink-subtle [&>th]:whitespace-nowrap',
  bodyRow:
    'h-12 text-[13px] text-ink transition-colors hover:bg-recessed/70 data-[state=selected]:bg-brand-soft/70 [&>td]:border-border',
  edgeCell: 'first:pl-[18px] last:pr-[18px]',
} as const;

export const MONEY_CELL_CLASS = 'text-right tabular-nums';

/** Id de la columna ▸ que agrega `expandable` (la lista mobile la omite). */
export const EXPAND_COLUMN_ID = '__expand';
