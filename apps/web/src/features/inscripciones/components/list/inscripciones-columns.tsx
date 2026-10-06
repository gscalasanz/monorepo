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
import { formatDate } from '@/shared/time';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import type { AutorizacionKey } from '@/features/inscripciones/constants/inscripciones';
import { personaNombre } from '@/features/inscripciones/helpers/list';
import { BoolCell } from '@/features/inscripciones/components/list/bool-cell';
import { RowActions } from '@/features/inscripciones/components/list/row-actions';

type Column = AppColumnDef<Inscripcion>;

const DOCUMENT_COLUMNS: readonly {
  readonly key: AutorizacionKey;
  readonly header: string;
}[] = [
  { key: 'declaracionDeSalud', header: C.COL_SALUD },
  { key: 'autorizacionDeImagen', header: C.COL_IMAGEN },
  { key: 'salidasCercanas', header: C.COL_SALIDAS },
  { key: 'autorizacionIngreso', header: C.COL_INGRESO },
  { key: 'certificadoAptitudFisica', header: C.COL_APTITUD },
];

const moneyColumn = (params: {
  readonly id: 'montoPagado' | 'saldoPendiente';
  readonly header: string;
}): Column => ({
  id: params.id,
  header: params.header,
  cell: ({ row }) => <Money amount={row.original[params.id]} />,
  meta: { cellClassName: MONEY_CELL_CLASS, headerClassName: MONEY_CELL_CLASS },
});

const BASE_COLUMNS: readonly Column[] = [
  { id: 'persona', header: C.COL_PERSONA, accessorFn: personaNombre },
  moneyColumn({ id: 'montoPagado', header: C.COL_PAGADO }),
  moneyColumn({ id: 'saldoPendiente', header: C.COL_PENDIENTE }),
  {
    id: 'estado',
    header: C.COL_ESTADO,
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.estado}
        label={ESTADO_INSCRIPCION_LABELS[row.original.estado]}
      />
    ),
  },
];

const documentColumns: readonly Column[] = DOCUMENT_COLUMNS.map(
  ({ key, header }) => ({
    id: key,
    header,
    cell: ({ row }) => <BoolCell value={row.original[key]} />,
  }),
);

const fechaColumn: Column = {
  id: 'fechaInscripcion',
  header: C.COL_FECHA,
  cell: ({ row }) => formatDate(row.original.createdAt),
};

/** Columnas de Angular: base + (SA: 5 documentos) + Acciones + Fecha de inscripción. */
export function buildColumns(params: {
  readonly tipo: TipoInscripcion;
  readonly onDelete: (id: string) => void;
}): readonly Column[] {
  const actions: Column = {
    id: 'actions',
    header: C.COL_ACCIONES,
    cell: ({ row }) => (
      <RowActions
        id={row.original.id}
        persona={personaNombre(row.original)}
        onDelete={params.onDelete}
      />
    ),
  };
  const docs =
    params.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? documentColumns : [];
  return [...BASE_COLUMNS, ...docs, actions, fechaColumn];
}
