/**
 * Estado de la lista de movimientos ↔ query params (URL inicial y `GET /movimientos`).
 * En Angular los query params se perdían por un bug de hidratación; acá se respetan.
 */
import type { QueryParams } from '@/shared/api';
import type { DateRangeValue, FilterValues } from '@/shared/components/data';
import {
  CAJA_TYPE,
  CONCEPTO_MOVIMIENTO,
  ESTADO_PAGO,
  type ConceptoMovimiento,
  type EstadoPago,
} from '@/shared/domain';
import { isLocalDateString } from '@/shared/time';
import {
  FILTER_KEYS,
  LIST_URL_PARAMS as P,
  MOVIMIENTOS_DEFAULT_PAGE_SIZE,
  TIPO_TAB,
  type TipoTab,
} from '@/features/movimientos/constants/movimientos';

/** Lo mínimo de `URLSearchParams` / `ReadonlyURLSearchParams` que se lee. */
export interface SearchParamsReader {
  get(name: string): string | null;
}

/** Filtros que llegan por URL y no tienen control visible (p. ej. desde Cajas). */
export interface FixedFilters {
  readonly cajaId?: string;
  readonly tipoCaja?: string;
}

export interface MovimientosListState {
  readonly tab: TipoTab;
  readonly filters: FilterValues;
  readonly fixed: FixedFilters;
  readonly pageIndex: number;
  readonly pageSize: number;
}

const CONCEPTOS: readonly string[] = Object.values(CONCEPTO_MOVIMIENTO);
const ESTADOS: readonly string[] = Object.values(ESTADO_PAGO);
const CAJA_TYPES: readonly string[] = Object.values(CAJA_TYPE);
const TIPO_CAJA_SEPARATOR = ',';

export function isConcepto(value: string): value is ConceptoMovimiento {
  return CONCEPTOS.includes(value);
}

export function isEstadoPago(value: string): value is EstadoPago {
  return ESTADOS.includes(value);
}

function tabFrom(value: string | null): TipoTab {
  if (value === TIPO_TAB.INGRESO || value === TIPO_TAB.EGRESO) return value;
  return TIPO_TAB.TODOS;
}

function validDate(value: string | null): string | undefined {
  return value && isLocalDateString(value) ? value : undefined;
}

function validTipoCaja(value: string | null): string | undefined {
  if (!value) return undefined;
  const tipos = value
    .split(TIPO_CAJA_SEPARATOR)
    .filter((tipo) => CAJA_TYPES.includes(tipo));
  return tipos.length > 0 ? tipos.join(TIPO_CAJA_SEPARATOR) : undefined;
}

function initialFilters(params: SearchParamsReader): FilterValues {
  const concepto = params.get(P.CONCEPTO);
  const from = validDate(params.get(P.FECHA_INICIO));
  const to = validDate(params.get(P.FECHA_FIN));
  const fecha: DateRangeValue | undefined =
    from || to ? { from, to } : undefined;
  return {
    ...(concepto && isConcepto(concepto)
      ? { [FILTER_KEYS.CONCEPTO]: concepto }
      : {}),
    ...(fecha ? { [FILTER_KEYS.FECHA]: fecha } : {}),
  };
}

/** Estado inicial a partir de `cajaId`, `tipoCaja`, `tipo`, `concepto`, `fechaInicio`, `fechaFin`. */
export function listStateFromParams(
  params: SearchParamsReader,
): MovimientosListState {
  const cajaId = params.get(P.CAJA_ID) || undefined;
  const tipoCaja = validTipoCaja(params.get(P.TIPO_CAJA));
  return {
    tab: tabFrom(params.get(P.TIPO)),
    filters: initialFilters(params),
    fixed: { ...(cajaId ? { cajaId } : {}), ...(tipoCaja ? { tipoCaja } : {}) },
    pageIndex: 0,
    pageSize: MOVIMIENTOS_DEFAULT_PAGE_SIZE,
  };
}

function stringFilter(filters: FilterValues, key: string): string | undefined {
  const value = filters[key];
  return typeof value === 'string' && value !== '' ? value : undefined;
}

function rangeFilter(filters: FilterValues, key: string): DateRangeValue {
  const value = filters[key];
  return typeof value === 'object' ? value : {};
}

/** Query de `GET /movimientos` (página 1-based del backend). */
export function listQuery(state: MovimientosListState): QueryParams {
  const fecha = rangeFilter(state.filters, FILTER_KEYS.FECHA);
  return {
    page: state.pageIndex + 1,
    limit: state.pageSize,
    cajaId: state.fixed.cajaId,
    tipoCaja: state.fixed.tipoCaja,
    tipo: state.tab || undefined,
    concepto: stringFilter(state.filters, FILTER_KEYS.CONCEPTO),
    estadoPago: stringFilter(state.filters, FILTER_KEYS.ESTADO_PAGO),
    fechaInicio: fecha.from || undefined,
    fechaFin: fecha.to || undefined,
  };
}

/** Clave estable de la consulta (identidad para `useAsyncData`). */
export function listQueryKey(state: MovimientosListState): string {
  return JSON.stringify(listQuery(state));
}
