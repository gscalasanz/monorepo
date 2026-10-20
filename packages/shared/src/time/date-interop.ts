/**
 * Puente con las APIs que exigen un `Date` (columnas `timestamptz` de TypeORM, ExcelJS,
 * nombres de archivo). Junto con `clock.ts`, es el único lugar del api autorizado a
 * construir un `Date` (regla `no-new-date`).
 */
import { asInstant, type Instant } from './branded';
import { parseLocalDate } from './parse';

const YEAR_LENGTH = 4;

/** `Date` válido o error (fail fast): nunca propagar un `Invalid Date` en silencio. */
function validDate(date: Date, source: unknown): Date {
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: "${String(source)}".`);
  }
  return date;
}

/** Instante actual como `Date` (un objeto nuevo en cada llamada). */
export function nowDate(): Date {
  return new Date();
}

/** Epoch ms → `Date` (vencimientos: `dateFromMs(nowMs() + ttl)`). */
export function dateFromMs(ms: number): Date {
  return validDate(new Date(ms), ms);
}

/**
 * Parsea un string de fecha con la MISMA semántica que `new Date(string)`: un ISO con `Z` u
 * offset da su instante; un `YYYY-MM-DD` da la medianoche UTC de ese día. Existe para
 * conservar el comportamiento histórico del api en los bordes (DTOs, query params);
 * a diferencia de `new Date`, lanza si el valor no es una fecha.
 */
export function dateFromIsoString(value: string): Date {
  return validDate(new Date(value), value);
}

/** Epoch ms de un `Date` o de un string ISO (orden y comparación de instantes). */
export function epochMsOf(value: Date | string): number {
  return validDate(typeof value === 'string' ? new Date(value) : value, value).getTime();
}

/** `Date` → `Instant` UTC, para usar las funciones de formato en BsAs. */
export function instantOf(date: Date): Instant {
  return asInstant(validDate(date, date).toISOString());
}

/**
 * Año del día de negocio de un valor. Una fecha calendario (`YYYY-MM-DD`, o la medianoche
 * UTC con la que la serializan los DTOs) es de su propio año, sin pasar por la zona del
 * servidor; cualquier otro instante toma el año del día en BsAs.
 *
 * Contrato: pensado para columnas `date`. Un instante real (`timestamptz`) que cae justo en
 * `00:00:00.000Z` es indistinguible de una fecha calendario y se lee como tal (año UTC).
 */
export function businessYearOf(value: Date | string): number {
  const iso = typeof value === 'string' ? value : instantOf(value);
  return Number(parseLocalDate(iso).slice(0, YEAR_LENGTH));
}
