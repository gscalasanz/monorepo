/**
 * Persona a reembolsar (port de `syncPersonaAReembolsarRequerida`). Un movimiento
 * pendiente de reembolso es una deuda del grupo con alguien: tiene que decir con
 * quién (el back lo rechaza sin persona). Mientras el estado sea
 * `pendiente_reembolso`, la persona se precarga con el responsable y lo sigue
 * si cambia, salvo que se haya elegido otra a mano; fuera de ese estado se limpia.
 */
import { ESTADO_PAGO } from '@/shared/domain';
import { VALIDATION_MESSAGES as M } from '@/shared/validators/messages';
import type { ValidationResult } from '@/shared/validators/types';

type Id = string | null;

export interface ReembolsoValue {
  readonly estadoPago: string;
  readonly personaAReembolsarId: Id;
}

function isPendiente(estadoPago: string): boolean {
  return estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO;
}

export function personaAReembolsarRequerida(
  value: ReembolsoValue,
): ValidationResult {
  return isPendiente(value.estadoPago) && !value.personaAReembolsarId
    ? M.PERSONA_A_REEMBOLSAR
    : null;
}

export interface EstadoChange extends ReembolsoValue {
  readonly responsableId: Id;
}

/** Nuevo valor de la persona cuando cambia (o se inicializa) el estado de pago. */
export function personaAReembolsarOnEstadoChange(change: EstadoChange): Id {
  if (!isPendiente(change.estadoPago)) return null;
  return change.personaAReembolsarId || change.responsableId;
}

export interface ResponsableChange extends EstadoChange {
  readonly previousResponsableId: Id;
}

/** Nuevo valor de la persona cuando cambia el responsable. */
export function personaAReembolsarOnResponsableChange(
  change: ResponsableChange,
): Id {
  const followsResponsable =
    !change.personaAReembolsarId ||
    change.personaAReembolsarId === change.previousResponsableId;
  return isPendiente(change.estadoPago) && followsResponsable
    ? change.responsableId
    : change.personaAReembolsarId;
}
