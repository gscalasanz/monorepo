'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { TIPO_INSCRIPCION, type UpdateInscripcionDto } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import type {
  AutorizacionKey,
  Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { pickAutorizaciones } from '@/features/inscripciones/helpers/detail';
import {
  fetchInscripcionOrNull,
  updateInscripcion,
} from '@/features/inscripciones/services/inscripciones-api';

/** Editar inscripción: solo autorizaciones; los 5 booleans se mandan únicamente en Scout Argentina. */
export function useInscripcionEditForm(id: string) {
  const router = useRouter();
  const detail = useAsyncData({
    key: `inscripcion-edit:${id}`,
    load: (signal) => fetchInscripcionOrNull(id, signal),
  });
  const [edits, setEdits] = useState<Autorizaciones | null>(null);
  const [saving, setSaving] = useState(false);
  const inscripcion = detail.data ?? null;
  const autorizaciones =
    edits ?? (inscripcion ? pickAutorizaciones(inscripcion) : null);

  const setAutorizacion = (key: AutorizacionKey, value: boolean) => {
    if (autorizaciones) setEdits({ ...autorizaciones, [key]: value });
  };

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!inscripcion || !autorizaciones) return;
    const dto: UpdateInscripcionDto =
      inscripcion.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA
        ? autorizaciones
        : {};
    setSaving(true);
    try {
      await updateInscripcion(id, dto);
      notify.success(C.UPDATED);
      router.push(inscripcionRoutes.list);
    } catch {
      // El mensaje del backend ya aparece como toast global.
      setSaving(false);
    }
  }

  return {
    inscripcion,
    autorizaciones,
    setAutorizacion,
    submit,
    saving,
    isLoading: detail.isLoading && detail.data === undefined,
    error: detail.error,
    reload: detail.reload,
  };
}

export type InscripcionEditModel = ReturnType<typeof useInscripcionEditForm>;
