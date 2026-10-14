'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { ProgressTrack } from '@/shared/components/charts';
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
import type { ParticipantePago } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import {
  AutorizacionBadge,
  ParticipanteEstadoBadge,
} from '@/features/campamentos/components/participante-badges';
import { ParticipantePagos } from '@/features/campamentos/components/participante-pagos';
import {
  ParticipanteRowActions,
  type ParticipanteHandlers,
} from '@/features/campamentos/components/participante-row-actions';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import { montoCubierto } from '@/features/campamentos/helpers/detalle';

const WIDTHS = {
  pagado: 210,
  bonificado: 120,
  estado: 150,
  autorizacion: 130,
  acciones: 88,
} as const;
const MONEY_META = {
  cellClassName: MONEY_CELL_CLASS,
  headerClassName: MONEY_CELL_CLASS,
} as const;

type Row = ParticipantePago;
type Column = AppColumnDef<Row>;

export interface ParticipantesTableProps {
  readonly participantes: readonly Row[];
  readonly handlers: ParticipanteHandlers;
}

const fichaOf = (p: Row): string => personaHref({ tipo: p.tipo, id: p.id });

function PersonaCell({ participante: p }: { readonly participante: Row }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <Link
        href={fichaOf(p)}
        className="truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-focus"
        onClick={(event) => event.stopPropagation()}
      >
        {p.nombre}
      </Link>
      <span className="flex min-w-0 items-center gap-2 text-xs text-ink-subtle">
        {p.rama && <RamaChip rama={p.rama} variant="dot" />}
        <span className="truncate">
          {C.inscripto(
            formatDate(p.fechaInscripcion, DATE_FORMATS.dayMonthPadded),
          )}
        </span>
      </span>
    </div>
  );
}

function PagadoCell({ participante: p }: { readonly participante: Row }) {
  return (
    <span className="flex items-center gap-2">
      <ProgressTrack
        value={montoCubierto(p)}
        max={p.montoAsignado}
        color="var(--color-success)"
        className="w-12 shrink-0"
      />
      <span className="truncate text-xs text-ink-muted tabular-nums">
        <Money amount={montoCubierto(p)} /> / <Money amount={p.montoAsignado} />
      </span>
    </span>
  );
}

function RowActions({
  participante,
  handlers,
}: {
  readonly participante: Row;
  readonly handlers: ParticipanteHandlers;
}) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <ParticipanteRowActions participante={participante} handlers={handlers} />
      <Link
        href={fichaOf(participante)}
        aria-label={C.abrirFicha(participante.nombre)}
        className="group flex size-8 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus"
      >
        <NavChevron />
      </Link>
    </div>
  );
}

function dataColumns(): readonly Column[] {
  return [
    {
      id: 'persona',
      header: C.COL_PERSONA,
      cell: ({ row }) => <PersonaCell participante={row.original} />,
    },
    {
      id: 'pagado',
      header: C.COL_PAGADO,
      size: WIDTHS.pagado,
      cell: ({ row }) => <PagadoCell participante={row.original} />,
    },
    {
      id: 'bonificado',
      header: C.COL_BONIFICADO,
      size: WIDTHS.bonificado,
      meta: MONEY_META,
      cell: ({ row }) => (
        <Money amount={row.original.montoBonificado || null} />
      ),
    },
    {
      id: 'estado',
      header: C.COL_ESTADO,
      size: WIDTHS.estado,
      cell: ({ row }) => (
        <ParticipanteEstadoBadge participante={row.original} />
      ),
    },
    {
      id: 'autorizacion',
      header: C.COL_AUTORIZACION,
      size: WIDTHS.autorizacion,
      cell: ({ row }) => (
        <AutorizacionBadge entregada={row.original.autorizacionEntregada} />
      ),
    },
  ];
}

function MobileRow({
  participante: p,
  handlers,
}: {
  readonly participante: Row;
  readonly handlers: ParticipanteHandlers;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-ink">
          {p.nombre}
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
          {p.rama && <RamaChip rama={p.rama} variant="dot" />}
          {!p.autorizacionEntregada && <AutorizacionBadge entregada={false} />}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ParticipanteEstadoBadge participante={p} />
        <ParticipanteRowActions participante={p} handlers={handlers} />
        <NavChevron />
      </div>
    </div>
  );
}

/** Participantes en tabla densa: ▸ abre los pagos, ⋯ con las acciones, nombre y chevron a la ficha. */
export function ParticipantesTable({
  participantes,
  handlers,
}: ParticipantesTableProps) {
  const columns = useMemo<readonly Column[]>(
    () => [
      ...dataColumns(),
      {
        id: 'actions',
        size: WIDTHS.acciones,
        header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
        cell: ({ row }) => (
          <RowActions participante={row.original} handlers={handlers} />
        ),
      },
    ],
    [handlers],
  );
  const expandable = useMemo<AppGridExpandable<Row>>(
    () => ({
      label: (p) => C.verPagos(p.nombre),
      render: (p) => (
        <ParticipantePagos
          pagos={p.pagos}
          onEliminarPago={(pago) => void handlers.actions.eliminarPago(pago)}
        />
      ),
    }),
    [handlers],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={participantes}
      ariaLabel={C.TABLE_LABEL}
      getRowId={(p) => p.id}
      mobileRow={(p) => <MobileRow participante={p} handlers={handlers} />}
      expandable={expandable}
      initialSorting={[]}
    />
  );
}
