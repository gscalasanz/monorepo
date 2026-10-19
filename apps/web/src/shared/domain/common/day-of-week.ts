/**
 * Días de la semana (port de `shared/enums/day-of-week.enum.ts` + labels de
 * `time-helpers.ts`). No existe en el backend: es un enum solo de UI.
 */
export const DAY_OF_WEEK = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];

export const DAYS_OF_WEEK_IN_ORDER: readonly DayOfWeek[] =
  Object.values(DAY_OF_WEEK);

export const DAY_OF_WEEK_LABELS: Readonly<Record<DayOfWeek, string>> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};
