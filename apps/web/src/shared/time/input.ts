/**
 * Conversión entre los valores de `<input type="date|datetime-local">` y lo que
 * manda/espera el backend (port de `normalizeToISO8601` de los campos de Angular).
 * El backend recibe las fechas calendario como `YYYY-MM-DD` tal cual.
 */
import { fromZonedTime } from 'date-fns-tz';

import { asInstant, type Instant } from '@/shared/time/branded';
import { BSAS_TIME_ZONE, DATE_TIME_INPUT_PATTERN } from '@/shared/time/constants';
import { formatInBsAs } from '@/shared/time/format';
import { isLocalDateString, localDateOf, resolveBackendDate } from '@/shared/time/parse';

const EMPTY = '';
const DATE_TIME_INPUT_REGEX = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/;
const MAX_HOURS = 23;
const MAX_MINUTES = 59;

/** Valor para `<input type="date">` (`YYYY-MM-DD` en BsAs) o `''`. */
export function toDateInputValue(value: unknown): string {
  const instant = resolveBackendDate(value);
  return instant ? localDateOf(instant) : EMPTY;
}

function isValidDateTimeInput(value: string): boolean {
  const match = DATE_TIME_INPUT_REGEX.exec(value);
  if (!match) return false;
  const [, day = '', hours = '', minutes = ''] = match;
  return isLocalDateString(day) && Number(hours) <= MAX_HOURS && Number(minutes) <= MAX_MINUTES;
}

/** Valor para `<input type="datetime-local">` (`YYYY-MM-DDTHH:mm` en BsAs) o `''`. */
export function toDateTimeInputValue(value: unknown): string {
  if (typeof value === 'string' && isValidDateTimeInput(value)) return value;
  const instant = resolveBackendDate(value);
  return instant ? formatInBsAs(instant, DATE_TIME_INPUT_PATTERN) : EMPTY;
}

/** Valor de `<input type="datetime-local">` (hora de BsAs) → `Instant` UTC, o `null`. */
export function dateTimeInputToInstant(value: string): Instant | null {
  if (!isValidDateTimeInput(value)) return null;
  return asInstant(fromZonedTime(value, BSAS_TIME_ZONE).toISOString());
}
