'use client';

import { ArrowLeftRight, Landmark } from 'lucide-react';

import { LoadingState } from '@/shared/components/feedback';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { DialogActions } from '@/features/cajas/components/dialog-actions';
import { FormError } from '@/features/cajas/components/form-error';
import { ReadonlyInfo } from '@/features/cajas/components/readonly-info';
import { TransferenciaDestinoFields } from '@/features/cajas/components/transferencia-destino-fields';
import { TransferenciaDetalleFields } from '@/features/cajas/components/transferencia-detalle-fields';
import {
  formatSaldo,
  type TransferenciaOrigen,
} from '@/features/cajas/helpers/transferencia';
import { useTransferenciaForm } from '@/features/cajas/hooks/use-transferencia-form';

export interface TransferenciaFormProps {
  readonly origen: TransferenciaOrigen;
  readonly onCancel: () => void;
  readonly onSuccess: () => void;
}

/** Cuerpo del diálogo de transferencia: origen fijo, destino, monto, responsable, fecha y descripción. */
export function TransferenciaForm({
  origen,
  onCancel,
  onSuccess,
}: TransferenciaFormProps) {
  const f = useTransferenciaForm({ origen, onSuccess });

  if (f.loadingCajas) return <LoadingState label={C.TRANSFER_LOADING} />;

  return (
    <form
      noValidate
      onSubmit={(event) => void f.submit(event)}
      className="flex flex-col gap-4"
    >
      <p className="sr-only" role="status">
        {f.saving ? C.TRANSFER_SAVING : ''}
      </p>
      <ReadonlyInfo
        label={C.ORIGEN}
        icon={Landmark}
        title={C.ORIGEN_NOMBRE}
        meta={C.saldoDisponible(formatSaldo(origen.saldo))}
      />
      <TransferenciaDestinoFields form={f} />
      <TransferenciaDetalleFields form={f} />
      {f.error && <FormError message={f.error} />}
      <DialogActions
        onCancel={onCancel}
        submitLabel={C.TRANSFERIR}
        submitIcon={<ArrowLeftRight aria-hidden />}
        saving={f.saving}
      />
    </form>
  );
}
