/**
 * `@/shared/time` — único lugar autorizado a leer el reloj y construir fechas
 * (regla ESLint `no-new-date`). Zona canónica: America/Argentina/Buenos_Aires.
 */
export {
  asInstant,
  asLocalDate,
  type Brand,
  type Instant,
  type LocalDate,
} from './branded';
export {
  BSAS_TIME_ZONE,
  DATE_FORMATS,
  DATE_TIME_INPUT_PATTERN,
  LOCAL_DATE_PATTERN,
  MS_PER_MINUTE,
  MS_PER_SECOND,
  type DateFormat,
} from './constants';
export { currentYearBsAs, nowInstant, nowMs, todayBsAs } from './clock';
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
} from './parse';
export { formatDate, formatInBsAs } from './format';
export {
  dateTimeInputToInstant,
  toDateInputValue,
  toDateTimeInputValue,
} from './input';
export {
  calculateDurationInMinutes,
  formatDuration,
  type TimeOfDayRange,
} from './duration';
export { instantSchema, localDateSchema } from './schemas';
