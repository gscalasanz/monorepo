'use client';

import Link from 'next/link';

import { NavChevron } from '@/shared/components/ui/nav-chevron';
import {
  MONEY_CELL_CLASS,
  Money,
  RamaChip,
  sortableHeader,
  type AppColumnDef,
} from '@/shared/components/data';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CuentaActions } from '@/features/cajas/components/cuenta-actions';
import type { CuentaRow } from '@/features/cajas/helpers/cuentas';

const MONEY_DECIMALS = 2;

export const CUENTAS_COLUMNS: readonly AppColumnDef<CuentaRow>[] = [
  {
    id: 'nombre',
    accessorFn: (row) => row.nombre,
    header: sortableHeader(C.COL_NOMBRE),
    cell: ({ row }) =>
      row.original.propietarioId ? (
        <Link
          href={CAJAS_LINKS.fichaPropietario(row.original.propietarioId)}
          className="group inline-flex items-center gap-1 font-medium text-ink hover:underline"
        >
          {row.original.nombre}
          <NavChevron />
        </Link>
      ) : (
        row.original.nombre
      ),
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
