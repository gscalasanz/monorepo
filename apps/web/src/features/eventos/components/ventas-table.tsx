'use client';

import { Clock, Trash2, Wallet } from 'lucide-react';
import { useMemo } from 'react';

import {
  AppDataGrid,
  MONEY_CELL_CLASS,
  Money,
  RowActionsMenu,
  StatusBadge,
  type AppColumnDef,
} from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import type { VentaGroup } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.ventas;
const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;
const MONEY_META = {
  cellClassName: MONEY_CELL_CLASS,
  headerClassName: MONEY_CELL_CLASS,
} as const;
const ACTIONS_WIDTH = 48;

type Column = AppColumnDef<VentaGroup>;

export interface VentasTableProps {
  readonly groups: readonly VentaGroup[];
  readonly readonly: boolean;
  readonly cobrandoId: string | null;
  readonly onDelete: (group: VentaGroup) => void;
  readonly onCobrar: (group: VentaGroup) => void;
}

function Detalle({ group }: { readonly group: VentaGroup }) {
  return (
    <ul className="flex flex-col gap-0.5 text-ink-muted">
      {group.items.map((item) => (
        <li key={item.ventaId}>
          {C.item({ nombre: item.productoNombre, cantidad: item.cantidad })}
        </li>
      ))}
    </ul>
  );
}

function CobroCell(props: VentasTableProps & { readonly group: VentaGroup }) {
  const { group, readonly, cobrandoId, onCobrar } = props;
  if (!group.aCobrar) return null;
  return (
    <span className="flex items-center gap-2">
      <StatusBadge label={C.aCobrar} tone="warning" icon={Clock} />
      {!readonly && (
        <Button
          size="sm"
          variant="secondary"
          loading={cobrandoId === group.primaryVentaId}
          icon={<Wallet aria-hidden />}
          onClick={() => onCobrar(group)}
        >
          {C.registrarCobro}
        </Button>
      )}
    </span>
  );
}

function dataColumns(props: VentasTableProps): readonly Column[] {
  return [
    {
      id: 'fecha',
      header: C.colFecha,
      meta: NOWRAP,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatDate(row.original.fecha, DATE_FORMATS.dayMonthPadded)}
        </span>
      ),
    },
    {
      id: 'vendedor',
      header: C.colVendedor,
      cell: ({ row }) => (
        <span className="font-medium text-ink">
          {row.original.vendedorNombre}
        </span>
      ),
    },
    {
      id: 'detalle',
      header: C.colDetalle,
      cell: ({ row }) => <Detalle group={row.original} />,
    },
    {
      id: 'unidades',
      header: C.colUnidades,
      meta: MONEY_META,
      cell: ({ row }) => C.unidades(row.original.totalUnidades),
    },
    {
      id: 'ganancia',
      header: C.colGanancia,
      meta: MONEY_META,
      cell: ({ row }) => <Money amount={row.original.gananciaTotal} />,
    },
    {
      id: 'cobro',
      header: C.colEstado,
      cell: ({ row }) => <CobroCell {...props} group={row.original} />,
    },
  ];
}

function actionsColumn(onDelete: (group: VentaGroup) => void): Column {
  return {
    id: 'actions',
    size: ACTIONS_WIDTH,
    header: () => <span className="sr-only">{C.colAcciones}</span>,
    cell: ({ row }) => (
      <RowActionsMenu
        ariaLabel={C.acciones(row.original.vendedorNombre)}
        actions={[
          {
            key: 'delete',
            label: C.eliminar,
            icon: Trash2,
            destructive: true,
            onSelect: () => onDelete(row.original),
          },
        ]}
      />
    ),
  };
}

function MobileRow(props: VentasTableProps & { readonly group: VentaGroup }) {
  const { group } = props;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-ink">
          {group.vendedorNombre}
        </span>
        <Money amount={group.gananciaTotal} className="shrink-0 text-sm" />
      </span>
      <Detalle group={group} />
      <CobroCell {...props} />
    </div>
  );
}

/** Ventas del evento agrupadas por lote; el cobro pendiente se registra desde la fila. */
export function VentasTable(props: VentasTableProps) {
  const { groups, readonly, cobrandoId, onDelete, onCobrar } = props;
  const columns = useMemo(
    () => [
      ...dataColumns({ groups, readonly, cobrandoId, onDelete, onCobrar }),
      ...(readonly ? [] : [actionsColumn(onDelete)]),
    ],
    [groups, readonly, cobrandoId, onDelete, onCobrar],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={groups}
      ariaLabel={C.registradas}
      getRowId={(group) => group.key}
      mobileRow={(group) => <MobileRow {...props} group={group} />}
    />
  );
}
