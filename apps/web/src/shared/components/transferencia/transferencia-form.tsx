'use client';

import { ArrowLeftRight, Landmark } from 'lucide-react';

import { LoadingState } from '@/shared/components/feedback';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import {
  DialogActions,
  FormError,
  ReadonlyInfo,
} from '@/shared/components/ui/form';
import { TransferenciaDestinoFields } from '@/shared/components/transferencia/transferencia-destino-fields';
import { TransferenciaDetalleFields } from '@/shared/components/transferencia/transferencia-detalle-fields';
import {
  formatSaldo,
  type TransferenciaOrigen,
} from '@/shared/components/transferencia/transferencia';
import { useTransferenciaForm } from '@/shared/components/transferencia/use-transferencia-form';

export interface TransferenciaFormProps {
  readonly origen: TransferenciaOrigen;
  readonly incluirPersonales?: boolean;
  readonly onCancel: () => void;
  readonly onSuccess: () => void;
}

/** Cuerpo del diálogo de transferencia: origen fijo, destino, monto, responsable, fecha y descripción. */
export function TransferenciaForm({
  origen,
  incluirPersonales,
  onCancel,
  onSuccess,
}: TransferenciaFormProps) {
  const f = useTransferenciaForm({ origen, onSuccess, incluirPersonales });

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
        title={origen.nombre}
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
