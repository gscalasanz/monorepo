'use client';

import { useState, type FormEvent } from 'react';

import { useDialogSubmit } from '@/shared/components/finanzas';
import { useAsyncData } from '@/shared/hooks';
import { fetchSaldoFondoSolidario } from '@/shared/queries';
import { BONIFICAR_COPY as C } from '@/features/inscripciones/constants/copy';
import { summarizeBonificar } from '@/features/inscripciones/helpers/pago';

export interface BonificarDialogOptions {
  readonly onOpenChange: (open: boolean) => void;
  readonly montoTotal: number;
  readonly bonificadoActual: number;
  /** Monto total bonificado deseado (no un delta). Si rechaza, el diálogo queda abierto. */
  readonly onSubmit: (monto: number) => Promise<void>;
}

const FONDO_KEY = 'bonificar:fondo-solidario';

/** Estado del diálogo "Bonificar Inscripción" (saldo del fondo, validación del delta, envío). */
export function useBonificarDialog(options: BonificarDialogOptions) {
  const { montoTotal, bonificadoActual } = options;
  const [monto, setMonto] = useState<number | null>(bonificadoActual);
  const fondo = useAsyncData({
    key: FONDO_KEY,
    load: fetchSaldoFondoSolidario,
  });
  const saldoFondo = fondo.data ?? 0;
  const summary = summarizeBonificar(monto, {
    montoTotal,
    bonificadoActual,
    saldoFondo,
  });
  const dialog = useDialogSubmit<number>({
    onSubmit: options.onSubmit,
    onOpenChange: options.onOpenChange,
  });
  const fieldError = summary.excedeTotal
    ? C.EXCEDE_TOTAL
    : summary.saldoInsuficiente
      ? C.FONDO_INSUFICIENTE
      : undefined;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (summary.canConfirm && monto !== null) void dialog.submit(monto);
  };
  return {
    monto,
    setMonto,
    saldoFondo,
    summary,
    dialog,
    fieldError,
    submit,
    canConfirm: summary.canConfirm && !fondo.isLoading,
  };
}

export type BonificarDialogModel = ReturnType<typeof useBonificarDialog>;
