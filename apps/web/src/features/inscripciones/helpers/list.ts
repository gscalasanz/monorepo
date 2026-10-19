/** Filtro de búsqueda local de la lista (los demás filtros los aplica el backend). */
import type { Inscripcion } from '@/shared/domain';
import {
  AUTORIZACIONES,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';

export function personaNombre(inscripcion: Inscripcion): string {
  return inscripcion.persona?.nombre ?? inscripcion.personaId;
}

export function filterBySearch(
  inscripciones: readonly Inscripcion[],
  search: string,
): readonly Inscripcion[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return inscripciones;
  return inscripciones.filter((inscripcion) =>
    (inscripcion.persona?.nombre ?? '').toLowerCase().includes(needle),
  );
}

/** Nombres cortos de los papeles que faltan, en el orden de Angular. */
export function missingAutorizaciones(
  autorizaciones: Autorizaciones,
): readonly string[] {
  return AUTORIZACIONES.filter(({ key }) => !autorizaciones[key]).map(
    ({ short }) => short,
  );
}
