'use client';

import {
  MONEY_CELL_CLASS,
  Money,
  RamaChip,
  sortableHeader,
  type AppColumnDef,
} from '@/shared/components/data';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CuentaActions } from '@/features/cajas/components/cuenta-actions';
import type { CuentaRow } from '@/features/cajas/helpers/cuentas';

const MONEY_DECIMALS = 2;

export const CUENTAS_COLUMNS: readonly AppColumnDef<CuentaRow>[] = [
  {
    id: 'nombre',
    accessorFn: (row) => row.nombre,
    header: sortableHeader(C.COL_NOMBRE),
  },
  {
    id: 'rama',
    accessorFn: (row) => row.rama ?? '',
    header: sortableHeader(C.COL_RAMA),
    cell: ({ row }) =>
      row.original.rama ? <RamaChip rama={row.original.rama} /> : C.EMPTY_CELL,
  },
  {
    id: 'saldo',
    accessorFn: (row) => row.saldo,
    header: sortableHeader(C.COL_SALDO),
    cell: ({ row }) => (
      <Money
        amount={row.original.saldo}
        decimals={MONEY_DECIMALS}
        tone={row.original.saldo < 0 ? 'debt' : undefined}
      />
    ),
    meta: {
      headerClassName: MONEY_CELL_CLASS,
      cellClassName: MONEY_CELL_CLASS,
    },
  },
  {
    id: 'acciones',
    header: C.COL_ACCIONES,
    cell: ({ row }) => <CuentaActions row={row.original} />,
  },
];
