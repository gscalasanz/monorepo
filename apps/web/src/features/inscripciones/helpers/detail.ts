/** Cálculos del detalle de inscripción (card de pago, autorizaciones, historial). */
import {
  CONCEPTO_MOVIMIENTO,
  TIPO_MOVIMIENTO,
  type ConceptoMovimiento,
  type Inscripcion,
  type MovimientoInscripcion,
} from '@/shared/domain';
import {
  PERCENT,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';

/** Lo que hay que pagar después de la bonificación. */
export function montoAPagar(
  inscripcion: Pick<Inscripcion, 'montoTotal' | 'montoBonificado'>,
): number {
  return inscripcion.montoTotal - inscripcion.montoBonificado;
}

/** % pagado (entero, tope 100); si no hay nada que pagar → 100. */
export function progressPercent(
  inscripcion: Pick<
    Inscripcion,
    'montoTotal' | 'montoBonificado' | 'montoPagado'
  >,
): number {
  const total = montoAPagar(inscripcion);
  if (total <= 0) return PERCENT;
  return Math.min(
    PERCENT,
    Math.round((inscripcion.montoPagado / total) * PERCENT),
  );
}

export function pickAutorizaciones(source: Autorizaciones): Autorizaciones {
  return {
    declaracionDeSalud: source.declaracionDeSalud,
    autorizacionDeImagen: source.autorizacionDeImagen,
    salidasCercanas: source.salidasCercanas,
    autorizacionIngreso: source.autorizacionIngreso,
    certificadoAptitudFisica: source.certificadoAptitudFisica,
  };
}

const CONCEPTOS_PAGO_EDITABLE: ReadonlySet<ConceptoMovimiento> = new Set([
  CONCEPTO_MOVIMIENTO.INSCRIPCION_SCOUT_ARGENTINA,
  CONCEPTO_MOVIMIENTO.INSCRIPCION_GRUPO,
]);

/** Solo los ingresos reales de la inscripción se editan desde el historial. */
export function isPagoEditable(
  movimiento: Pick<MovimientoInscripcion, 'tipo' | 'concepto'>,
): boolean {
  return (
    movimiento.tipo === TIPO_MOVIMIENTO.INGRESO &&
    CONCEPTOS_PAGO_EDITABLE.has(movimiento.concepto)
  );
}

/** Las respuestas de mutaciones pueden no traer `persona`: se conserva la que ya había. */
export function mergeInscripcion(
  previous: Inscripcion | undefined,
  next: Inscripcion,
): Inscripcion {
  return next.persona || !previous?.persona
    ? next
    : { ...next, persona: previous.persona };
}
