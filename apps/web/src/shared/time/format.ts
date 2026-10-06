import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';

import type { Instant } from '@/shared/time/branded';
import { BSAS_TIME_ZONE, DATE_FORMATS, type DateFormat } from '@/shared/time/constants';
import { msFromInstant, resolveBackendDate } from '@/shared/time/parse';

const EMPTY = '';

/** Formatea un `Instant` en la zona de BsAs con un patrón de date-fns (locale `es`). */
export function formatInBsAs(instant: Instant, pattern: string): string {
  return formatInTimeZone(msFromInstant(instant), BSAS_TIME_ZONE, pattern, { locale: es });
}

/**
 * Equivalente al pipe `dateFormat` (y a los `| date:'…'`) de Angular: acepta lo
 * que mande el backend (ISO, fecha calendario, `DD/MM/YYYY`, epoch) y devuelve el
 * texto en hora de BsAs. Vacío o inválido → `''` (nunca "Invalid Date" en pantalla).
 */
export function formatDate(value: unknown, format: DateFormat = DATE_FORMATS.date): string {
  const instant = resolveBackendDate(value);
  return instant ? formatInBsAs(instant, format) : EMPTY;
}
