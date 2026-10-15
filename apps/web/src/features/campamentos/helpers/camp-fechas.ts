/** Rango de fechas del campamento: corto para tablas ("15 ene – 20 ene") y completo para `title`. */
import { DATE_FORMATS, formatDate } from '@/shared/time';
import type { CampDates } from '@/features/campamentos/helpers/camp-status';

const RANGE_SEPARATOR = ' – ';

export function fechasCortas(camp: CampDates): string {
  return [camp.fechaInicio, camp.fechaFin]
    .map((f) => formatDate(f, DATE_FORMATS.dayMonthPadded))
    .join(RANGE_SEPARATOR);
}

export function fechasCompletas(camp: CampDates): string {
  return [camp.fechaInicio, camp.fechaFin]
    .map((f) => formatDate(f, DATE_FORMATS.longDate))
    .join(RANGE_SEPARATOR);
}
