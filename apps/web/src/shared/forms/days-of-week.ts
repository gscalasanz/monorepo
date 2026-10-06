import { DAYS_OF_WEEK_IN_ORDER, type DayOfWeek } from '@/shared/domain';

/** Alterna un día manteniendo el orden lunes→domingo. Devuelve un array nuevo. */
export function toggleDay(
  selected: readonly DayOfWeek[],
  day: DayOfWeek,
): DayOfWeek[] {
  const isOn = selected.includes(day);
  return DAYS_OF_WEEK_IN_ORDER.filter((candidate) =>
    candidate === day ? !isOn : selected.includes(candidate),
  );
}
