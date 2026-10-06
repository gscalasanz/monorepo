/**
 * Única lectura del reloj de la app (regla ESLint `no-new-date`). Todo lo que
 * necesite "ahora" o "hoy" pasa por acá, anclado a la zona de BsAs.
 */
import { asInstant, type Instant, type LocalDate } from '@/shared/time/branded';
import { localDateOf } from '@/shared/time/parse';

/** Instante actual en UTC (`...Z`). */
export function nowInstant(): Instant {
  return asInstant(new Date().toISOString());
}

/** Milisegundos epoch actuales (timers, TTLs, expiración de JWT). */
export function nowMs(): number {
  return Date.now();
}

/** Día de hoy en BsAs (no en UTC: a las 22:00 BsAs sigue siendo "hoy"). */
export function todayBsAs(): LocalDate {
  return localDateOf(nowInstant());
}

/** Año calendario actual en BsAs (default de inscripciones y reportes). */
export function currentYearBsAs(): number {
  return Number(todayBsAs().slice(0, 4));
}
