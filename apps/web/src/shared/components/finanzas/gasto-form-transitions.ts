/**
 * Transiciones puras del draft de gasto: la persona a reembolsar se precarga con
 * el responsable y lo sigue salvo elección manual; se limpia al volver a "Pagado"
 * (reglas de `@/shared/validators/persona-reembolso`). Siempre devuelven un draft nuevo.
 */
import {
  personaAReembolsarOnEstadoChange,
  personaAReembolsarOnResponsableChange,
} from '@/shared/validators';

import type { GastoEstadoPago, GastoFormDraft } from './gasto-form-schema';

export function withResponsable(
  draft: GastoFormDraft,
  responsableId: string | null,
): GastoFormDraft {
  const personaAReembolsarId = personaAReembolsarOnResponsableChange({
    estadoPago: draft.estadoPago ?? '',
    personaAReembolsarId: draft.personaAReembolsarId,
    responsableId,
    previousResponsableId: draft.responsableId,
  });
  return { ...draft, responsableId, personaAReembolsarId };
}

export function withEstadoPago(
  draft: GastoFormDraft,
  estadoPago: GastoEstadoPago | null,
): GastoFormDraft {
  const personaAReembolsarId = personaAReembolsarOnEstadoChange({
    estadoPago: estadoPago ?? '',
    personaAReembolsarId: draft.personaAReembolsarId,
    responsableId: draft.responsableId,
  });
  return { ...draft, estadoPago, personaAReembolsarId };
}
