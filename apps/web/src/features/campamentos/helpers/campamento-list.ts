/** Filtros de la lista de campamentos (en el cliente: la API devuelve todos). */
import type { FilterField, FilterValues } from '@/shared/components/data';
import type { LocalDate } from '@/shared/time';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import {
  CAMP_STATUS,
  campStatus,
  type CampDates,
  type CampStatus,
} from '@/features/campamentos/helpers/camp-status';

export const CAMPAMENTO_FILTER_KEYS = {
  BUSQUEDA: 'busqueda',
  ESTADO: 'estado',
} as const;

const ESTADO_LABELS: Readonly<Record<CampStatus, string>> = {
  [CAMP_STATUS.UPCOMING]: C.STAT_UPCOMING,
  [CAMP_STATUS.ACTIVE]: C.STAT_ACTIVE,
  [CAMP_STATUS.PAST]: C.STAT_PAST,
};

/** "Buscar" (nombre o descripción) + "Estado" (Próximos / En curso / Finalizados). */
export const CAMPAMENTO_FILTER_FIELDS: readonly FilterField[] = [
  {
    key: CAMPAMENTO_FILTER_KEYS.BUSQUEDA,
    type: 'search',
    label: C.SEARCH_LABEL,
    placeholder: C.SEARCH_PLACEHOLDER,
  },
  {
    key: CAMPAMENTO_FILTER_KEYS.ESTADO,
    type: 'chips',
    label: C.ESTADO_LABEL,
    options: Object.values(CAMP_STATUS).map((value) => ({
      value,
      label: ESTADO_LABELS[value],
    })),
  },
];

interface Filterable extends CampDates {
  readonly nombre: string;
  readonly descripcion: string | null;
}

function textOf(values: FilterValues, key: string): string {
  const value = values[key];
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function matchesSearch(camp: Filterable, busqueda: string): boolean {
  if (!busqueda) return true;
  return [camp.nombre, camp.descripcion ?? ''].some((text) =>
    text.toLowerCase().includes(busqueda),
  );
}

export function filterCampamentos<T extends Filterable>(params: {
  readonly camps: readonly T[];
  readonly values: FilterValues;
  readonly today: LocalDate;
}): T[] {
  const busqueda = textOf(params.values, CAMPAMENTO_FILTER_KEYS.BUSQUEDA);
  const estado = textOf(params.values, CAMPAMENTO_FILTER_KEYS.ESTADO);
  return params.camps.filter(
    (camp) =>
      matchesSearch(camp, busqueda) &&
      (!estado || campStatus(camp, params.today) === estado),
  );
}
