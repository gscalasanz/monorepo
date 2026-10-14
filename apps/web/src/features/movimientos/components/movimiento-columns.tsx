'use client';

import {
  MONEY_CELL_CLASS,
  Money,
  type AppColumnDef,
} from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EstadoPagoBadge } from '@/shared/components/finanzas';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { COLUMN_SIZE, MONEY_DECIMALS } from '@/features/movimientos/constants/movimientos';
import {
  cajaText,
  conceptoLabel,
  toCardData,
  isIngreso,
  medioPagoLabel,
  responsableText,
} from '@/features/movimientos/helpers/view-model';
import { ConceptoCell } from '@/features/movimientos/components/concepto-cell';
import { MovimientoRowActions } from '@/features/movimientos/components/movimiento-row-actions';

type Column = AppColumnDef<Movimiento>;

const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;

const fechaColumn: Column = {
  id: 'fecha',
  size: COLUMN_SIZE.fecha,
  header: C.COL_FECHA,
  meta: NOWRAP,
  cell: ({ row }) => (
    <span
      className="tabular-nums"
      title={formatDate(row.original.fecha)}
    >
      {formatDate(row.original.fecha, DATE_FORMATS.dayMonthPadded)}
    </span>
  ),
};

const conceptoColumn: Column = {
  id: 'concepto',
  header: C.COL_CONCEPTO,
  size: COLUMN_SIZE.concepto,
  cell: ({ row }) => <ConceptoCell movimiento={row.original} />,
};

const montoColumn: Column = {
  id: 'monto',
  size: COLUMN_SIZE.monto,
  header: C.COL_MONTO,
  meta: { cellClassName: MONEY_CELL_CLASS, headerClassName: MONEY_CELL_CLASS },
  cell: ({ row }) => (
    <Money
      amount={row.original.monto}
      sign={isIngreso(row.original) ? 'in' : 'out'}
      decimals={MONEY_DECIMALS}
    />
  ),
};

const estadoColumn: Column = {
  id: 'estadoPago',
  size: COLUMN_SIZE.estado,
  header: C.COL_ESTADO,
  meta: NOWRAP,
  cell: ({ row }) => <EstadoPagoBadge movimiento={toCardData(row.original)} />,
};

interface TextColumnSpec {
  readonly id: string;
  readonly size: number;
  readonly header: string;
  readonly text: (m: Movimiento) => string;
}

const textColumn = ({ id, size, header, text }: TextColumnSpec): Column => ({
  id,
  size,
  header,
  cell: ({ row }) => text(row.original),
});

/** Columnas del mockup Insignia: Tipo y Descripción viven dentro del Concepto. */
export function movimientoColumns(params: {
  readonly onDelete: (id: string) => void;
}): readonly Column[] {
  const actions: Column = {
    id: 'actions',
    header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
    size: COLUMN_SIZE.acciones,
    cell: ({ row }) => (
      <MovimientoRowActions
        id={row.original.id}
        label={conceptoLabel(row.original)}
        onDelete={params.onDelete}
      />
    ),
  };
  return [
    fechaColumn,
    conceptoColumn,
    textColumn({ id: 'caja', size: COLUMN_SIZE.caja, header: C.COL_CAJA, text: cajaText }),
    textColumn({ id: 'medioPago', size: COLUMN_SIZE.medio, header: C.COL_MEDIO, text: medioPagoLabel }),
    estadoColumn,
    textColumn({ id: 'responsable', size: COLUMN_SIZE.responsable, header: C.COL_RESPONSABLE, text: responsableText }),
    montoColumn,
    actions,
  ];
}
