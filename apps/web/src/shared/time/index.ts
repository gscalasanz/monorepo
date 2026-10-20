/**
 * `@/shared/time` — único lugar autorizado a leer el reloj y construir fechas
 * (regla ESLint `no-new-date`). Zona canónica: America/Argentina/Buenos_Aires.
 *
 * La implementación vive en `@scout/shared/time` (la comparte el api); acá se re-exporta
 * con la misma API de siempre y se suman los schemas zod de borde, que son solo de web.
 * Exports listados a mano: `export *` sobre el CJS del paquete obliga a Turbopack a
 * resolverlos en runtime.
 */
export {
  asInstant,
  asLocalDate,
  type Brand,
  type Instant,
  type LocalDate,
} from '@scout/shared/time';
export {
  BSAS_TIME_ZONE,
  DATE_FORMATS,
  DATE_TIME_INPUT_PATTERN,
  LOCAL_DATE_PATTERN,
  MS_PER_MINUTE,
  MS_PER_SECOND,
  type DateFormat,
} from '@scout/shared/time';
export { currentYearBsAs, nowInstant, nowMs, todayBsAs } from '@scout/shared/time';
export {
  addDays,
  calculateWeekRange,
  dayFilterBounds,
  daysBetween,
  isBefore,
  isLocalDateString,
  localDateOf,
  msFromInstant,
  msToInstant,
  parseInstant,
  parseLocalDate,
  resolveBackendDate,
  type DayFilterBounds,
  type LocalDateRange,
  type WeekRange,
} from '@scout/shared/time';
export { formatDate, formatInBsAs } from '@scout/shared/time';
export {
  dateTimeInputToInstant,
  toDateInputValue,
  toDateTimeInputValue,
} from '@scout/shared/time';
export {
  calculateDurationInMinutes,
  formatDuration,
  type TimeOfDayRange,
} from '@scout/shared/time';
export { instantSchema, localDateSchema } from './schemas';
