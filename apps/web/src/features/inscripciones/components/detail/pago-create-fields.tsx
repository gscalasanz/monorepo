import { Money } from '@/shared/components/data';
import { MoneyField } from '@/shared/components/ui/form';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import type { PagoDialogModel } from '@/features/inscripciones/hooks/use-pago-dialog';
import { PagoMetaFields } from '@/features/inscripciones/components/detail/pago-meta-fields';
import { PagoSummary } from '@/features/inscripciones/components/detail/pago-summary';
import { SaldoPersonalField } from '@/features/inscripciones/components/detail/saldo-personal-field';

/** Campos de "Registrar Pago": pendiente, efectivo, medio, saldo personal, descripción y resumen. */
export function PagoCreateFields({
  pago,
  pendiente,
}: {
  readonly pago: PagoDialogModel;
  readonly pendiente: number;
}) {
  const { values, summary, setField } = pago;
  return (
    <>
      <p className="flex items-center justify-between rounded-lg bg-recessed px-3 py-2.5 text-sm">
        <span className="text-ink-muted">{C.SALDO_PENDIENTE}</span>
        <Money amount={pendiente} tone="debt" className="font-semibold" />
      </p>
      <MoneyField
        label={C.MONTO_EFECTIVO}
        value={values.montoPagado}
        onChange={(value) => setField('montoPagado', value)}
      />
      <PagoMetaFields
        medioPago={values.medioPago}
        descripcion={values.descripcion}
        onMedioPagoChange={(value) => setField('medioPago', value)}
        onDescripcionChange={(value) => setField('descripcion', value)}
      >
        <SaldoPersonalField
          value={values.montoConSaldoPersonal}
          saldo={pago.saldoPersonal}
          loading={pago.saldoLoading}
          excede={summary.excedeSaldo}
          onChange={(value) => setField('montoConSaldoPersonal', value)}
          onUsarTodo={pago.usarTodo}
        />
      </PagoMetaFields>
      <PagoSummary
        efectivo={values.montoPagado ?? 0}
        saldo={values.montoConSaldoPersonal ?? 0}
        pendiente={pendiente}
        summary={summary}
      />
    </>
  );
}
