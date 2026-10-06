/** Zona horaria canónica del grupo (todas las fechas de negocio se anclan acá). */
export const BSAS_TIME_ZONE = 'America/Argentina/Buenos_Aires';

/** Patrón de `LocalDate` y de `<input type="date">`. */
export const LOCAL_DATE_PATTERN = 'yyyy-MM-dd';

/** Patrón de `<input type="datetime-local">` (sin segundos, como el Angular). */
export const DATE_TIME_INPUT_PATTERN = "yyyy-MM-dd'T'HH:mm";

/**
 * Formatos de display (patrones date-fns, locale `es`). Los cuatro primeros son
 * paridad exacta con el pipe `dateFormat` de Angular (Intl es-AR); el resto, con
 * los `| date:'…'` que usan los templates.
 */
export const DATE_FORMATS = {
  /** `dateFormat:'date'` y `date:'dd/MM/yyyy'` → `13/03/2026` */
  date: 'dd/MM/yyyy',
  /** `dateFormat:'time'` → `15:30` */
  time: 'HH:mm',
  /** `dateFormat:'datetime'` → `13/03/2026, 15:30` */
  dateTime: 'dd/MM/yyyy, HH:mm',
  /** `dateFormat:'datelong'` → `viernes, 13 de marzo de 2026` */
  dateLong: "EEEE, d 'de' MMMM 'de' yyyy",
  /** `date:'dd/MM/yyyy HH:mm'` → `13/03/2026 15:30` */
  dateTimeCompact: 'dd/MM/yyyy HH:mm',
  /** Badge de fecha: mes abreviado → `mar` */
  monthShort: 'MMM',
  /** Badge de fecha: día del mes → `13` */
  dayOfMonth: 'd',
  /** `date:'d MMM'` → `13 mar` */
  dayMonth: 'd MMM',
  /** `date:'d MMM yyyy'` / `mediumDate` → `13 mar 2026` */
  dayMonthYear: 'd MMM yyyy',
  /** `date:'d/M'` → `13/3` */
  dayMonthNumeric: 'd/M',
  /** `date:'longDate'` → `13 de marzo de 2026` */
  longDate: "d 'de' MMMM 'de' yyyy",
} as const;

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
