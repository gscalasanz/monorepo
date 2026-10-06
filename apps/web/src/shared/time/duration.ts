/** Duraciones entre horas `HH:mm` (port de `shared/utils/time-helpers.ts`). */
import { MINUTES_PER_DAY, MINUTES_PER_HOUR } from '@/shared/time/constants';

export interface TimeOfDayRange {
  /** `HH:mm` */
  readonly start: string;
  /** `HH:mm` */
  readonly end: string;
}

function minutesOfDay(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

/** Minutos entre dos horas; si el fin es anterior, asume que cruza la medianoche. */
export function calculateDurationInMinutes({
  start,
  end,
}: TimeOfDayRange): number {
  const diff = minutesOfDay(end) - minutesOfDay(start);
  return diff < 0 ? diff + MINUTES_PER_DAY : diff;
}

/** `90` → `1h 30m`, `120` → `2h`, `45` → `45m`. */
export function formatDuration(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / MINUTES_PER_HOUR);
  const minutes = durationInMinutes % MINUTES_PER_HOUR;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
