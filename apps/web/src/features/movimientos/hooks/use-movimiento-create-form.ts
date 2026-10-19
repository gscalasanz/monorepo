'use client';

import { useState, type FormEvent } from 'react';

import type { CajaConSaldo } from '@/shared/domain';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { todayBsAs } from '@/shared/time';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  initialCreateValues,
  toCreateDto,
} from '@/features/movimientos/helpers/form-mappers';
import {
  applyCreateChange,
  reembolsoError,
  withReembolsoError,
} from '@/features/movimientos/helpers/form-transitions';
import {
  movimientoCreateSchema,
  type MovimientoCreateValues,
} from '@/features/movimientos/models/form-schemas';
import { createMovimiento } from '@/features/movimientos/services/movimientos-api';
import { useSaveAction } from '@/features/movimientos/hooks/use-save-action';

type Values = MovimientoCreateValues;

const SAVE_MESSAGES = { success: C.CREATED, error: C.CREATE_ERROR } as const;

/** Form de alta (port de `MovimientoFormComponent` en modo crear). */
export function useMovimientoCreateForm(params: {
  readonly cajas: readonly CajaConSaldo[];
  readonly initialCajaId: string | null;
}) {
  const form = useFormState<Values>(
    initialCreateValues({
      cajas: params.cajas,
      cajaId: params.initialCajaId,
      today: todayBsAs(),
    }),
  );
  const validation = useFieldValidation(movimientoCreateSchema);
  const [showReembolsoError, setShowReembolsoError] = useState(false);
  const save = useSaveAction(SAVE_MESSAGES);

  function update<K extends keyof Values>(name: K, value: Values[K]): void {
    form.setValues(applyCreateChange(form.values, { name, value }));
    validation.onChange(name, value);
    if (name === 'personaAReembolsarId') setShowReembolsoError(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const fieldsOk = validation.validateAll(form.values);
    const reembolsoOk = !reembolsoError(form.values);
    setShowReembolsoError(!reembolsoOk);
    const parsed = movimientoCreateSchema.safeParse(form.values);
    if (!fieldsOk || !reembolsoOk || !parsed.success) return;
    await save.run(() => createMovimiento(toCreateDto(parsed.data)));
  }

  return {
    values: form.values,
    errors: withReembolsoError({
      errors: validation.errors,
      values: form.values,
      show: showReembolsoError,
    }),
    valid: validation.valid,
    update,
    blur: (name: keyof Values) => validation.onBlur(name, form.values[name]),
    submit,
    saving: save.saving,
    cancel: save.cancel,
  };
}

export type MovimientoCreateForm = ReturnType<typeof useMovimientoCreateForm>;
