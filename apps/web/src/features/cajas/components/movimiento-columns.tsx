'use client';

import {
  MONEY_CELL_CLASS,
  Money,
  sortableHeader,
  type AppColumnDef,
} from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { MovimientoActions } from '@/features/cajas/components/movimiento-actions';
import { TipoMovimientoLabel } from '@/features/cajas/components/tipo-movimiento-label';
import {
  conceptoLabel,
  isIngreso,
  movimientoCajaLabel,
} from '@/features/cajas/helpers/movimientos';

type Col = AppColumnDef<Movimiento>;

const fecha: Col = {
  id: 'fecha',
  accessorFn: (row) => row.fecha,
  header: sortableHeader(C.COL_FECHA),
  cell: ({ row }) => formatDate(row.original.fecha, DATE_FORMATS.date),
};

const concepto: Col = {
  id: 'concepto',
  accessorFn: (row) => conceptoLabel(row),
  header: sortableHeader(C.COL_CONCEPTO),
};

const tipo: Col = {
  id: 'tipo',
  header: C.COL_TIPO,
  cell: ({ row }) => <TipoMovimientoLabel tipo={row.original.tipo} />,
};

const monto: Col = {
  id: 'monto',
  accessorFn: (row) => row.monto,
  header: sortableHeader(C.COL_MONTO),
  cell: ({ row }) => (
    <Money
      amount={row.original.monto}
      sign={isIngreso(row.original) ? 'in' : 'out'}
    />
  ),
  meta: { headerClassName: MONEY_CELL_CLASS, cellClassName: MONEY_CELL_CLASS },
};

const descripcion: Col = {
  id: 'descripcion',
  header: C.COL_DESCRIPCION,
  cell: ({ row }) => row.original.descripcion ?? C.EMPTY_CELL,
};

const caja: Col = {
  id: 'caja',
  header: C.COL_CAJA,
  cell: ({ row }) => movimientoCajaLabel(row.original),
};

const responsable: Col = {
  id: 'responsable',
  header: C.COL_RESPONSABLE,
  cell: ({ row }) => row.original.responsable?.nombre ?? C.EMPTY_CELL,
};

function actions(withEdit: boolean): Col {
  return {
    id: 'acciones',
    header: C.COL_ACCIONES,
    cell: ({ row }) => (
      <MovimientoActions movimiento={row.original} withEdit={withEdit} />
    ),
  };
}

/** "Últimos Movimientos" de la caja de grupo: Fecha, Concepto, Tipo, Monto, Ver. */
export const ULTIMOS_COLUMNS: readonly Col[] = [
  fecha,
  concepto,
  tipo,
  monto,
  actions(false),
];

/** "Movimientos de Ramas": Fecha, Tipo, Concepto, Descripcion, Monto, Caja, Responsable, Ver/Editar. */
export const RAMAS_COLUMNS: readonly Col[] = [
  fecha,
  tipo,
  concepto,
  descripcion,
  monto,
  caja,
  responsable,
  actions(true),
];
