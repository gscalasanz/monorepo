import { MoneyField, SelectField } from '@/shared/components/ui/form';
import type { MedioPago } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { MEDIO_PAGO_OPTIONS } from '@/features/inscripciones/constants/inscripciones';
import type { CreateFormValues } from '@/features/inscripciones/helpers/create-form';

interface ImportesFieldsProps {
  readonly values: CreateFormValues;
  readonly saldoFondo: number;
  readonly fondoBajo: boolean;
  readonly onChange: <K extends keyof CreateFormValues>(
    name: K,
    value: CreateFormValues[K],
  ) => void;
}

/** Monto total (config, bloqueado), pago inicial, medio de pago y bonificación. */
export function ImportesFields({
  values,
  saldoFondo,
  fondoBajo,
  onChange,
}: ImportesFieldsProps) {
  const locked = values.personaNueva;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MoneyField
        label={C.MONTO_TOTAL}
        disabled
        value={values.montoTotal}
        onChange={() => undefined}
      />
      <MoneyField
        label={C.PAGO_INICIAL}
        helper={C.PAGO_INICIAL_HINT}
        disabled={locked}
        value={values.montoPagado}
        onChange={(value) => onChange('montoPagado', value)}
      />
      <SelectField<MedioPago>
        label={C.MEDIO_PAGO}
        disabled={locked}
        options={MEDIO_PAGO_OPTIONS}
        placeholder={C.MEDIO_PAGO_PLACEHOLDER}
        value={values.medioPago}
        onChange={(value) => (value ? onChange('medioPago', value) : undefined)}
      />
      <MoneyField
        label={C.BONIFICACION}
        disabled={locked}
        helper={fondoBajo ? undefined : C.fondoSaldo(saldoFondo)}
        error={fondoBajo ? C.FONDO_INSUFICIENTE : undefined}
        value={values.montoBonificado}
        onChange={(value) => onChange('montoBonificado', value)}
      />
    </div>
  );
}
