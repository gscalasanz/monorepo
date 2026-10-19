/** Filtros de la lista/dashboard ↔ URL ↔ query del backend (sin estado). */
import type {
  FilterField,
  FilterOption,
  FilterValues,
} from '@/shared/components/data';
import {
  tipoDeudaSchema,
  tipoInscripcionSchema,
  type InscripcionesQuery,
  type TipoDeuda,
  type TipoInscripcion,
} from '@/shared/domain';
import { FILTER_COPY } from '@/features/inscripciones/constants/copy';
import {
  DEFAULT_TIPO,
  RAMA_FILTER_OPTIONS,
  TIPO_DEUDA_OPTIONS,
  URL_PARAMS,
  YEAR_SPAN,
} from '@/features/inscripciones/constants/inscripciones';

/** Valor del filtro "Año" para "Todos los años" (sin `ano` en la query). */
export const ALL_YEARS = 'todos';

export type RamaFilter = NonNullable<InscripcionesQuery['rama']>;

export interface InscripcionFilters {
  readonly tipo: TipoInscripcion;
  /** `null` = todos los años. */
  readonly ano: number | null;
  readonly tipoDeuda: TipoDeuda | null;
  readonly rama: RamaFilter | null;
}

interface ParamReader {
  get(name: string): string | null;
}

const FILTER_KEYS = {
  SEARCH: 'search',
  ANO: 'ano',
  TIPO_DEUDA: 'tipoDeuda',
  RAMA: 'rama',
} as const;

function parseRama(value: string | null): RamaFilter | null {
  const option = RAMA_FILTER_OPTIONS.find(
    (candidate) => candidate.value === value,
  );
  return option ? option.value : null;
}

function parseAno(value: string | null, currentYear: number): number | null {
  if (value === ALL_YEARS) return null;
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : currentYear;
}

/** Filtros iniciales desde la URL (inválidos → default; año default = actual). */
export function parseFilters(
  params: ParamReader,
  currentYear: number,
): InscripcionFilters {
  const tipo = tipoInscripcionSchema.safeParse(params.get(URL_PARAMS.TIPO));
  const tipoDeuda = tipoDeudaSchema.safeParse(
    params.get(URL_PARAMS.TIPO_DEUDA),
  );
  return {
    tipo: tipo.success ? tipo.data : DEFAULT_TIPO,
    ano: parseAno(params.get(URL_PARAMS.ANO), currentYear),
    tipoDeuda: tipoDeuda.success ? tipoDeuda.data : null,
    rama: parseRama(params.get(URL_PARAMS.RAMA)),
  };
}

/** Query string con los filtros (omite el año si es el actual). */
export function filtersToSearch(
  filters: InscripcionFilters,
  currentYear: number,
): string {
  const entries: [string, string][] = [[URL_PARAMS.TIPO, filters.tipo]];
  if (filters.ano === null) entries.push([URL_PARAMS.ANO, ALL_YEARS]);
  else if (filters.ano !== currentYear)
    entries.push([URL_PARAMS.ANO, String(filters.ano)]);
  if (filters.tipoDeuda)
    entries.push([URL_PARAMS.TIPO_DEUDA, filters.tipoDeuda]);
  if (filters.rama) entries.push([URL_PARAMS.RAMA, filters.rama]);
  return new URLSearchParams(entries).toString();
}

/** Query del dashboard desde la lista: solo `tipoDeuda` y `rama` (Angular). */
export function dashboardSearch(filters: InscripcionFilters): string {
  const entries: [string, string][] = [];
  if (filters.tipoDeuda)
    entries.push([URL_PARAMS.TIPO_DEUDA, filters.tipoDeuda]);
  if (filters.rama) entries.push([URL_PARAMS.RAMA, filters.rama]);
  return new URLSearchParams(entries).toString();
}

export function filtersToQuery(
  filters: InscripcionFilters,
): InscripcionesQuery {
  return {
    tipo: filters.tipo,
    ano: filters.ano ?? undefined,
    tipoDeuda: filters.tipoDeuda ?? undefined,
    rama: filters.rama ?? undefined,
  };
}

/** Clave estable de la consulta (para `useAsyncData`). */
export function filtersKey(filters: InscripcionFilters): string {
  return [
    filters.tipo,
    filters.ano ?? ALL_YEARS,
    filters.tipoDeuda ?? '',
    filters.rama ?? '',
  ].join('|');
}

export function toFilterValues(
  filters: InscripcionFilters,
  search = '',
): FilterValues {
  return {
    [FILTER_KEYS.SEARCH]: search || undefined,
    [FILTER_KEYS.ANO]: filters.ano === null ? ALL_YEARS : String(filters.ano),
    [FILTER_KEYS.TIPO_DEUDA]: filters.tipoDeuda ?? undefined,
    [FILTER_KEYS.RAMA]: filters.rama ?? undefined,
  };
}

function read(values: FilterValues, key: string): string | null {
  const value = values[key];
  return typeof value === 'string' && value !== '' ? value : null;
}

/** Valores de la `FilterBar` → filtros (el tipo lo maneja el tab). "Limpiar" vuelve al año actual. */
export function fromFilterValues(
  values: FilterValues,
  context: { readonly tipo: TipoInscripcion; readonly currentYear: number },
): { readonly filters: InscripcionFilters; readonly search: string } {
  const tipoDeuda = tipoDeudaSchema.safeParse(
    read(values, FILTER_KEYS.TIPO_DEUDA),
  );
  return {
    filters: {
      tipo: context.tipo,
      ano: parseAno(read(values, FILTER_KEYS.ANO), context.currentYear),
      tipoDeuda: tipoDeuda.success ? tipoDeuda.data : null,
      rama: parseRama(read(values, FILTER_KEYS.RAMA)),
    },
    search: read(values, FILTER_KEYS.SEARCH) ?? '',
  };
}

export function yearOptions(currentYear: number): readonly FilterOption[] {
  const years = [currentYear - YEAR_SPAN, currentYear, currentYear + YEAR_SPAN];
  return [
    { value: ALL_YEARS, label: FILTER_COPY.ALL_YEARS },
    ...years.map((year) => ({ value: String(year), label: String(year) })),
  ];
}

/** Campos de la barra de filtros (la lista agrega "Buscar"; el dashboard no). */
export function buildFilterFields(params: {
  readonly currentYear: number;
  readonly withSearch: boolean;
}): readonly FilterField[] {
  const search: FilterField[] = params.withSearch
    ? [
        {
          key: FILTER_KEYS.SEARCH,
          type: 'search',
          label: FILTER_COPY.SEARCH,
          placeholder: FILTER_COPY.SEARCH_PLACEHOLDER,
        },
      ]
    : [];
  return [
    ...search,
    {
      key: FILTER_KEYS.ANO,
      type: 'select',
      label: FILTER_COPY.ANO,
      options: yearOptions(params.currentYear),
    },
    {
      key: FILTER_KEYS.TIPO_DEUDA,
      type: 'select',
      label: FILTER_COPY.TIPO_DEUDA,
      options: TIPO_DEUDA_OPTIONS,
    },
    {
      key: FILTER_KEYS.RAMA,
      type: 'select',
      label: FILTER_COPY.RAMA,
      options: RAMA_FILTER_OPTIONS,
    },
  ];
}
