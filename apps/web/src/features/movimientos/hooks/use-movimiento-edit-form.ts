'use client';

import { useState, type FormEvent } from 'react';

import type { EstadoPago, Movimiento } from '@/shared/domain';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  initialEditValues,
  toUpdateDto,
} from '@/features/movimientos/helpers/form-mappers';
import {
  applyEstadoChange,
  reembolsoError,
  withReembolsoError,
} from '@/features/movimientos/helpers/form-transitions';
import {
  movimientoEditSchema,
  type MovimientoEditValues,
} from '@/features/movimientos/models/form-schemas';
import { updateMovimiento } from '@/features/movimientos/services/movimientos-api';
import { useSaveAction } from '@/features/movimientos/hooks/use-save-action';

type Values = MovimientoEditValues;

const SAVE_MESSAGES = { success: C.UPDATED, error: C.UPDATE_ERROR } as const;

/**
 * Form de edición: descripción, estado, persona a reembolsar y comprobante.
 * La persona a reembolsar se precarga con el responsable (si está en el selector).
 */
export function useMovimientoEditForm(params: {
  readonly movimiento: Movimiento;
  readonly selectableIds: ReadonlySet<string>;
}) {
  const { movimiento, selectableIds } = params;
  const form = useFormState<Values>(initialEditValues(movimiento));
  const validation = useFieldValidation(movimientoEditSchema);
  const [showReembolsoError, setShowReembolsoError] = useState(false);
  const save = useSaveAction(SAVE_MESSAGES);
  const responsableId = selectableIds.has(movimiento.responsableId)
    ? movimiento.responsableId
    : null;

  function update<K extends keyof Values>(name: K, value: Values[K]): void {
    form.setField(name, value);
    validation.onChange(name, value);
    if (name === 'personaAReembolsarId') setShowReembolsoError(false);
  }

  function updateEstado(estadoPago: EstadoPago): void {
    form.setValues(
      applyEstadoChange({ values: form.values, estadoPago, responsableId }),
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const fieldsOk = validation.validateAll(form.values);
    const reembolsoOk = !reembolsoError(form.values);
    setShowReembolsoError(!reembolsoOk);
    if (!fieldsOk || !reembolsoOk) return;
    await save.run(() =>
      updateMovimiento(movimiento.id, toUpdateDto(form.values)),
    );
  }

  return {
    values: form.values,
    errors: withReembolsoError({
      errors: validation.errors,
      values: form.values,
      show: showReembolsoError,
    }),
    update,
    updateEstado,
    blur: (name: keyof Values) => validation.onBlur(name, form.values[name]),
    submit,
    saving: save.saving,
    cancel: save.cancel,
  };
}

export type MovimientoEditForm = ReturnType<typeof useMovimientoEditForm>;
