'use client';

import {
  DirectionTile,
  MONEY_CELL_CLASS,
  Money,
  type AppColumnDef,
} from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { formatDate } from '@/shared/time';
import { EstadoPagoBadge } from '@/shared/components/finanzas';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MONEY_DECIMALS } from '@/features/movimientos/constants/movimientos';
import {
  cajaText,
  comprobanteText,
  conceptoLabel,
  descripcionText,
  toCardData,
  isIngreso,
  medioPagoLabel,
  responsableText,
  tipoLabel,
} from '@/features/movimientos/helpers/view-model';
import { MovimientoRowActions } from '@/features/movimientos/components/movimiento-row-actions';

type Column = AppColumnDef<Movimiento>;

const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;

const fechaColumn: Column = {
  id: 'fecha',
  header: C.COL_FECHA,
  meta: NOWRAP,
  cell: ({ row }) => (
    <span className="tabular-nums">{formatDate(row.original.fecha)}</span>
  ),
};

const tipoColumn: Column = {
  id: 'tipo',
  header: C.COL_TIPO,
  cell: ({ row }) => tipoLabel(row.original),
};

const conceptoColumn: Column = {
  id: 'concepto',
  header: C.COL_CONCEPTO,
  cell: ({ row }) => (
    <span className="flex items-center gap-2.5">
      <DirectionTile
        direction={isIngreso(row.original) ? 'in' : 'out'}
        decorative
      />
      <span className="font-medium text-ink">
        {conceptoLabel(row.original)}
      </span>
    </span>
  ),
};

const montoColumn: Column = {
  id: 'monto',
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
  header: C.COL_ESTADO,
  meta: NOWRAP,
  cell: ({ row }) => <EstadoPagoBadge movimiento={toCardData(row.original)} />,
};

interface TextColumnSpec {
  readonly id: string;
  readonly header: string;
  readonly text: (m: Movimiento) => string;
}

const textColumn = ({ id, header, text }: TextColumnSpec): Column => ({
  id,
  header,
  cell: ({ row }) => text(row.original),
});

/** Columnas (paridad): Tipo solo en el tab "Todos". */
export function movimientoColumns(params: {
  readonly showTipo: boolean;
  readonly onDelete: (id: string) => void;
}): readonly Column[] {
  const actions: Column = {
    id: 'actions',
    header: C.COL_ACCIONES,
    cell: ({ row }) => (
      <MovimientoRowActions id={row.original.id} onDelete={params.onDelete} />
    ),
  };
  return [
    fechaColumn,
    ...(params.showTipo ? [tipoColumn] : []),
    conceptoColumn,
    textColumn({ id: 'descripcion', header: C.COL_DESCRIPCION, text: descripcionText }),
    montoColumn,
    textColumn({ id: 'medioPago', header: C.COL_MEDIO, text: medioPagoLabel }),
    estadoColumn,
    textColumn({ id: 'caja', header: C.COL_CAJA, text: cajaText }),
    textColumn({ id: 'responsable', header: C.COL_RESPONSABLE, text: responsableText }),
    textColumn({ id: 'comprobante', header: C.COL_COMPROBANTE, text: comprobanteText }),
    actions,
  ];
}
