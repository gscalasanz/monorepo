import { KeyValueList, Money } from '@/shared/components/data';
import { MoneyField } from '@/shared/components/ui/form';
import type { MovimientoInscripcion } from '@/shared/domain';
import { formatDate } from '@/shared/time';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import type { EditarPagoDialogModel } from '@/features/inscripciones/hooks/use-editar-pago-dialog';
import { PagoMetaFields } from '@/features/inscripciones/components/detail/pago-meta-fields';

interface EditarPagoFieldsProps {
  readonly model: EditarPagoDialogModel;
  readonly movimiento: MovimientoInscripcion;
  readonly pendiente: number;
}

/** Pago original, fecha y pendiente actual + monto, medio y descripción. */
export function EditarPagoFields({
  model,
  movimiento,
  pendiente,
}: EditarPagoFieldsProps) {
  const { values, summary, setField } = model;
  const montoError = summary.belowMin
    ? C.MONTO_MIN
    : summary.aboveMax
      ? C.maxMonto(summary.max)
      : undefined;
  return (
    <>
      <KeyValueList
        columns={3}
        items={[
          {
            label: C.PAGO_ORIGINAL,
            value: <Money amount={movimiento.monto} />,
          },
          { label: C.FECHA, value: formatDate(movimiento.fecha) },
          {
            label: C.SALDO_PENDIENTE_ACTUAL,
            value: <Money amount={pendiente} tone="debt" />,
          },
        ]}
      />
      <MoneyField
        label={C.MONTO}
        required
        error={montoError}
        value={values.monto}
        onChange={(value) => setField('monto', value)}
      />
      <PagoMetaFields
        medioPago={values.medioPago}
        descripcion={values.descripcion}
        onMedioPagoChange={(value) => setField('medioPago', value)}
        onDescripcionChange={(value) => setField('descripcion', value)}
      />
    </>
  );
}
