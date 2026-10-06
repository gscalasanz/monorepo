'use client';

import {
  MONEY_CELL_CLASS,
  Money,
  sortableHeader,
  type AppColumnDef,
} from '@/shared/components/data';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { TransferenciaDeleteButton } from '@/features/cajas/components/transferencia-delete-button';
import type { TransferenciaRow } from '@/features/cajas/helpers/fondo-solidario';

type Col = AppColumnDef<TransferenciaRow>;

const MONEY_DECIMALS = 2;

const STATIC_COLUMNS: readonly Col[] = [
  {
    id: 'fecha',
    accessorFn: (row) => row.fecha,
    header: sortableHeader(C.COL_FECHA),
    cell: ({ row }) => formatDate(row.original.fecha, DATE_FORMATS.date),
  },
  {
    id: 'descripcion',
    header: C.COL_DESCRIPCION_FS,
    cell: ({ row }) => row.original.descripcion ?? C.EMPTY_CELL,
  },
  {
    id: 'responsable',
    header: C.COL_RESPONSABLE,
    cell: ({ row }) => row.original.responsable ?? C.EMPTY_CELL,
  },
  {
    id: 'monto',
    accessorFn: (row) => row.monto,
    header: sortableHeader(C.COL_MONTO),
    cell: ({ row }) => (
      <Money amount={row.original.monto} decimals={MONEY_DECIMALS} />
    ),
    meta: {
      headerClassName: MONEY_CELL_CLASS,
      cellClassName: MONEY_CELL_CLASS,
    },
  },
];

/** Columnas de "Transferencias Recibidas" (Fecha, Descripción, Responsable, Monto, Eliminar). */
export function transferenciasColumns(
  onDelete: (row: TransferenciaRow) => void,
): readonly Col[] {
  return [
    ...STATIC_COLUMNS,
    {
      id: 'acciones',
      header: C.COL_ACCIONES,
      cell: ({ row }) => (
        <TransferenciaDeleteButton onClick={() => onDelete(row.original)} />
      ),
    },
  ];
}
