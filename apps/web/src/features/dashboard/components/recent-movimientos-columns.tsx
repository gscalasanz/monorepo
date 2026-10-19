import Link from 'next/link';

import { DirectionTile, MONEY_CELL_CLASS, Money, type AppColumnDef } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import type { RecentMovimientoRow } from '@/features/dashboard/helpers/view-model';

type Column = AppColumnDef<RecentMovimientoRow>;

/** Anchos (px): Concepto absorbe el espacio y el resto queda ajustado a su contenido. */
const COL_SIZE = { concepto: 300, caja: 130, medio: 110, fecha: 72, monto: 120, open: 32 } as const;

const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;
const MUTED = { cellClassName: 'whitespace-nowrap text-ink-muted' } as const;

/** Concepto: tile de dirección + título y responsable como sub-línea (DESIGN §Tabla densa). */
export const RECENT_COLUMNS: readonly Column[] = [
  {
    id: 'concepto',
    header: C.COL_CONCEPTO,
    size: COL_SIZE.concepto,
    cell: ({ row }) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <DirectionTile direction={row.original.direction} decorative />
        <span className="grid min-w-0">
          <Link
            href={row.original.href}
            onClick={(event) => event.stopPropagation()}
            className="truncate font-medium text-ink hover:underline"
          >
            {row.original.title}
          </Link>
          <span className="truncate text-xs text-ink-subtle">{row.original.responsable}</span>
        </span>
      </span>
    ),
  },
  { id: 'caja', header: C.COL_CAJA, size: COL_SIZE.caja, meta: MUTED, cell: ({ row }) => row.original.caja },
  { id: 'medio', header: C.COL_MEDIO, size: COL_SIZE.medio, meta: MUTED, cell: ({ row }) => row.original.medio },
  { id: 'fecha', header: C.COL_FECHA, size: COL_SIZE.fecha, meta: NOWRAP, cell: ({ row }) => <span className="tabular-nums">{row.original.fecha}</span> },
  {
    id: 'monto',
    header: C.COL_MONTO,
    size: COL_SIZE.monto,
    meta: { cellClassName: MONEY_CELL_CLASS, headerClassName: MONEY_CELL_CLASS },
    cell: ({ row }) => <Money amount={row.original.amount} sign="auto" />,
  },
  {
    id: 'open',
    header: () => <span className="sr-only">{C.COL_OPEN}</span>,
    size: COL_SIZE.open,
    meta: { cellClassName: 'w-8 pl-0', headerClassName: 'w-8' },
    cell: () => <NavChevron />,
  },
];
