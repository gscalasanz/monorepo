'use client';

import { MovimientoConcepto } from '@/shared/components/finanzas';
import {
  MONEY_CELL_CLASS,
  Money,
  sortableHeader,
  type AppColumnDef,
} from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { MovimientoLink } from '@/features/cajas/components/movimiento-link';
import {
  conceptoLabel,
  isIngreso,
  movimientoCajaLabel,
} from '@/features/cajas/helpers/movimientos';

type Col = AppColumnDef<Movimiento>;

/**
 * Anchos explícitos (el resto usa el default de 150px): el concepto lleva el espacio
 * de sobra y ninguna columna se corta a 1440px.
 */
const COLUMN_SIZE = {
  FECHA: 84,
  CONCEPTO: 300,
  CAJA: 150,
  RESPONSABLE: 168,
  MONTO: 120,
  ACCIONES: 48,
} as const;

const fecha: Col = {
  id: 'fecha',
  accessorFn: (row) => row.fecha,
  header: sortableHeader(C.COL_FECHA),
  size: COLUMN_SIZE.FECHA,
  meta: { cellClassName: 'whitespace-nowrap' },
  cell: ({ row }) => (
    <span
      className="tabular-nums"
      title={formatDate(row.original.fecha, DATE_FORMATS.date)}
    >
      {formatDate(row.original.fecha, DATE_FORMATS.dayMonthPadded)}
    </span>
  ),
};

const concepto: Col = {
  id: 'concepto',
  accessorFn: (row) => conceptoLabel(row),
  header: sortableHeader(C.COL_CONCEPTO),
  size: COLUMN_SIZE.CONCEPTO,
  cell: ({ row }) => <MovimientoConcepto movimiento={row.original} />,
};

const monto: Col = {
  id: 'monto',
  accessorFn: (row) => row.monto,
  header: sortableHeader(C.COL_MONTO),
  size: COLUMN_SIZE.MONTO,
  cell: ({ row }) => (
    <Money
      amount={row.original.monto}
      sign={isIngreso(row.original) ? 'in' : 'out'}
    />
  ),
  meta: { headerClassName: MONEY_CELL_CLASS, cellClassName: MONEY_CELL_CLASS },
};

const caja: Col = {
  id: 'caja',
  header: C.COL_CAJA,
  size: COLUMN_SIZE.CAJA,
  cell: ({ row }) => movimientoCajaLabel(row.original),
};

const responsable: Col = {
  id: 'responsable',
  header: C.COL_RESPONSABLE,
  size: COLUMN_SIZE.RESPONSABLE,
  cell: ({ row }) => row.original.responsable?.nombre ?? C.EMPTY_CELL,
};

const abrir: Col = {
  id: 'abrir',
  header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
  size: COLUMN_SIZE.ACCIONES,
  cell: ({ row }) => <MovimientoLink movimiento={row.original} />,
};

/** "Últimos Movimientos" de la caja de grupo: Fecha, Concepto, Monto y link a la edición. */
export const ULTIMOS_COLUMNS: readonly Col[] = [fecha, concepto, monto, abrir];

/** "Movimientos de Ramas": Fecha, Concepto, Caja, Responsable, Monto y link a la edición. */
export const RAMAS_COLUMNS: readonly Col[] = [
  fecha,
  concepto,
  caja,
  responsable,
  monto,
  abrir,
];
