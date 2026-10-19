import type { FilterField } from '@/shared/components/data';
import { RAMAS, RAMA_LABELS } from '@/shared/domain';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import {
  PARTICIPANTES_FILTER_KEYS,
  RAMA_FILTER_EDUCADORES,
} from '@/features/campamentos/helpers/detalle-query';

/** Filtros de participantes (paridad con `ParticipantesFiltrosComponent`). */
export const PARTICIPANTES_FILTER_FIELDS: readonly FilterField[] = [
  {
    key: PARTICIPANTES_FILTER_KEYS.NOMBRE,
    type: 'search',
    label: C.FILTER_NOMBRE,
    placeholder: C.FILTER_NOMBRE_PLACEHOLDER,
  },
  {
    key: PARTICIPANTES_FILTER_KEYS.RAMA,
    type: 'select',
    label: C.FILTER_RAMA,
    options: [
      { value: RAMA_FILTER_EDUCADORES, label: C.RAMA_EDUCADORES },
      ...RAMAS.map((rama) => ({ value: rama, label: RAMA_LABELS[rama] })),
    ],
  },
];
