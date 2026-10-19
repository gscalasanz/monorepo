'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { confirmDialog } from '@/shared/confirm';
import { PERSONA_TYPE } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { EXTERNA_DETAIL_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { entityNameOf } from '@/features/personas/helpers/persona';
import { usePersonaById } from '@/features/personas/hooks/use-persona-by-id';
import { deletePersona } from '@/features/personas/services/personas-api';

/** Detalle de persona externa: carga por id + editar/eliminar. */
export function usePersonaExternaDetail(id: string) {
  const router = useRouter();
  const state = usePersonaById({ id, tipo: PERSONA_TYPE.EXTERNA });

  const edit = useCallback(() => {
    router.push(PERSONA_ROUTES.edit({ tipo: PERSONA_TYPE.EXTERNA, id }));
  }, [router, id]);

  const remove = useCallback(async (): Promise<void> => {
    const result = await confirmDialog.runDelete(
      entityNameOf(PERSONA_TYPE.EXTERNA),
      {
        action: () => deletePersona(id),
      },
    );
    if (!result.confirmed) return;
    notify.success(C.DELETED_OK);
    router.push(PERSONA_ROUTES.LIST);
  }, [router, id]);

  return { ...state, edit, remove };
}
