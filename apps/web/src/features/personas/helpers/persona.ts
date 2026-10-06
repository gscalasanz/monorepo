/** Helpers de identidad de persona (nombre de entidad, iniciales). */
import { LOCALE } from '@/shared/constants';
import { PERSONA_TYPE, type PersonaType } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';

const ENTITY_NAMES: Readonly<Record<PersonaType, string>> = {
  [PERSONA_TYPE.PROTAGONISTA]: C.ENTITY_PROTAGONISTA,
  [PERSONA_TYPE.EDUCADOR]: C.ENTITY_EDUCADOR,
  [PERSONA_TYPE.EXTERNA]: C.ENTITY_EXTERNA,
  [PERSONA_TYPE.AGRUPACION]: C.ENTITY_AGRUPACION,
};

/** Nombre de entidad del `confirmDelete` ("protagonista", "persona externa"…). */
export function entityNameOf(tipo: PersonaType): string {
  return ENTITY_NAMES[tipo];
}

const MAX_INITIALS = 2;

/** "Valentina Ríos" → "VR"; una sola palabra → su inicial. */
export function initialsOf(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toLocaleUpperCase(LOCALE))
    .join('');
}
