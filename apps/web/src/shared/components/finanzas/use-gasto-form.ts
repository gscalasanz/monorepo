'use client';

import { useState, type FormEvent } from 'react';

import {
  collectFieldErrors,
  useFieldValidation,
  useFormState,
} from '@/shared/forms';

import {
  gastoFieldsSchema,
  gastoFormSchema,
  initialGastoDraft,
  type GastoEstadoPago,
  type GastoFormDraft,
  type GastoFormValues,
} from './gasto-form-schema';
import { withEstadoPago, withResponsable } from './gasto-form-transitions';

type FieldName = keyof GastoFormDraft;
type GastoFormErrors = Partial<Record<FieldName, string>>;

/** Estado del form de gasto (validación on-blur + regla cruzada de reembolso al enviar). */
export function useGastoForm(onValid: (values: GastoFormValues) => void) {
  const [initial] = useState(initialGastoDraft);
  const form = useFormState<GastoFormDraft>(initial);
  const validation = useFieldValidation(gastoFieldsSchema);
  const [reembolsoError, setReembolsoError] = useState<string | undefined>();
  const { values } = form;

  function update<K extends FieldName>(
    name: K,
    value: GastoFormDraft[K],
  ): void {
    form.setField(name, value);
    validation.onChange(name, value);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    validation.validateAll(values);
    const result = gastoFormSchema.safeParse(values);
    if (result.success) onValid(result.data);
    else
      setReembolsoError(collectFieldErrors(result.error).personaAReembolsarId);
  }

  const errors: GastoFormErrors = {
    ...validation.errors,
    personaAReembolsarId: reembolsoError,
  };
  return {
    values,
    errors,
    valid: validation.valid,
    update,
    blur: (name: FieldName) => validation.onBlur(name, values[name]),
    setResponsable: (responsableId: string | null) => {
      form.setValues(withResponsable(values, responsableId));
      validation.onChange('responsableId', responsableId);
    },
    setEstadoPago: (estadoPago: GastoEstadoPago | null) => {
      form.setValues(withEstadoPago(values, estadoPago));
      validation.onChange('estadoPago', estadoPago);
      setReembolsoError(undefined);
    },
    setPersonaAReembolsar: (personaAReembolsarId: string | null) => {
      form.setField('personaAReembolsarId', personaAReembolsarId);
      setReembolsoError(undefined);
    },
    submit,
  };
}

export type GastoFormController = ReturnType<typeof useGastoForm>;
