'use client';

import type { Persona, PersonaType } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { fetchPersona } from '@/features/personas/services/personas-api';

const PERSONA_KEY_PREFIX = 'persona:';

export type PersonaOf<T extends PersonaType> = Extract<
  Persona,
  { readonly tipo: T }
>;

export interface PersonaByIdState<T extends PersonaType> {
  /** La persona si existe y es del tipo esperado. */
  readonly persona: PersonaOf<T> | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  /** Cargó, pero es de otro tipo (p. ej. un educador en el form de protagonista). */
  readonly wrongType: boolean;
}

function isTipo<T extends PersonaType>(
  persona: Persona,
  tipo: T,
): persona is PersonaOf<T> {
  return persona.tipo === tipo;
}

/**
 * `GET /personas/:id` (deep-link safe: Angular dependía del cache del listado).
 * Sin `id` (modo crear) no carga nada.
 */
export function usePersonaById<T extends PersonaType>(params: {
  readonly id: string | undefined;
  readonly tipo: T;
}): PersonaByIdState<T> {
  const { id, tipo } = params;
  const { data, error, isLoading } = useAsyncData<Persona>({
    key: `${PERSONA_KEY_PREFIX}${id ?? ''}`,
    load: (signal) => fetchPersona({ id: id ?? '', signal }),
    enabled: id !== undefined,
  });
  const persona = data && isTipo(data, tipo) ? data : null;
  return {
    persona,
    isLoading: isLoading && !data,
    error: data ? null : error,
    wrongType: data !== undefined && persona === null,
  };
}
