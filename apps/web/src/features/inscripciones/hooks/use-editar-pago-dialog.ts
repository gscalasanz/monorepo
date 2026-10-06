'use client';

import { useState, type FormEvent } from 'react';

import { useDialogSubmit } from '@/shared/components/finanzas';
import type { MovimientoInscripcion } from '@/shared/domain';
import {
  buildUpdatePagoDto,
  summarizePagoEdit,
  type PagoEditValues,
} from '@/features/inscripciones/helpers/pago';
import type { UpdatePagoDto } from '@/features/inscripciones/services/inscripciones-api';

export interface EditarPagoDialogOptions {
  readonly onOpenChange: (open: boolean) => void;
  readonly movimiento: MovimientoInscripcion;
  readonly pendiente: number;
  readonly onSubmit: (dto: UpdatePagoDto) => Promise<void>;
  /** "Eliminar" (sin confirmación, como Angular). */
  readonly onDelete: () => Promise<void>;
}

/** "Editar Pago": monto ≥1 y ≤ pendiente + original, medio, descripción; o eliminar. */
export function useEditarPagoDialog(options: EditarPagoDialogOptions) {
  const { movimiento, pendiente, onOpenChange } = options;
  const [values, setValues] = useState<PagoEditValues>({
    monto: movimiento.monto,
    medioPago: movimiento.medioPago,
    descripcion: movimiento.descripcion ?? '',
  });
  const summary = summarizePagoEdit(values, {
    pendiente,
    original: movimiento.monto,
  });
  const save = useDialogSubmit<UpdatePagoDto>({
    onSubmit: options.onSubmit,
    onOpenChange,
  });
  const remove = useDialogSubmit<null>({
    onSubmit: options.onDelete,
    onOpenChange,
  });
  const busy = save.saving || remove.saving;

  const setField = <K extends keyof PagoEditValues>(
    name: K,
    value: PagoEditValues[K],
  ) => setValues((prev) => ({ ...prev, [name]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { medioPago } = values;
    if (!summary.invalid && medioPago !== null)
      void save.submit(buildUpdatePagoDto({ ...values, medioPago }));
  };

  return {
    values,
    setField,
    summary,
    submit,
    saving: busy,
    deleting: remove.saving,
    error: save.error ?? remove.error,
    handleOpenChange: busy ? () => undefined : save.handleOpenChange,
    remove: () => void remove.submit(null),
  };
}

export type EditarPagoDialogModel = ReturnType<typeof useEditarPagoDialog>;
