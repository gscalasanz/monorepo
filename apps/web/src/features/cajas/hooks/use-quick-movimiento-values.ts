'use client';

import { useState } from 'react';

import type { TipoMovimiento } from '@/shared/domain';
import { useFieldValidation, useFormState } from '@/shared/forms';
import {
  QUICK_MOVIMIENTO_INITIAL,
  withEstadoPago,
  withResponsable,
  withTipo,
} from '@/features/cajas/helpers/quick-movimiento';
import {
  quickMovimientoSchema,
  type QuickEstadoPago,
  type QuickMovimientoFormValues,
} from '@/features/cajas/models/schemas';

type Values = QuickMovimientoFormValues;

/** Valores + validación del movimiento rápido, con las reglas de tipo/estado/responsable. */
export function useQuickMovimientoValues() {
  const form = useFormState<Values>(QUICK_MOVIMIENTO_INITIAL);
  const validation = useFieldValidation(quickMovimientoSchema);
  const [reembolsoError, setReembolsoError] = useState<string | null>(null);
  const { values } = form;

  const apply = (next: Values): void => {
    form.setValues(next);
    setReembolsoError(null);
  };

  return {
    values,
    validation,
    reembolsoError,
    setReembolsoError,
    update: <K extends keyof Values>(name: K, value: Values[K]): void => {
      form.setField(name, value);
      validation.onChange(name, value);
    },
    setTipo: (tipo: TipoMovimiento) => apply(withTipo(values, tipo)),
    setEstadoPago: (estado: QuickEstadoPago) =>
      apply(withEstadoPago(values, estado)),
    setResponsable: (id: string | null) => {
      apply(withResponsable(values, id));
      validation.onChange('responsableId', id);
    },
    setPersonaAReembolsar: (id: string | null) =>
      apply({ ...values, personaAReembolsarId: id }),
  };
}
