'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { FORM_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  campamentoFieldsSchema,
  campamentoFormSchema,
  toCampamentoDto,
  type CampamentoDraft,
  type CampamentoValues,
} from '@/features/campamentos/helpers/campamento-form';
import {
  createCampamento,
  updateCampamento,
} from '@/features/campamentos/services/campamentos-api';

type FieldName = keyof CampamentoDraft;
type FormErrors = Partial<Record<FieldName, string>>;

export interface CampamentoFormOptions {
  readonly initial: CampamentoDraft;
  /** Presente en edición. */
  readonly id?: string;
}

/** Rango inválido (inicio > fin): único issue `custom` sobre `fechaFin`. */
function rangeErrorOf(
  parsed: ReturnType<typeof campamentoFormSchema.safeParse>,
): string | undefined {
  if (parsed.success) return undefined;
  return parsed.error.issues.find(
    (issue) => issue.code === 'custom' && issue.path[0] === 'fechaFin',
  )?.message;
}

/** Crea o actualiza; devuelve el id guardado o `null` si falló (el toast global ya avisó). */
async function persist(values: CampamentoValues, id?: string): Promise<string | null> {
  const dto = toCampamentoDto(values);
  try {
    const saved = id ? await updateCampamento(id, dto) : await createCampamento(dto);
    notify.success(id ? C.UPDATED : C.CREATED);
    return saved.id;
  } catch {
    return null;
  }
}

/**
 * Estado del form de campamento: validación on-blur, submit deshabilitado si
 * el form es inválido (paridad) y navegación al detalle tras guardar. Los
 * errores del backend llegan por el toast global.
 */
export function useCampamentoForm({ initial, id }: CampamentoFormOptions) {
  const router = useRouter();
  const form = useFormState<CampamentoDraft>(initial);
  const validation = useFieldValidation(campamentoFieldsSchema);
  const [saving, setSaving] = useState(false);
  const parsed = campamentoFormSchema.safeParse(form.values);

  function update<K extends FieldName>(
    name: K,
    value: CampamentoDraft[K],
  ): void {
    form.setField(name, value);
    validation.onChange(name, value);
  }

  async function save(): Promise<void> {
    if (!parsed.success) return;
    setSaving(true);
    const savedId = await persist(parsed.data, id);
    if (savedId) router.push(CAMPAMENTO_ROUTES.detail(savedId));
    else setSaving(false);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!validation.validateAll(form.values)) return;
    void save();
  }

  const errors: FormErrors = {
    ...validation.errors,
    fechaFin: validation.errors.fechaFin ?? rangeErrorOf(parsed),
  };
  return {
    values: form.values,
    errors,
    valid: validation.valid,
    update,
    blur: (name: FieldName) => validation.onBlur(name, form.values[name]),
    submit,
    saving,
    canSubmit: parsed.success,
    cancel: () =>
      router.push(id ? CAMPAMENTO_ROUTES.detail(id) : CAMPAMENTO_ROUTES.LIST),
  };
}

export type CampamentoFormController = ReturnType<typeof useCampamentoForm>;
