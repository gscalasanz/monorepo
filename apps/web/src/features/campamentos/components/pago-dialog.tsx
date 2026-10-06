'use client';

import { Wallet } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';

import { Money } from '@/shared/components/data';
import { FormDialogShell, useDialogSubmit } from '@/shared/components/finanzas';
import type {
  ParticipantePago,
  RegistrarPagoCampamentoDto,
} from '@/shared/domain';
import { DialogSummary } from '@/features/campamentos/components/dialog-summary';
import { PagoFields } from '@/features/campamentos/components/pago-fields';
import { ProgressBar } from '@/features/campamentos/components/progress-bar';
import { PAGO_COPY as C } from '@/features/campamentos/constants/copy';
import { pagoContextOf } from '@/features/campamentos/helpers/detalle';
import {
  INITIAL_PAGO_DRAFT,
  pagoSummary,
  toPagoDto,
  type PagoContext,
  type PagoDraft,
} from '@/features/campamentos/helpers/pago';

export interface PagoDialogProps {
  readonly participante: ParticipantePago;
  readonly saldoCuentaPersonal: number;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (params: {
    readonly personaId: string;
    readonly dto: RegistrarPagoCampamentoDto;
  }) => Promise<void>;
}

function summaryRows(ctx: PagoContext) {
  return [
    { label: C.COSTO, value: <Money amount={ctx.costoPorPersona} /> },
    { label: C.TOTAL_PAGADO, value: <Money amount={ctx.totalPagado} /> },
    {
      label: C.SALDO_PENDIENTE,
      value: (
        <Money
          amount={ctx.montoPendiente}
          tone={ctx.montoPendiente > 0 ? 'debt' : undefined}
        />
      ),
    },
    ...(ctx.saldoCuentaPersonal > 0
      ? [
          {
            label: C.SALDO_PERSONAL,
            value: <Money amount={ctx.saldoCuentaPersonal} />,
            highlight: true,
          },
        ]
      : []),
  ];
}

function usePagoForm({ participante, saldoCuentaPersonal, onOpenChange, onSubmit }: PagoDialogProps) {
  const ctx = pagoContextOf(participante, saldoCuentaPersonal);
  const [draft, setDraft] = useState<PagoDraft>(INITIAL_PAGO_DRAFT);
  const summary = pagoSummary(ctx, draft);
  const dialog = useDialogSubmit({ onSubmit, onOpenChange });
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (summary.invalid) return;
    void dialog.submit({ personaId: participante.id, dto: toPagoDto(ctx, draft) });
  };
  const patch = (next: Partial<PagoDraft>) => setDraft((current) => ({ ...current, ...next }));
  return { ctx, draft, summary, dialog, onFormSubmit, patch };
}

/** "Registrar Pago" (pago mixto: efectivo/transferencia + saldo de la cuenta personal). */
export function PagoDialog(props: PagoDialogProps) {
  const formId = useId();
  const { ctx, draft, summary, dialog, onFormSubmit, patch } = usePagoForm(props);
  return (
    <FormDialogShell
      open
      onOpenChange={dialog.handleOpenChange}
      title={C.TITLE}
      icon={<Wallet aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.SUBMIT}
      savingLabel={C.SAVING}
      saving={dialog.saving}
      error={dialog.error}
      submitDisabled={summary.invalid}
    >
      <form id={formId} noValidate className="flex flex-col gap-4" onSubmit={onFormSubmit}>
        <DialogSummary nombre={props.participante.nombre} caption={C.PARTICIPANTE} rows={summaryRows(ctx)}>
          <ProgressBar label={C.completado(summary.progress)} valueText="" percent={summary.progress} />
        </DialogSummary>
        <PagoFields ctx={ctx} draft={draft} summary={summary} onPatch={patch} />
      </form>
    </FormDialogShell>
  );
}
