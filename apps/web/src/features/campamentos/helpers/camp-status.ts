/**
 * Estado temporal de un campamento (próximo / en curso / finalizado) y cuenta
 * regresiva, con fechas calendario de BsAs (Angular las parseaba en UTC y
 * corría un día; ver docs/paridad).
 */
import { msFromInstant, resolveBackendDate, type LocalDate } from '@/shared/time';

export const CAMP_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  PAST: 'past',
} as const;

export type CampStatus = (typeof CAMP_STATUS)[keyof typeof CAMP_STATUS];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface CampDates {
  readonly fechaInicio: LocalDate;
  readonly fechaFin: LocalDate;
}

/** hoy < inicio → próximo; inicio ≤ hoy ≤ fin → en curso; si no, finalizado. */
export function campStatus(camp: CampDates, today: LocalDate): CampStatus {
  if (today < camp.fechaInicio) return CAMP_STATUS.UPCOMING;
  if (today <= camp.fechaFin) return CAMP_STATUS.ACTIVE;
  return CAMP_STATUS.PAST;
}

/** `ceil((inicio − ahora) / día)` si es > 0; si no `null` (paridad con `diasRestantes`). */
export function daysUntil(fechaInicio: LocalDate, nowMs: number): number | null {
  const start = resolveBackendDate(fechaInicio);
  if (!start) return null;
  const diff = Math.ceil((msFromInstant(start) - nowMs) / MS_PER_DAY);
  return diff > 0 ? diff : null;
}

export interface CampStats {
  readonly total: number;
  readonly upcoming: number;
  readonly active: number;
  readonly past: number;
}

export function campStats(camps: readonly CampDates[], today: LocalDate): CampStats {
  return camps.reduce<CampStats>(
    (acc, camp) => {
      const status = campStatus(camp, today);
      return { ...acc, [status]: acc[status] + 1 };
    },
    { total: camps.length, upcoming: 0, active: 0, past: 0 },
  );
}

/**
 * Badge de la card: un próximo sin días restantes cae en "Finalizado" (rareza
 * de Angular que se replica; en la práctica no ocurre con fechas calendario).
 */
export type CardBadge =
  | { readonly kind: 'upcoming'; readonly days: number }
  | { readonly kind: 'active' }
  | { readonly kind: 'past' };

export function cardBadge(params: {
  readonly camp: CampDates;
  readonly today: LocalDate;
  readonly nowMs: number;
}): CardBadge {
  const status = campStatus(params.camp, params.today);
  if (status === CAMP_STATUS.ACTIVE) return { kind: 'active' };
  if (status === CAMP_STATUS.UPCOMING) {
    const days = daysUntil(params.camp.fechaInicio, params.nowMs);
    if (days !== null) return { kind: 'upcoming', days };
  }
  return { kind: 'past' };
}
