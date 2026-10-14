import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';

const MORNING_FROM = 6;
const AFTERNOON_FROM = 12;
const NIGHT_FROM = 20;

/** Saludo según la hora (0–23) de Buenos Aires. */
export function greetingFor(hour: number): string {
  if (hour >= NIGHT_FROM || hour < MORNING_FROM) return C.GREETING_NIGHT;
  return hour >= AFTERNOON_FROM ? C.GREETING_AFTERNOON : C.GREETING_MORNING;
}

export function firstNameOf(nombre: string | undefined): string {
  return nombre?.trim().split(/\s+/)[0] ?? '';
}
