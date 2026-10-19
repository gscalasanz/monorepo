'use client';

import { Gift } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';

import { Money } from '@/shared/components/data';
import { FormDialogShell, useDialogSubmit } from '@/shared/components/finanzas';
import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import type { ParticipantePago } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { fetchSaldoFondoSolidario } from '@/shared/queries';
import { DialogSummary } from '@/features/campamentos/components/dialog-summary';
import {
  BONIFICAR_COPY as C,
  PAGO_COPY,
} from '@/features/campamentos/constants/copy';
import {
  bonificarState,
  type BonificarContext,
  type BonificarState,
} from '@/features/campamentos/helpers/bonificar';

const FONDO_KEY = 'fondo-solidario-saldo';

export interface BonificarDialogProps {
  readonly participante: ParticipantePago;
  readonly onOpenChange: (open: boolean) => void;
  /** `monto` es el TOTAL bonificado deseado (0 = quitar). */
  readonly onSubmit: (params: {
    readonly personaId: string;
    readonly monto: number;
  }) => Promise<void>;
}

function summaryRows(ctx: BonificarContext, saldoInsuficiente: boolean) {
  return [
    { label: C.MONTO_ASIGNADO, value: <Money amount={ctx.montoAsignado} /> },
    ...(ctx.totalPagado > 0
      ? [{ label: C.YA_PAGADO, value: <Money amount={ctx.totalPagado} /> }]
      : []),
    {
      label: C.SALDO_FONDO,
      value: (
        <Money
          amount={ctx.saldoFondo}
          tone={saldoInsuficiente ? 'debt' : undefined}
        />
      ),
      highlight: true,
    },
  ];
}

function montoError(state: BonificarState, fondoCargado: boolean): string | undefined {
  if (state.excedeAsignado) return C.excede(state.maxBonificable);
  return state.saldoInsuficiente && fondoCargado ? C.SALDO_INSUFICIENTE : undefined;
}

function useBonificarForm({ participante, onOpenChange, onSubmit }: BonificarDialogProps) {
  const fondo = useAsyncData({ key: FONDO_KEY, load: fetchSaldoFondoSolidario });
  const [monto, setMonto] = useState<number | null>(participante.montoBonificado);
  const ctx: BonificarContext = {
    montoAsignado: participante.montoAsignado,
    montoBonificadoActual: participante.montoBonificado,
    totalPagado: participante.totalPagado,
    saldoFondo: fondo.data ?? 0,
  };
  const state = bonificarState(ctx, monto);
  const dialog = useDialogSubmit({ onSubmit, onOpenChange });
  const canConfirm = state.puedeConfirmar && fondo.data !== undefined;
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canConfirm) void dialog.submit({ personaId: participante.id, monto: state.monto });
  };
  const error = montoError(state, fondo.data !== undefined);
  return { fondo, monto, setMonto, ctx, state, dialog, canConfirm, onFormSubmit, error };
}

/** "Bonificar Participante" contra el fondo solidario (monto total, no delta). */
export function BonificarDialog(props: BonificarDialogProps) {
  const formId = useId();
  const f = useBonificarForm(props);
  return (
    <FormDialogShell
      open
      onOpenChange={f.dialog.handleOpenChange}
      title={C.TITLE}
      icon={<Gift aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.SUBMIT}
      saving={f.dialog.saving}
      error={f.dialog.error ?? f.fondo.error}
      submitDisabled={!f.canConfirm}
    >
      <form id={formId} noValidate className="flex flex-col gap-4" onSubmit={f.onFormSubmit}>
        <DialogSummary
          nombre={props.participante.nombre}
          caption={PAGO_COPY.PARTICIPANTE}
          rows={summaryRows(f.ctx, f.state.saldoInsuficiente)}
        />
        <MoneyField
          label={C.MONTO}
          required
          size="md"
          helper={C.maximo(f.state.maxBonificable)}
          value={f.monto}
          onChange={f.setMonto}
          error={f.error}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="self-start"
          onClick={() => f.setMonto(f.state.maxBonificable)}
        >
          {C.bonificarTodo(f.state.maxBonificable)}
        </Button>
      </form>
    </FormDialogShell>
  );
}
