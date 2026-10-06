'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import {
  eventoFormSchema,
  toEventoDto,
  type EventoFormDraft,
  type EventoFormValues,
} from '@/features/eventos/helpers/evento-form';
import {
  createEvento,
  updateEvento,
} from '@/features/eventos/services/eventos-api';

const C = EVENTOS_COPY.form;

interface UseEventoFormOptions {
  readonly initial: EventoFormDraft;
  /** Presente = edición (`PATCH`); ausente = alta (`POST`). */
  readonly eventoId?: string;
}

async function save(
  values: EventoFormValues,
  eventoId?: string,
): Promise<string> {
  const dto = toEventoDto(values);
  if (eventoId) {
    await updateEvento({ id: eventoId, dto });
    notify.success(C.updated);
    return eventoId;
  }
  const created = await createEvento(dto);
  notify.success(C.created);
  return created.id;
}

/** Estado, validación on-blur y guardado del form de evento. */
export function useEventoForm({ initial, eventoId }: UseEventoFormOptions) {
  const router = useRouter();
  const form = useFormState<EventoFormDraft>(initial);
  const validation = useFieldValidation(eventoFormSchema);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { values } = form;

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    validation.validateAll(values);
    const parsed = eventoFormSchema.safeParse(values);
    if (!parsed.success) return;
    setSaving(true);
    setError(null);
    try {
      router.push(EVENTOS_ROUTES.detail(await save(parsed.data, eventoId)));
    } catch (cause) {
      setError(
        extractErrorMessage(cause) ||
          (eventoId ? C.updateError : C.createError),
      );
      setSaving(false);
    }
  };

  return {
    values,
    errors: validation.errors,
    saving,
    error,
    update: <K extends keyof EventoFormDraft>(
      name: K,
      value: EventoFormDraft[K],
    ) => {
      form.setField(name, value);
      validation.onChange(name, value);
    },
    blur: (name: keyof EventoFormDraft) =>
      validation.onBlur(name, values[name]),
    submit,
  };
}

export type EventoFormState = ReturnType<typeof useEventoForm>;
