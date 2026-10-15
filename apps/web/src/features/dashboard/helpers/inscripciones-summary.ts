/** Resumen por estado de las inscripciones del año, para la barra apilada del dashboard. */
import { ESTADO_INSCRIPCION, type Inscripcion } from '@/shared/domain';

export type InscripcionFlags = Pick<Inscripcion, 'estado' | 'montoTotal' | 'montoBonificado'>;

export interface InscripcionesSummary {
  readonly total: number;
  /** Pagadas + bonificadas: no deben nada. */
  readonly alDia: number;
  readonly pagadas: number;
  readonly bonificadas: number;
  readonly parciales: number;
  readonly pendientes: number;
}

/**
 * El backend nunca emite `bonificado`: una inscripción 100 % bonificada llega como `pagado`
 * (HALLAZGOS). Se distingue por monto: bonificado ≥ total (y total > 0).
 */
function isBonificada(insc: InscripcionFlags): boolean {
  if (insc.estado === ESTADO_INSCRIPCION.BONIFICADO) return true;
  return insc.estado === ESTADO_INSCRIPCION.PAGADO && insc.montoTotal > 0 && insc.montoBonificado >= insc.montoTotal;
}

const countWhere = (items: readonly InscripcionFlags[], test: (i: InscripcionFlags) => boolean): number =>
  items.filter(test).length;

export function buildInscripcionesSummary(items: readonly InscripcionFlags[]): InscripcionesSummary {
  const bonificadas = countWhere(items, isBonificada);
  const pagadas = countWhere(items, (i) => i.estado === ESTADO_INSCRIPCION.PAGADO && !isBonificada(i));
  return {
    total: items.length,
    alDia: pagadas + bonificadas,
    pagadas,
    bonificadas,
    parciales: countWhere(items, (i) => i.estado === ESTADO_INSCRIPCION.PARCIAL),
    pendientes: countWhere(items, (i) => i.estado === ESTADO_INSCRIPCION.PENDIENTE),
  };
}
