/** Selección de "origen de deuda" desde el consolidado (campamento o inscripción de un año). */
import type { FilterValues } from '@/shared/components/data';
import { FILTER_KEYS } from '@/features/reportes/constants/filters';
import type { InscripcionConsolidada } from '@/features/reportes/models/consolidado';

const omitKeys = (
  values: FilterValues,
  keys: readonly string[],
): FilterValues =>
  Object.fromEntries(Object.entries(values).filter(([key]) => !keys.includes(key)));

/** La inscripción elegida vive en los filtros `tipo` + `ano` (visibles en la barra de filtros). */
export function isInscripcionSelected(
  values: FilterValues,
  item: InscripcionConsolidada,
): boolean {
  return (
    values[FILTER_KEYS.TIPO] === item.tipo &&
    values[FILTER_KEYS.ANO] === String(item.ano)
  );
}

/** Elige la inscripción (tipo + año) o, si ya estaba elegida, la quita. */
export function toggleInscripcion(
  values: FilterValues,
  item: InscripcionConsolidada,
): FilterValues {
  if (isInscripcionSelected(values, item)) {
    return omitKeys(values, [FILTER_KEYS.TIPO, FILTER_KEYS.ANO]);
  }
  return {
    ...values,
    [FILTER_KEYS.TIPO]: item.tipo,
    [FILTER_KEYS.ANO]: String(item.ano),
  };
}

/** Quita todo el origen elegido desde una inscripción (tipo + año). */
export function withoutOrigen(values: FilterValues): FilterValues {
  return omitKeys(values, [FILTER_KEYS.TIPO, FILTER_KEYS.ANO]);
}

/** Elegir un campamento deja sin efecto el tipo de deuda (el campamento ya es más específico). */
export function withoutTipo(values: FilterValues): FilterValues {
  return omitKeys(values, [FILTER_KEYS.TIPO]);
}
