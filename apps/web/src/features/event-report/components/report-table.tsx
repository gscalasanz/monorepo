'use client';

import type { ReactNode } from 'react';

import { AppDataGrid, type AppColumnDef } from '@/shared/components/data';

/** Columnas numéricas: a la derecha y tabulares (DESIGN §Tabla densa). */
export const NUMERIC_COLUMN_META = {
  headerClassName: 'text-right [&>div]:justify-end',
  cellClassName: 'text-right tabular-nums',
} as const;

export interface ReportTableFooter {
  readonly label: string;
  readonly value: ReactNode;
}

export interface ReportTableProps<T extends object> {
  readonly ariaLabel: string;
  readonly columns: readonly AppColumnDef<T>[];
  readonly data: readonly T[];
  readonly getRowId?: (row: T) => string;
  /** Fila en la lista mobile (<860px). */
  readonly mobileRow: (row: T) => ReactNode;
  /** Fila de total (TOTAL EGRESOS, TOTAL PENDIENTE…). */
  readonly footer?: ReportTableFooter;
  readonly emptyState?: ReactNode;
}

/** Tabla de solo lectura del reporte: todas las filas, lista en mobile, total opcional. */
export function ReportTable<T extends object>({
  footer,
  ...grid
}: ReportTableProps<T>) {
  return (
    <div className="min-w-0">
      <AppDataGrid<T> {...grid} pagination="none" />
      {footer ? (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-[13px] font-semibold text-ink md:px-[18px]">
          <span>{footer.label}</span>
          <span className="tabular-nums">{footer.value}</span>
        </div>
      ) : null}
    </div>
  );
}
