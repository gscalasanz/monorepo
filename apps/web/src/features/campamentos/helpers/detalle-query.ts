/**
 * Filtros del detalle (participantes por nombre/rama + movimientos) y armado
 * de la query de `GET /campamentos/:id/detalle`.
 */
import type { FilterValues } from '@/shared/components/data';
import {
  PERSONA_TYPE,
  RAMAS,
  type FiltroMovimientos,
  type ParticipantePago,
  type Rama,
} from '@/shared/domain';

/** Valor del filtro "Educadores" (no es una rama: el backend lo rechaza con 400). */
export const RAMA_FILTER_EDUCADORES = 'educador';

/** Angular ignora búsquedas de 1–2 caracteres. */
export const NOMBRE_MIN_LENGTH = 3;

export const PARTICIPANTES_FILTER_KEYS = { NOMBRE: 'nombre', RAMA: 'rama' } as const;

export interface ParticipantesFilter {
  readonly nombre?: string;
  readonly rama?: string;
}

function stringOf(value: FilterValues[string]): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

/**
 * Próximo filtro efectivo a partir de los valores de la barra. Con 1–2
 * caracteres en el nombre se conserva el filtro actual (paridad). Devuelve la
 * misma referencia si no cambió.
 */
export function nextParticipantesFilter(
  current: ParticipantesFilter,
  values: FilterValues,
): ParticipantesFilter {
  const nombre = stringOf(values[PARTICIPANTES_FILTER_KEYS.NOMBRE]);
  const rama = stringOf(values[PARTICIPANTES_FILTER_KEYS.RAMA]);
  if (nombre && nombre.length < NOMBRE_MIN_LENGTH) return current;
  if (nombre === current.nombre && rama === current.rama) return current;
  return { ...(nombre && { nombre }), ...(rama && { rama }) };
}

export function hasParticipantesFilter(filter: ParticipantesFilter): boolean {
  return Boolean(filter.nombre || filter.rama);
}

function isRama(value: string): value is Rama {
  return (RAMAS as readonly string[]).includes(value);
}

export interface DetalleQuery {
  readonly id: string;
  readonly filtroMovimientos: FiltroMovimientos;
  readonly nombre?: string;
  readonly rama?: Rama;
}

/** Solo se envían ramas reales; "Educadores" se filtra en el cliente. */
export function buildDetalleQuery(params: {
  readonly id: string;
  readonly filtro: FiltroMovimientos;
  readonly filter: ParticipantesFilter;
}): DetalleQuery {
  const { nombre, rama } = params.filter;
  return {
    id: params.id,
    filtroMovimientos: params.filtro,
    ...(nombre && { nombre }),
    ...(rama && isRama(rama) && { rama }),
  };
}

/** Filtro cliente de "Educadores" (por tipo de persona). */
export function applyClientFilter(
  participantes: readonly ParticipantePago[],
  filter: ParticipantesFilter,
): readonly ParticipantePago[] {
  if (filter.rama !== RAMA_FILTER_EDUCADORES) return participantes;
  return participantes.filter((p) => p.tipo === PERSONA_TYPE.EDUCADOR);
}
