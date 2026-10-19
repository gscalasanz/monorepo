/**
 * Transiciones puras de los forms: cada cambio de campo devuelve un objeto
 * nuevo con los campos dependientes ajustados (concepto según tipo, persona a
 * reembolsar según estado/responsable, port de `syncPersonaAReembolsarRequerida`).
 */
import type { EstadoPago } from '@/shared/domain';
import {
  personaAReembolsarOnEstadoChange,
  personaAReembolsarOnResponsableChange,
  personaAReembolsarRequerida,
} from '@/shared/validators';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { conceptoForTipo } from '@/features/movimientos/helpers/form-mappers';
import type { MovimientoCreateValues } from '@/features/movimientos/models/form-schemas';

export interface FieldChange<V, K extends keyof V = keyof V> {
  readonly name: K;
  readonly value: V[K];
}

/** Nuevo estado del alta tras cambiar un campo. */
export function applyCreateChange<K extends keyof MovimientoCreateValues>(
  values: MovimientoCreateValues,
  change: FieldChange<MovimientoCreateValues, K>,
): MovimientoCreateValues {
  const next: MovimientoCreateValues = {
    ...values,
    [change.name]: change.value,
  };
  if (change.name === 'tipo') {
    return {
      ...next,
      concepto: conceptoForTipo({ concepto: values.concepto, tipo: next.tipo }),
    };
  }
  if (change.name === 'estadoPago') {
    return {
      ...next,
      personaAReembolsarId: personaAReembolsarOnEstadoChange(next),
    };
  }
  if (change.name === 'responsableId') {
    const personaAReembolsarId = personaAReembolsarOnResponsableChange({
      ...next,
      previousResponsableId: values.responsableId,
    });
    return { ...next, personaAReembolsarId };
  }
  return next;
}

interface ReembolsoFields {
  readonly estadoPago: EstadoPago;
  readonly personaAReembolsarId: string | null;
}

/** Nuevo estado tras cambiar el estado de pago con un responsable fijo (edición). */
export function applyEstadoChange<V extends ReembolsoFields>(params: {
  readonly values: V;
  readonly estadoPago: EstadoPago;
  readonly responsableId: string | null;
}): V {
  const { values, estadoPago, responsableId } = params;
  const personaAReembolsarId = personaAReembolsarOnEstadoChange({
    estadoPago,
    personaAReembolsarId: values.personaAReembolsarId,
    responsableId,
  });
  return { ...values, estadoPago, personaAReembolsarId };
}

/** Error visible de "persona a reembolsar" (copy del template de Angular) o `undefined`. */
export function reembolsoError(values: ReembolsoFields): string | undefined {
  return personaAReembolsarRequerida(values)
    ? C.PERSONA_REEMBOLSO_REQUIRED
    : undefined;
}

export type FormErrors = Readonly<Record<string, string | undefined>>;

/** Errores de campo + el de "persona a reembolsar" (visible tras submit). */
export function withReembolsoError(params: {
  readonly errors: Readonly<Record<string, string>>;
  readonly values: ReembolsoFields;
  readonly show: boolean;
}): FormErrors {
  const personaAReembolsarId = params.show ? reembolsoError(params.values) : undefined;
  return { ...params.errors, personaAReembolsarId };
}
