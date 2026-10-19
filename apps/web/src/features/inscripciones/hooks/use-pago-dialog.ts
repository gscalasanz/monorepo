'use client';

import { useState, type FormEvent } from 'react';

import { useDialogSubmit } from '@/shared/components/finanzas';
import { MEDIO_PAGO, type PagoInscripcionDto } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { fetchSaldoPersonal } from '@/shared/queries';
import {
  buildPagoDto,
  summarizePagoCreate,
  usarTodoPago,
  type PagoCreateValues,
} from '@/features/inscripciones/helpers/pago';

export interface PagoDialogOptions {
  readonly onOpenChange: (open: boolean) => void;
  readonly personaId: string;
  readonly pendiente: number;
  /** Si rechaza, el diálogo queda abierto con el mensaje. */
  readonly onSubmit: (dto: PagoInscripcionDto) => Promise<void>;
}

const INITIAL: PagoCreateValues = {
  montoPagado: 0,
  montoConSaldoPersonal: 0,
  medioPago: MEDIO_PAGO.EFECTIVO,
  descripcion: '',
};

/** "Registrar Pago": efectivo/transferencia + saldo personal, sin superar el pendiente. */
export function usePagoDialog(options: PagoDialogOptions) {
  const [values, setValues] = useState<PagoCreateValues>(INITIAL);
  const saldo = useAsyncData({
    key: `pago-dialog:saldo:${options.personaId}`,
    load: (signal) => fetchSaldoPersonal(options.personaId, signal),
  });
  const saldoPersonal = saldo.error ? 0 : (saldo.data ?? 0);
  const context = { pendiente: options.pendiente, saldoPersonal };
  const summary = summarizePagoCreate(values, context);
  const dialog = useDialogSubmit<PagoInscripcionDto>({
    onSubmit: options.onSubmit,
    onOpenChange: options.onOpenChange,
  });

  const setField = <K extends keyof PagoCreateValues>(
    name: K,
    value: PagoCreateValues[K],
  ) => setValues((prev) => ({ ...prev, [name]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { medioPago } = values;
    if (!summary.invalid && medioPago !== null)
      void dialog.submit(buildPagoDto({ ...values, medioPago }));
  };

  return {
    values,
    setField,
    saldoPersonal,
    saldoLoading: saldo.isLoading,
    summary,
    dialog,
    submit,
    usarTodo: () => setValues((prev) => usarTodoPago(prev, context)),
  };
}

export type PagoDialogModel = ReturnType<typeof usePagoDialog>;
