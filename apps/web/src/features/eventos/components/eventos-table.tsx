'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  AppDataGrid,
  RowActionsMenu,
  type AppColumnDef,
} from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EventoEstadoBadge } from '@/features/eventos/components/evento-estado-badge';
import { EventoTipoBadge } from '@/features/eventos/components/evento-tipo-badge';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';

const C = EVENTOS_COPY.list;
const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;
const ACTIONS_WIDTH = 88;

type Column = AppColumnDef<Evento>;

export interface EventosTableProps {
  readonly eventos: readonly Evento[];
  readonly onDelete: (evento: Evento) => void;
}

/** Venta: cantidad de productos · grupo: el tipo de actividad. */
function detalleOf(evento: Evento): string {
  if (evento.tipo === TIPO_EVENTO.VENTA)
    return C.productosCount(evento.productos?.length ?? 0);
  return evento.tipoEvento ?? '';
}

function NombreCell({ evento }: { readonly evento: Evento }) {
  return (
    <div className="flex min-w-0 flex-col">
      <Link
        href={EVENTOS_ROUTES.detail(evento.id)}
        className="truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-focus"
        onClick={(event) => event.stopPropagation()}
      >
        {evento.nombre}
      </Link>
      {evento.descripcion ? (
        <span className="max-w-80 truncate text-xs text-ink-subtle">
          {evento.descripcion}
        </span>
      ) : null}
    </div>
  );
}

function RowActions({
  evento,
  onDelete,
}: {
  readonly evento: Evento;
  readonly onDelete: (evento: Evento) => void;
}) {
  const router = useRouter();
  return (
    // La fila es clickeable: las acciones no deben propagar el click.
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <RowActionsMenu
        ariaLabel={C.acciones(evento.nombre)}
        actions={[
          {
            key: 'edit',
            label: C.editarAccion,
            icon: Pencil,
            onSelect: () => router.push(EVENTOS_ROUTES.edit(evento.id)),
          },
          {
            key: 'delete',
            label: C.eliminarAccion,
            icon: Trash2,
            destructive: true,
            onSelect: () => onDelete(evento),
          },
        ]}
      />
      <Link
        href={EVENTOS_ROUTES.detail(evento.id)}
        aria-label={C.abrir(evento.nombre)}
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
      id: 'nombre',
      header: C.colEvento,
      cell: ({ row }) => <NombreCell evento={row.original} />,
    },
    {
      id: 'tipo',
      header: C.colTipo,
      meta: NOWRAP,
      cell: ({ row }) => <EventoTipoBadge tipo={row.original.tipo} />,
    },
    {
      id: 'fecha',
      header: C.colFecha,
      meta: NOWRAP,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatDate(row.original.fecha, DATE_FORMATS.dayMonthYear)}
        </span>
      ),
    },
    {
      id: 'detalle',
      header: C.colDetalle,
      cell: ({ row }) => detalleOf(row.original),
    },
    {
      id: 'estado',
      header: C.colEstado,
      meta: NOWRAP,
      cell: ({ row }) => <EventoEstadoBadge evento={row.original} />,
    },
  ];
}

function MobileRow({ evento }: { readonly evento: Evento }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-ink">
          {evento.nombre}
        </span>
        <span className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
          <EventoTipoBadge tipo={evento.tipo} />
          <span className="tabular-nums">
            {formatDate(evento.fecha, DATE_FORMATS.dayMonthYear)}
          </span>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <EventoEstadoBadge evento={evento} />
        <NavChevron />
      </div>
    </div>
  );
}

/** Eventos en una tabla densa: nombre, tipo, fecha, detalle, estado y ⋯ + chevron al detalle. */
export function EventosTable({ eventos, onDelete }: EventosTableProps) {
  const router = useRouter();
  const columns = useMemo<readonly Column[]>(
    () => [
      ...dataColumns(),
      {
        id: 'actions',
        size: ACTIONS_WIDTH,
        header: () => <span className="sr-only">{C.colAcciones}</span>,
        cell: ({ row }) => (
          <RowActions evento={row.original} onDelete={onDelete} />
        ),
      },
    ],
    [onDelete],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={eventos}
      ariaLabel={C.gridAria}
      getRowId={(evento) => evento.id}
      onRowClick={(evento) => router.push(EVENTOS_ROUTES.detail(evento.id))}
      mobileRow={(evento) => <MobileRow evento={evento} />}
      initialSorting={[]}
    />
  );
}
