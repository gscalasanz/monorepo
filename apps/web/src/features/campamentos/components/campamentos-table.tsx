'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  AppDataGrid,
  MONEY_CELL_CLASS,
  Money,
  type AppColumnDef,
} from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import type { Campamento } from '@/shared/domain';
import { nowMs, todayBsAs } from '@/shared/time';
import { CampBadge } from '@/features/campamentos/components/camp-badge';
import {
  CampamentoMenu,
  CampamentoRowActions,
} from '@/features/campamentos/components/campamento-row-actions';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  fechasCompletas,
  fechasCortas,
} from '@/features/campamentos/helpers/camp-fechas';
import { CAMPAMENTO_LIMITS } from '@/features/campamentos/helpers/campamento-form';
import {
  cardBadge,
  type CardBadge,
} from '@/features/campamentos/helpers/camp-status';

const NUMBER_META = {
  cellClassName: MONEY_CELL_CLASS,
  headerClassName: MONEY_CELL_CLASS,
} as const;
const WIDTHS = {
  fechas: 150,
  participantes: 120,
  costo: 120,
  cuotas: 90,
  estado: 130,
  acciones: 88,
} as const;

type Column = AppColumnDef<Campamento>;
type BadgeOf = (camp: Campamento) => CardBadge;

export interface CampamentosTableProps {
  readonly campamentos: readonly Campamento[];
  readonly onDelete: (campamento: Campamento) => void;
}

const participantesOf = (camp: Campamento): number =>
  camp.participantes?.length ?? 0;

function NombreCell({ campamento }: { readonly campamento: Campamento }) {
  return (
    <div className="flex min-w-0 flex-col">
      <Link
        href={CAMPAMENTO_ROUTES.detail(campamento.id)}
        className="truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-focus"
        onClick={(event) => event.stopPropagation()}
      >
        {campamento.nombre}
      </Link>
      {campamento.descripcion ? (
        <span className="truncate text-xs text-ink-subtle">
          {campamento.descripcion}
        </span>
      ) : null}
    </div>
  );
}

function dataColumns(badgeOf: BadgeOf): readonly Column[] {
  return [
    {
      id: 'nombre',
      header: C.COL_CAMPAMENTO,
      cell: ({ row }) => <NombreCell campamento={row.original} />,
    },
    {
      id: 'fechas',
      header: C.COL_FECHAS,
      size: WIDTHS.fechas,
      meta: { cellClassName: 'whitespace-nowrap' },
      cell: ({ row }) => (
        <span className="tabular-nums" title={fechasCompletas(row.original)}>
          {fechasCortas(row.original)}
        </span>
      ),
    },
    {
      id: 'participantes',
      header: C.COL_PARTICIPANTES,
      size: WIDTHS.participantes,
      meta: NUMBER_META,
      cell: ({ row }) => participantesOf(row.original),
    },
    {
      id: 'costo',
      header: C.COL_COSTO,
      size: WIDTHS.costo,
      meta: NUMBER_META,
      cell: ({ row }) => <Money amount={row.original.costoPorPersona} />,
    },
    {
      id: 'cuotas',
      header: C.COL_CUOTAS,
      size: WIDTHS.cuotas,
      meta: NUMBER_META,
      cell: ({ row }) =>
        row.original.cuotasBase ?? CAMPAMENTO_LIMITS.DEFAULT_CUOTAS,
    },
    {
      id: 'estado',
      header: C.COL_ESTADO,
      size: WIDTHS.estado,
      cell: ({ row }) => <CampBadge badge={badgeOf(row.original)} />,
    },
  ];
}

function MobileRow({
  campamento,
  badge,
  onDelete,
}: {
  readonly campamento: Campamento;
  readonly badge: CardBadge;
} & Pick<CampamentosTableProps, 'onDelete'>) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-ink">
          {campamento.nombre}
        </span>
        <span className="truncate text-xs text-ink-subtle tabular-nums">
          {fechasCortas(campamento)} ·{' '}
          {C.participantes(participantesOf(campamento))}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <CampBadge badge={badge} />
        <CampamentoMenu campamento={campamento} onDelete={onDelete} />
        <NavChevron />
      </div>
    </div>
  );
}

function useBadgeOf(): BadgeOf {
  const [today] = useState(todayBsAs);
  const [now] = useState(nowMs);
  return useMemo(
    () => (camp: Campamento) => cardBadge({ camp, today, nowMs: now }),
    [today, now],
  );
}

/** Campamentos en tabla densa: nombre, fechas, participantes, costo, cuotas, estado y ⋯ + chevron. */
export function CampamentosTable({
  campamentos,
  onDelete,
}: CampamentosTableProps) {
  const router = useRouter();
  const badgeOf = useBadgeOf();
  const columns = useMemo<readonly Column[]>(
    () => [
      ...dataColumns(badgeOf),
      {
        id: 'actions',
        size: WIDTHS.acciones,
        header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
        cell: ({ row }) => (
          <CampamentoRowActions campamento={row.original} onDelete={onDelete} />
        ),
      },
    ],
    [badgeOf, onDelete],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={campamentos}
      ariaLabel={C.GRID_LABEL}
      getRowId={(camp) => camp.id}
      onRowClick={(camp) => router.push(CAMPAMENTO_ROUTES.detail(camp.id))}
      mobileRow={(camp) => (
        <MobileRow
          campamento={camp}
          badge={badgeOf(camp)}
          onDelete={onDelete}
        />
      )}
      initialSorting={[]}
    />
  );
}
