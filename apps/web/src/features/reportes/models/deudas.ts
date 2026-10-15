/** Filtros y constantes de `GET /reportes/deudas`; el contrato (schema) vive en `@/shared/domain`. */
import { RAMAS, type Rama } from '@/shared/domain';

export {
  personaDeudaSchema,
  personasDeudaSchema,
  type DocInscripcion,
  type PersonaDeuda,
} from '@/shared/domain';

/** Valor de dominio del backend (`RAMA_EDUCADORES`): agrupa a todos los educadores. */
export const RAMA_EDUCADORES = 'Educadores';
export const DEUDA_RAMA_FILTERS: readonly (Rama | typeof RAMA_EDUCADORES)[] = [...RAMAS, RAMA_EDUCADORES];
export type DeudaRamaFilter = (typeof DEUDA_RAMA_FILTERS)[number];

/** Backend `TipoDeudaFilter`. */
export const TIPO_DEUDA_FILTER = {
  DINERO: 'dinero',
  CAMPAMENTOS: 'campamentos',
  INSCRIPCIONES_SCOUT: 'inscripcionesScout',
  INSCRIPCIONES_GRUPO: 'inscripcionesGrupo',
  DOCUMENTACION: 'documentacion',
} as const;
export type TipoDeudaFilter = (typeof TIPO_DEUDA_FILTER)[keyof typeof TIPO_DEUDA_FILTER];

const TIPO_VALUES: readonly string[] = Object.values(TIPO_DEUDA_FILTER);
const RAMA_VALUES: readonly string[] = DEUDA_RAMA_FILTERS;

export const isTipoDeudaFilter = (value: string): value is TipoDeudaFilter => TIPO_VALUES.includes(value);
export const isDeudaRamaFilter = (value: string): value is DeudaRamaFilter => RAMA_VALUES.includes(value);

export interface DeudaFilters {
  readonly rama?: DeudaRamaFilter;
  readonly ano?: number;
  readonly tipo?: TipoDeudaFilter;
}
