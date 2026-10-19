'use client';

import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import {
  AppDataGrid,
  DirectionTile,
  MONEY_CELL_CLASS,
  Money,
  RowActionsMenu,
  type AppColumnDef,
} from '@/shared/components/data';
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  ESTADO_PAGO,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  type ConceptoMovimiento,
} from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';

import { FINANZAS_COPY } from './copy';
import { EstadoPagoBadge } from './estado-pago-badge';
import type { MovimientoCardData } from './types';

const C = FINANZAS_COPY.table;
const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;
const ACTIONS_WIDTH = 48;

type Row = MovimientoCardData;
type Column = AppColumnDef<Row>;

export interface MovimientosTableProps {
  readonly movimientos: readonly MovimientoCardData[];
  readonly ariaLabel: string;
  /** Muestra el ⋯ con "Eliminar". */
  readonly deletable?: boolean;
  readonly onDelete?: (movimiento: MovimientoCardData) => void;
  /** Si se pasa, el badge "Pendiente de Reembolso" es un botón. */
  readonly onPagarReembolso?: (movimiento: MovimientoCardData) => void;
}

const isIngreso = (m: Row): boolean => m.tipo === TIPO_MOVIMIENTO.INGRESO;

function titleOf(m: Row): string {
  const label = m.concepto
    ? CONCEPTO_MOVIMIENTO_LABELS[m.concepto as ConceptoMovimiento]
    : undefined;
  return label ?? m.descripcion ?? FINANZAS_COPY.card.sinDescripcion;
}

/** Tile de dirección + concepto y la descripción como sub-línea. */
function ConceptoCell({ movimiento }: { readonly movimiento: Row }) {
  const hasConcepto = Boolean(
    movimiento.concepto &&
    CONCEPTO_MOVIMIENTO_LABELS[movimiento.concepto as ConceptoMovimiento],
  );
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <DirectionTile direction={isIngreso(movimiento) ? 'in' : 'out'} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink">
          {titleOf(movimiento)}
        </span>
        {hasConcepto && movimiento.descripcion ? (
          <span className="block max-w-72 truncate text-xs text-ink-subtle">
            {movimiento.descripcion}
          </span>
        ) : null}
      </span>
    </span>
  );
}

const fechaColumn: Column = {
  id: 'fecha',
  header: C.colFecha,
  meta: NOWRAP,
  cell: ({ row }) => (
    <span className="tabular-nums" title={formatDate(row.original.fecha)}>
      {formatDate(row.original.fecha, DATE_FORMATS.dayMonthPadded)}
    </span>
  ),
};

const montoColumn: Column = {
  id: 'monto',
  header: C.colMonto,
  meta: {
    cellClassName: MONEY_CELL_CLASS,
    headerClassName: MONEY_CELL_CLASS,
  },
  cell: ({ row }) => (
    <Money
      amount={row.original.monto}
      sign={isIngreso(row.original) ? 'in' : 'out'}
    />
  ),
};

function dataColumns(
  onPagarReembolso: MovimientosTableProps['onPagarReembolso'],
): readonly Column[] {
  return [
    fechaColumn,
    {
      id: 'concepto',
      header: C.colConcepto,
      cell: ({ row }) => <ConceptoCell movimiento={row.original} />,
    },
    {
      id: 'responsable',
      header: C.colResponsable,
      cell: ({ row }) => row.original.responsableNombre,
    },
    {
      id: 'medio',
      header: C.colMedio,
      cell: ({ row }) =>
        MEDIO_PAGO_LABELS[row.original.medioPago] ?? row.original.medioPago,
    },
    {
      id: 'estado',
      header: C.colEstado,
      meta: NOWRAP,
      cell: ({ row }) => (
        <EstadoPagoBadge
          movimiento={row.original}
          onPagarReembolso={onPagarReembolso}
        />
      ),
    },
    montoColumn,
  ];
}

function DeleteMenu({
  movimiento,
  onDelete,
}: {
  readonly movimiento: Row;
  readonly onDelete: MovimientosTableProps['onDelete'];
}) {
  return (
    <RowActionsMenu
      ariaLabel={C.acciones(titleOf(movimiento))}
      actions={[
        {
          key: 'delete',
          label: C.eliminar,
          icon: Trash2,
          destructive: true,
          onSelect: () => onDelete?.(movimiento),
        },
      ]}
    />
  );
}

function actionsColumn(onDelete: MovimientosTableProps['onDelete']): Column {
  return {
    id: 'actions',
    size: ACTIONS_WIDTH,
    header: () => <span className="sr-only">{C.colAcciones}</span>,
    cell: ({ row }) => (
      <DeleteMenu movimiento={row.original} onDelete={onDelete} />
    ),
  };
}

function buildColumns(
  params: Omit<MovimientosTableProps, 'movimientos' | 'ariaLabel'>,
): readonly Column[] {
  const base = dataColumns(params.onPagarReembolso);
  return params.deletable ? [...base, actionsColumn(params.onDelete)] : base;
}

type MobileRowProps = { readonly movimiento: Row } & Pick<
  MovimientosTableProps,
  'deletable' | 'onDelete' | 'onPagarReembolso'
>;

/** Mobile: el estado solo si no es el normal (conserva "Pagar" reembolso) y el ⋯ si se puede borrar. */
function MobileRow({ movimiento, ...actions }: MobileRowProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <ConceptoCell movimiento={movimiento} />
        {movimiento.estadoPago !== ESTADO_PAGO.PAGADO && (
          <EstadoPagoBadge
            movimiento={movimiento}
            onPagarReembolso={actions.onPagarReembolso}
          />
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <div className="flex flex-col items-end gap-1">
          <Money
            amount={movimiento.monto}
            sign={isIngreso(movimiento) ? 'in' : 'out'}
            className="text-sm"
          />
          <span className="text-xs text-ink-subtle">
            {formatDate(movimiento.fecha, DATE_FORMATS.dayMonthPadded)}
          </span>
        </div>
        {actions.deletable && (
          <DeleteMenu movimiento={movimiento} onDelete={actions.onDelete} />
        )}
      </div>
    </div>
  );
}

/**
 * Tabla densa de movimientos de campamentos y eventos (mismo lenguaje que la lista de
 * Movimientos): concepto con tile, estado, monto y ⋯ para eliminar.
 */
export function MovimientosTable({
  movimientos,
  ariaLabel,
  deletable = false,
  onDelete,
  onPagarReembolso,
}: MovimientosTableProps) {
  const columns = useMemo(
    () => buildColumns({ deletable, onDelete, onPagarReembolso }),
    [deletable, onDelete, onPagarReembolso],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={movimientos}
      ariaLabel={ariaLabel}
      getRowId={(row) => row.id}
      mobileRow={(row) => (
        <MobileRow
          movimiento={row}
          deletable={deletable}
          onDelete={onDelete}
          onPagarReembolso={onPagarReembolso}
        />
      )}
    />
  );
}
