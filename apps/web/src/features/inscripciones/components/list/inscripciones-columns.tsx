import {
  MONEY_CELL_CLASS,
  Money,
  StatusBadge,
  type AppColumnDef,
} from '@/shared/components/data';
import {
  ESTADO_INSCRIPCION_LABELS,
  TIPO_INSCRIPCION,
  type Inscripcion,
  type TipoInscripcion,
} from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { personaNombre } from '@/features/inscripciones/helpers/list';
import { PapelesCell } from '@/features/inscripciones/components/list/papeles-cell';
import { PersonaCell } from '@/features/inscripciones/components/list/persona-cell';
import { RowActions } from '@/features/inscripciones/components/list/row-actions';

type Column = AppColumnDef<Inscripcion>;

const NOWRAP = { cellClassName: 'whitespace-nowrap' } as const;

const moneyColumn = (params: {
  readonly id: 'montoPagado' | 'saldoPendiente';
  readonly header: string;
}): Column => ({
  id: params.id,
  header: params.header,
  cell: ({ row }) => (
    <Money
      amount={row.original[params.id]}
      tone={
        params.id === 'saldoPendiente' && row.original.saldoPendiente > 0
          ? 'debt'
          : undefined
      }
    />
  ),
  meta: { cellClassName: MONEY_CELL_CLASS, headerClassName: MONEY_CELL_CLASS },
});

const personaColumn: Column = {
  id: 'persona',
  header: C.COL_PERSONA,
  accessorFn: personaNombre,
  cell: ({ row }) => <PersonaCell inscripcion={row.original} />,
};

const estadoColumn: Column = {
  id: 'estado',
  header: C.COL_ESTADO,
  meta: NOWRAP,
  cell: ({ row }) => (
    <StatusBadge
      status={row.original.estado}
      label={ESTADO_INSCRIPCION_LABELS[row.original.estado]}
    />
  ),
};

const papelesColumn: Column = {
  id: 'papeles',
  header: C.COL_PAPELES,
  meta: NOWRAP,
  cell: ({ row }) => <PapelesCell autorizaciones={row.original} />,
};

const fechaColumn: Column = {
  id: 'fechaInscripcion',
  header: C.COL_FECHA,
  meta: NOWRAP,
  cell: ({ row }) => (
    <span className="tabular-nums" title={formatDate(row.original.createdAt)}>
      {formatDate(row.original.createdAt, DATE_FORMATS.dayMonthPadded)}
    </span>
  ),
};

/** Persona, importes, estado, (SA: Papeles con contador), fecha y ⋯ + chevron. */
export function buildColumns(params: {
  readonly tipo: TipoInscripcion;
  readonly onDelete: (id: string) => void;
}): readonly Column[] {
  const actions: Column = {
    id: 'actions',
    header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
    size: 88,
    cell: ({ row }) => (
      <RowActions
        id={row.original.id}
        persona={personaNombre(row.original)}
        onDelete={params.onDelete}
      />
    ),
  };
  const papeles =
    params.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? [papelesColumn] : [];
  return [
    personaColumn,
    moneyColumn({ id: 'montoPagado', header: C.COL_PAGADO }),
    moneyColumn({ id: 'saldoPendiente', header: C.COL_PENDIENTE }),
    estadoColumn,
    ...papeles,
    fechaColumn,
    actions,
  ];
}
