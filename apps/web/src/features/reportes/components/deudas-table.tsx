'use client';

import Link from 'next/link';

import {
  AppDataGrid,
  MONEY_CELL_CLASS,
  Money,
  RamaChip,
  type AppColumnDef,
  type AppGridExpandable,
} from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { personaHref } from '@/shared/constants/links';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { DebtSummaryChips } from '@/features/reportes/components/debt-summary-chips';
import { DeudaDetail } from '@/features/reportes/components/deuda-detail';
import { countDocsFaltantes } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const WIDTHS = { persona: 260, total: 130, acciones: 56 } as const;
const MONEY_META = {
  cellClassName: MONEY_CELL_CLASS,
  headerClassName: MONEY_CELL_CLASS,
} as const;

type Row = PersonaDeuda;

const fichaOf = (p: Row): string =>
  personaHref({ tipo: p.tipo, id: p.personaId });

function PersonaCell({
  persona: p,
  detail,
}: {
  readonly persona: Row;
  readonly detail?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <Link
        href={fichaOf(p)}
        className="max-w-full truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-focus"
        onClick={(event) => event.stopPropagation()}
      >
        {p.nombre}
      </Link>
      <span className="flex min-w-0 items-center gap-2 text-xs text-ink-subtle">
        {p.rama ? <RamaChip rama={p.rama} variant="dot" /> : null}
        {detail ? <span className="truncate">{detail}</span> : null}
      </span>
    </div>
  );
}

function FichaLink({ persona: p }: { readonly persona: Row }) {
  return (
    <Link
      href={fichaOf(p)}
      aria-label={C.VER_FICHA(p.nombre)}
      onClick={(event) => event.stopPropagation()}
      className="group flex size-11 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus md:size-8"
    >
      <NavChevron />
    </Link>
  );
}

const total = (p: Row) =>
  p.deudaTotal > 0 ? (
    <Money amount={p.deudaTotal} tone="debt" className="font-semibold" />
  ) : null;

const COLUMNS: readonly AppColumnDef<Row>[] = [
  {
    id: 'persona',
    header: C.COL_PERSONA,
    size: WIDTHS.persona,
    cell: ({ row }) => <PersonaCell persona={row.original} />,
  },
  {
    id: 'deudas',
    header: C.COL_DEUDAS,
    cell: ({ row }) => <DebtSummaryChips persona={row.original} />,
  },
  {
    id: 'total',
    header: C.COL_TOTAL,
    size: WIDTHS.total,
    meta: MONEY_META,
    cell: ({ row }) => total(row.original),
  },
  {
    id: 'actions',
    size: WIDTHS.acciones,
    header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
    cell: ({ row }) => <FichaLink persona={row.original} />,
  },
];

const docsDetail = (p: Row): string | undefined => {
  const docs = countDocsFaltantes(p);
  return docs > 0 ? C.DOCS(docs) : undefined;
};

/** Mobile: nombre (link) + rama · total en rojo + chevron a la ficha; chips en el detalle. */
function MobileRow({ persona: p }: { readonly persona: Row }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
      <PersonaCell persona={p} detail={docsDetail(p)} />
      <div className="flex shrink-0 items-center gap-1">
        {total(p)}
        <FichaLink persona={p} />
      </div>
    </div>
  );
}

const EXPANDABLE: AppGridExpandable<Row> = {
  label: (p) => C.EXPAND(p.nombre),
  render: (p) => <DeudaDetail persona={p} />,
};

/** Deudores en tabla densa: clic en la fila abre el desglose; el nombre y el chevron van a la ficha. */
export function DeudasTable({ deudas }: { readonly deudas: readonly Row[] }) {
  return (
    <AppDataGrid
      columns={COLUMNS}
      data={deudas}
      ariaLabel={C.TABLE_LABEL}
      getRowId={(p) => p.personaId}
      mobileRow={(p) => <MobileRow persona={p} />}
      expandable={EXPANDABLE}
      initialSorting={[]}
      pagination="none"
    />
  );
}
