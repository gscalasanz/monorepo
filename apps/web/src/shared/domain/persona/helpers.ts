/**
 * Personas deshabilitadas (port de `shared/utils/persona-estado.util.ts`): un
 * deshabilitado no se ofrece en selectores de alta, pero sigue visible en todo
 * registro histórico, listado y deuda.
 */
import { ESTADO_PERSONA, type EstadoPersona } from '@/shared/domain/persona/enums';

/** Cualquier cosa que exponga el estado de una persona (persona, propietario de caja…). */
export interface WithEstado {
  readonly estado?: EstadoPersona;
}

export function isPersonaDisabled(persona: WithEstado): boolean {
  return persona.estado === ESTADO_PERSONA.INACTIVO;
}

export function onlyEnabled<T extends WithEstado>(personas: readonly T[]): T[] {
  return personas.filter((persona) => !isPersonaDisabled(persona));
}
