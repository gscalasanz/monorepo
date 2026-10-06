'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { z } from 'zod';

import { useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';

export interface PersonaFormOptions<
  S extends z.AnyZodObject,
  V extends object,
> {
  readonly schema: S;
  readonly initial: V;
  /** Llamada al backend con la salida validada por el schema. */
  readonly save: (parsed: z.output<S>) => Promise<unknown>;
  readonly successMessage: string;
  /** Validación extra (cruzada) al enviar: `false` corta el submit. */
  readonly extraCheck?: (values: V) => boolean;
}

/**
 * Estado + validación + guardado de un form de persona. Al guardar: toast de
 * éxito y vuelta a `/personas` (como Angular). Si falla, el error lo muestra el
 * toast global del `apiClient` y el form queda editable.
 */
export function usePersonaForm<S extends z.AnyZodObject, V extends object>(
  options: PersonaFormOptions<S, V>,
): PersonaForm<V> {
  const router = useRouter();
  const form = useFormState<V>(options.initial);
  const validation = useFieldValidation(options.schema);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof V & string>(name: K, value: V[K]): void {
    form.setField(name, value);
    validation.onChange(name, value);
  }

  function blur(name: keyof V & string): void {
    validation.onBlur(name, form.values[name]);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const fieldsOk = validation.validateAll(form.values);
    const extraOk = options.extraCheck?.(form.values) ?? true;
    const parsed = options.schema.safeParse(form.values);
    if (!fieldsOk || !extraOk || !parsed.success) return;
    setSaving(true);
    try {
      await options.save(parsed.data);
      notify.success(options.successMessage);
      router.push(PERSONA_ROUTES.LIST);
    } catch {
      // El apiClient ya publicó el error global (toast con el mensaje de NestJS).
      setSaving(false);
    }
  }

  return {
    values: form.values,
    errors: validation.errors,
    valid: validation.valid,
    update,
    blur,
    submit,
    saving,
  };
}

export interface PersonaForm<V extends object> {
  readonly values: V;
  readonly errors: Readonly<Record<string, string>>;
  readonly valid: Readonly<Record<string, boolean>>;
  readonly update: <K extends keyof V & string>(name: K, value: V[K]) => void;
  readonly blur: (name: keyof V & string) => void;
  readonly submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  readonly saving: boolean;
}
