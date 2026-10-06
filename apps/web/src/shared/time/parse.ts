/**
 * Parseo de las fechas que manda el backend y aritmética de días calendario.
 *
 * El backend manda dos clases de fecha: **fechas calendario** (`YYYY-MM-DD`, o el
 * mismo día serializado como medianoche UTC `YYYY-MM-DDT00:00:00.000Z`) e
 * **instantes** (timestamps ISO). Una fecha calendario NO debe pasar por la zona
 * horaria: `new Date('2026-03-13')` en UTC−3 cae el 12 (el bug que el pipe
 * `dateFormat` de Angular parchea con `parseAsLocalDate`).
 */
import { addDays as addDaysToDate, differenceInCalendarDays } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

import {
  asInstant,
  asLocalDate,
  type Instant,
  type LocalDate,
} from '@/shared/time/branded';
import { BSAS_TIME_ZONE, LOCAL_DATE_PATTERN } from '@/shared/time/constants';

const LOCAL_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_ONLY_ISO_REGEX = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?Z$/;
/** `DD/MM/YYYY` con hora `HH:mm` opcional (formato que aceptaba el pipe de Angular). */
const DISPLAY_DATE_REGEX =
  /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{2}))?$/;
const START_OF_DAY = 'T00:00:00';
const ISO_SUNDAY = 7;
const ISO_WEEKDAY_PATTERN = 'i';

/** `Date` válido o error (fail fast): nunca propagar un `Invalid Date` en silencio. */
function toValidDate(value: string | number): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: "${String(value)}".`);
  }
  return date;
}

/** `true` si el valor es un día calendario `YYYY-MM-DD` existente (rechaza `2026-02-30`). */
export function isLocalDateString(value: string): boolean {
  if (!LOCAL_DATE_REGEX.test(value)) return false;
  const date = new Date(`${value}${START_OF_DAY}Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Día calendario de un valor "solo fecha" (`YYYY-MM-DD` o medianoche Z), o `null`. */
function calendarDayOf(value: string): string | null {
  if (isLocalDateString(value)) return value;
  const match = DATE_ONLY_ISO_REGEX.exec(value);
  return match?.[1] && isLocalDateString(match[1]) ? match[1] : null;
}

/** Instante en que empieza un día calendario en BsAs. */
function startOfDayBsAs(day: string): Instant {
  return asInstant(
    fromZonedTime(`${day}${START_OF_DAY}`, BSAS_TIME_ZONE).toISOString(),
  );
}

/** Día de negocio (BsAs) al que pertenece un instante. */
export function localDateOf(instant: Instant): LocalDate {
  return asLocalDate(
    formatInTimeZone(toValidDate(instant), BSAS_TIME_ZONE, LOCAL_DATE_PATTERN),
  );
}

/** Valida y normaliza un ISO a `Instant` UTC. Lanza si es inválido. */
export function parseInstant(value: string): Instant {
  return asInstant(toValidDate(value).toISOString());
}

/**
 * Valida y normaliza a `LocalDate`: una fecha calendario se respeta tal cual; un
 * instante toma el día de BsAs. Lanza si es inválido.
 */
export function parseLocalDate(value: string): LocalDate {
  const day = calendarDayOf(value);
  return day ? asLocalDate(day) : localDateOf(parseInstant(value));
}

function parseDisplayDate(value: string): Instant | null {
  const match = DISPLAY_DATE_REGEX.exec(value);
  if (!match) return null;
  const [, day = '', month = '', year = '', hours = '0', minutes = '0'] = match;
  const isoDay = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  if (!isLocalDateString(isoDay)) return null;
  const time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  return asInstant(
    fromZonedTime(`${isoDay}T${time}`, BSAS_TIME_ZONE).toISOString(),
  );
}

function resolveDateString(value: string): Instant | null {
  const day = calendarDayOf(value);
  if (day) return startOfDayBsAs(day);
  const display = parseDisplayDate(value);
  if (display) return display;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : asInstant(date.toISOString());
}

/**
 * Resuelve cualquier fecha que pueda llegar del backend o de un form (ISO,
 * fecha calendario, `DD/MM/YYYY [HH:mm]`, epoch ms) a un `Instant`. Una fecha
 * calendario se ancla a la medianoche de BsAs. `null` si no es una fecha.
 */
export function resolveBackendDate(value: unknown): Instant | null {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? asInstant(new Date(value).toISOString())
      : null;
  }
  if (typeof value !== 'string' || value === '') return null;
  return resolveDateString(value);
}

/** `true` si `a` ocurre estrictamente antes que `b` (compara instantes reales). */
export function isBefore(a: Instant, b: Instant): boolean {
  return toValidDate(a).getTime() < toValidDate(b).getTime();
}

/** Milisegundos epoch de un `Instant`. */
export function msFromInstant(instant: Instant): number {
  return toValidDate(instant).getTime();
}

/** Milisegundos epoch → `Instant` UTC. */
export function msToInstant(ms: number): Instant {
  return asInstant(toValidDate(ms).toISOString());
}

/** Suma (o resta) días calendario de BsAs. */
export function addDays(date: LocalDate, amount: number): LocalDate {
  const shifted = addDaysToDate(toValidDate(startOfDayBsAs(date)), amount);
  return asLocalDate(
    formatInTimeZone(shifted, BSAS_TIME_ZONE, LOCAL_DATE_PATTERN),
  );
}

export interface LocalDateRange {
  readonly from: LocalDate;
  readonly to: LocalDate;
}

/** Días calendario de `from` a `to` (negativo si `to` es anterior). */
export function daysBetween({ from, to }: LocalDateRange): number {
  return differenceInCalendarDays(
    toValidDate(`${to}${START_OF_DAY}Z`),
    toValidDate(`${from}${START_OF_DAY}Z`),
  );
}

export interface WeekRange {
  readonly startDate: LocalDate;
  readonly endDate: LocalDate;
}

/** Lunes y domingo de la semana que contiene `date` (port de `calculateWeekRange`). */
export function calculateWeekRange(date: LocalDate): WeekRange {
  const isoWeekday = Number(
    formatInTimeZone(
      toValidDate(startOfDayBsAs(date)),
      BSAS_TIME_ZONE,
      ISO_WEEKDAY_PATTERN,
    ),
  );
  const startDate = addDays(date, 1 - isoWeekday);
  return { startDate, endDate: addDays(startDate, ISO_SUNDAY - 1) };
}
