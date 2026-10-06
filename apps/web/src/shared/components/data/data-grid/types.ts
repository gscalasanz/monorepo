import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import type { DataGridFeatures } from '@/shared/components/reui/data-grid/data-grid';

/** Columna del grid de la app (TanStack v9 + features de ReUI). */
export type AppColumnDef<T extends object> = ColumnDef<DataGridFeatures, T>;

export interface PageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}

/** Paginación del lado del servidor: el grid solo muestra `data` (la página actual). */
export interface ServerPagination extends PageChange {
  readonly total: number;
  readonly onChange: (next: PageChange) => void;
}

/** `client` (default) · `none` (todas las filas) · objeto = server-side. */
export type AppGridPagination = 'client' | 'none' | ServerPagination;

export interface AppGridSorting {
  readonly state: SortingState;
  readonly onChange: (next: SortingState) => void;
  /** `true` si el backend ordena (no se reordena `data` en cliente). */
  readonly manual?: boolean;
}

export type AppGridLayout = 'auto' | 'table' | 'list';

export interface AppDataGridProps<T extends object> {
  readonly columns: readonly AppColumnDef<T>[];
  readonly data: readonly T[];
  readonly isLoading?: boolean;
  /** Contenido para la lista vacía (ej. `<EmptyState …/>`). */
  readonly emptyState?: ReactNode;
  readonly pagination?: AppGridPagination;
  /** Orden controlado; si se omite, el orden es interno (cliente). */
  readonly sorting?: AppGridSorting;
  readonly initialSorting?: SortingState;
  readonly onRowClick?: (row: T) => void;
  readonly getRowId?: (row: T) => string;
  /** Render de cada fila en la lista mobile (<860px). */
  readonly mobileRow?: (row: T) => ReactNode;
  /** `auto` (default) según viewport; `table`/`list` lo fuerzan. */
  readonly layout?: AppGridLayout;
  /** Nombre accesible de la tabla/lista. */
  readonly ariaLabel?: string;
  readonly className?: string;
}
