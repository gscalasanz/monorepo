'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { confirmDialog } from '@/shared/confirm';
import {
  ESTADO_PERSONA,
  isPersonaDisabled,
  type Persona,
} from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import {
  withEstado,
  withoutPersona,
  type ListedPersona,
} from '@/features/personas/helpers/list';
import { entityNameOf } from '@/features/personas/helpers/persona';
import {
  deletePersona,
  setPersonaEstado,
} from '@/features/personas/services/personas-api';

export type SetPersonas = (
  updater: (
    current: readonly Persona[] | undefined,
  ) => readonly Persona[] | undefined,
) => void;

interface RowActionParams {
  readonly persona: ListedPersona;
  readonly setPersonas: SetPersonas;
}

function estadoDialog(persona: ListedPersona) {
  const habilitar = isPersonaDisabled(persona);
  return {
    estado: habilitar ? ESTADO_PERSONA.ACTIVO : ESTADO_PERSONA.INACTIVO,
    title: habilitar ? C.ENABLE_TITLE : C.DISABLE_TITLE,
    message: habilitar
      ? C.ENABLE_MESSAGE(persona.nombre)
      : C.DISABLE_MESSAGE(persona.nombre),
    confirmText: habilitar ? C.ACTION_ENABLE : C.ACTION_DISABLE,
    success: habilitar ? C.ENABLED_OK : C.DISABLED_OK,
  };
}

/** Confirma y deshabilita/rehabilita; el error del backend se ve dentro del diálogo. */
export async function toggleEstado({
  persona,
  setPersonas,
}: RowActionParams): Promise<void> {
  const dialog = estadoDialog(persona);
  const result = await confirmDialog.run({
    title: dialog.title,
    message: dialog.message,
    confirmText: dialog.confirmText,
    action: () => setPersonaEstado({ id: persona.id, estado: dialog.estado }),
  });
  if (!result.confirmed) return;
  setPersonas((current) =>
    withEstado({
      personas: current ?? [],
      id: persona.id,
      estado: dialog.estado,
    }),
  );
  notify.success(dialog.success);
}

/** `confirmDelete` por tipo; el 400 ("es responsable de N movimiento(s)") se ve en el diálogo. */
export async function removePersona({
  persona,
  setPersonas,
}: RowActionParams): Promise<void> {
  const result = await confirmDialog.runDelete(entityNameOf(persona.tipo), {
    action: () => deletePersona(persona.id),
  });
  if (!result.confirmed) return;
  setPersonas((current) =>
    withoutPersona({ personas: current ?? [], id: persona.id }),
  );
  notify.success(C.DELETED_OK);
}

export interface PersonaRowActions {
  readonly view: (persona: ListedPersona) => void;
  readonly edit: (persona: ListedPersona) => void;
  readonly toggleEstado: (persona: ListedPersona) => Promise<void>;
  readonly remove: (persona: ListedPersona) => Promise<void>;
}

/** Acciones de cada fila: ver, editar, deshabilitar/rehabilitar y eliminar. */
export function usePersonaRowActions(
  setPersonas: SetPersonas,
): PersonaRowActions {
  const router = useRouter();
  return useMemo(
    () => ({
      view: (persona) =>
        router.push(
          PERSONA_ROUTES.detail({ tipo: persona.tipo, id: persona.id }),
        ),
      edit: (persona) =>
        router.push(
          PERSONA_ROUTES.edit({ tipo: persona.tipo, id: persona.id }),
        ),
      toggleEstado: (persona) => toggleEstado({ persona, setPersonas }),
      remove: (persona) => removePersona({ persona, setPersonas }),
    }),
    [router, setPersonas],
  );
}
