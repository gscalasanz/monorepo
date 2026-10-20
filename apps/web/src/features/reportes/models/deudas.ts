import {
  DEUDA_RAMA_FILTERS,
  RAMA_EDUCADORES,
  TipoDeudaFilter as TIPO_DEUDA_FILTER,
  type DeudaRamaFilter,
  type TipoDeudaFilter,
} from '@scout/shared/enums';
import { z } from 'zod';

/**
 * Filtros y constantes de `GET /reportes/deudas`; el contrato (schema) vive en `@/shared/domain`.
 * Los valores de los filtros son vocabulario de wire y se definen en `@scout/shared`.
 */
export { DEUDA_RAMA_FILTERS, RAMA_EDUCADORES, TIPO_DEUDA_FILTER };
export type { DeudaRamaFilter, TipoDeudaFilter };

export {
  personaDeudaSchema,
  personasDeudaSchema,
  type DocInscripcion,
  type PersonaDeuda,
} from '@/shared/domain';

export const tipoDeudaFilterSchema = z.nativeEnum(TIPO_DEUDA_FILTER);

const TIPO_VALUES: readonly string[] = Object.values(TIPO_DEUDA_FILTER);
const RAMA_VALUES: readonly string[] = DEUDA_RAMA_FILTERS;

export const isTipoDeudaFilter = (value: string): value is TipoDeudaFilter => TIPO_VALUES.includes(value);
export const isDeudaRamaFilter = (value: string): value is DeudaRamaFilter => RAMA_VALUES.includes(value);

export interface DeudaFilters {
  readonly rama?: DeudaRamaFilter;
  readonly ano?: number;
  readonly tipo?: TipoDeudaFilter;
  /** Texto a buscar en el nombre de la persona. */
  readonly q?: string;
  /** Solo la deuda de este campamento. */
  readonly campamentoId?: string;
}

/** El consolidado solo se acota por rama (los años y orígenes son lo que ofrece como filtros). */
export interface ConsolidadoFilters {
  readonly rama?: DeudaRamaFilter;
}
