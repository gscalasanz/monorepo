'use client';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import {
  MoneyField,
  SelectField,
  TextareaField,
  type FieldOption,
} from '@/shared/components/ui/form';
import { MEDIO_PAGO_LABELS } from '@/shared/domain';
import { PAGO_COPY as C } from '@/features/campamentos/constants/copy';
import {
  PAGO_MEDIOS,
  pagarTodoMixto,
  soloEfectivo,
  soloSaldo,
  type PagoContext,
  type PagoDraft,
  type PagoMedio,
  type PagoSummary,
} from '@/features/campamentos/helpers/pago';

const MEDIO_OPTIONS: readonly FieldOption<PagoMedio>[] = PAGO_MEDIOS.map(
  (value) => ({
    value,
    label: MEDIO_PAGO_LABELS[value],
  }),
);

const DESCRIPCION_ROWS = 2;

export interface PagoFieldsProps {
  readonly ctx: PagoContext;
  readonly draft: PagoDraft;
  readonly summary: PagoSummary;
  readonly onPatch: (next: Partial<PagoDraft>) => void;
}

function Desglose({
  draft,
  summary,
}: Pick<PagoFieldsProps, 'draft' | 'summary'>) {
  if (!summary.esMixto) return null;
  const medio = draft.medioPago ? MEDIO_PAGO_LABELS[draft.medioPago] : '';
  return (
    <dl className="flex flex-col gap-1 rounded-lg bg-recessed p-3 text-[13px]">
      <dt className="font-medium text-ink">{C.DESGLOSE}</dt>
      <dd className="flex justify-between text-ink-muted">
        {C.DESGLOSE_SALDO} <Money amount={summary.montoSaldo} />
      </dd>
      <dd className="flex justify-between text-ink-muted">
        {medio}: <Money amount={summary.montoPagado} />
      </dd>
      <dd className="flex justify-between border-t border-border pt-1 font-semibold text-ink">
        {C.DESGLOSE_TOTAL} <Money amount={summary.total} />
      </dd>
    </dl>
  );
}

function Restante({ restante }: { readonly restante: number }) {
  return (
    <p className="flex items-center justify-between text-sm">
      <span className="text-ink-muted">{C.SALDO_RESTANTE}</span>
      <Money amount={restante} className={restante === 0 ? 'text-success' : undefined} />
    </p>
  );
}

function QuickActions({
  ctx,
  summary,
  onPatch,
}: Omit<PagoFieldsProps, 'draft'>) {
  if (ctx.montoPendiente <= 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {summary.puedeUsarSaldo && (
        <>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onPatch(pagarTodoMixto(ctx))}
          >
            {C.PAGAR_TODO_MIXTO}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onPatch(soloSaldo(ctx))}
          >
            {C.soloSaldo(summary.maxSaldoUsable)}
          </Button>
        </>
      )}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => onPatch(soloEfectivo(ctx))}
      >
        {C.soloEfectivo(ctx.montoPendiente)}
      </Button>
    </div>
  );
}

/** Campos del pago mixto + desglose, saldo restante y atajos. */
export function PagoFields({ ctx, draft, summary, onPatch }: PagoFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      {summary.puedeUsarSaldo && (
        <MoneyField
          label={C.USAR_SALDO}
          size="md"
          helper={C.disponible(ctx.saldoCuentaPersonal)}
          value={draft.montoConSaldoPersonal}
          onChange={(v) => onPatch({ montoConSaldoPersonal: v })}
          error={summary.saldoExcedido ? C.SALDO_EXCEDIDO : undefined}
        />
      )}
      <MoneyField
        label={summary.puedeUsarSaldo ? C.MONTO_MIXTO : C.MONTO}
        size="md"
        required={summary.montoSaldo === 0}
        value={draft.montoPagado}
        onChange={(v) => onPatch({ montoPagado: v })}
      />
      {summary.montoPagado > 0 && (
        <SelectField
          label={C.MEDIO_PAGO}
          required
          placeholder={C.MEDIO_PAGO_PLACEHOLDER}
          options={MEDIO_OPTIONS}
          value={draft.medioPago}
          onChange={(v) => onPatch({ medioPago: v })}
          error={summary.medioFaltante ? C.MEDIO_PAGO_REQUERIDO : undefined}
        />
      )}
      <TextareaField
        label={C.DESCRIPCION}
        helper={C.DESCRIPCION_HINT}
        rows={DESCRIPCION_ROWS}
        placeholder={C.DESCRIPCION_PLACEHOLDER}
        value={draft.descripcion}
        onChange={(v) => onPatch({ descripcion: v })}
      />
      <Desglose draft={draft} summary={summary} />
      <Restante restante={summary.restante} />
      <QuickActions ctx={ctx} summary={summary} onPatch={onPatch} />
    </div>
  );
}
