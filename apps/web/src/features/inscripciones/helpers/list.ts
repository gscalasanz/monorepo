/** Filtro de búsqueda local de la lista (los demás filtros los aplica el backend). */
import type { Inscripcion } from '@/shared/domain';

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
