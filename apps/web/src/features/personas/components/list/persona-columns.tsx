import { StatusBadge, type AppColumnDef } from '@/shared/components/data';
import { ESTADO_PERSONA_LABELS } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import {
  docValue,
  type DocKey,
  type ListedPersona,
} from '@/features/personas/helpers/list';
import type { PersonaRowActions as Actions } from '@/features/personas/hooks/use-persona-row-actions';
import { DocCheck } from '@/features/personas/components/list/doc-check';
import { PersonaNameLink } from '@/features/personas/components/list/persona-name-link';
import { PersonaRowActions } from '@/features/personas/components/list/persona-row-actions';

const DOC_HEADERS: Readonly<Record<DocKey, string>> = {
  partidaNacimiento: C.COL_PARTIDA,
  dni: C.COL_DNI,
  dniPadres: C.COL_DNI_PADRES,
  carnetObraSocial: C.COL_OBRA_SOCIAL,
};

const CENTER = {
  headerClassName: 'text-center',
  cellClassName: 'text-center',
} as const;

const WIDTHS = { doc: 120, estado: 140, acciones: 96 } as const;

type Column = AppColumnDef<ListedPersona>;

function docColumn(key: DocKey): Column {
  return {
    id: key,
    header: DOC_HEADERS[key],
    size: WIDTHS.doc,
    meta: CENTER,
    cell: ({ row }) => {
      const delivered = docValue({ persona: row.original, key });
      return (
        <DocCheck
          delivered={delivered}
          label={delivered ? C.DOC_DELIVERED : C.DOC_PENDING}
        />
      );
    },
  };
}

export interface PersonaColumnsParams {
  readonly docKeys: readonly DocKey[];
  readonly showDisabled: boolean;
  readonly actions: Actions;
}

/** Columnas de Angular: nombre (+ rama/cargo/contacto) · estado (solo con toggle) · docs según tab · ⋯ y chevron. */
export function buildPersonaColumns({
  docKeys,
  showDisabled,
  actions,
}: PersonaColumnsParams): Column[] {
  const nombre: Column = {
    accessorKey: 'nombre',
    header: C.COL_NOMBRE,
    cell: ({ row }) => <PersonaNameLink persona={row.original} />,
  };
  const estado: Column[] = showDisabled
    ? [
        {
          id: 'estado',
          header: C.COL_ESTADO,
          size: WIDTHS.estado,
          cell: ({ row }) => (
            <StatusBadge status={ESTADO_PERSONA_LABELS[row.original.estado]} />
          ),
        },
      ]
    : [];
  const acciones: Column = {
    id: 'acciones',
    header: () => <span className="sr-only">{C.COL_ACCIONES}</span>,
    size: WIDTHS.acciones,
    meta: { cellClassName: 'text-right' },
    cell: ({ row }) => (
      <PersonaRowActions persona={row.original} actions={actions} />
    ),
  };
  return [nombre, ...estado, ...docKeys.map(docColumn), acciones];
}
