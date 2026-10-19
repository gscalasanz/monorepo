'use client';

import { Banknote } from 'lucide-react';
import { useId } from 'react';

import { FormDialogShell } from '@/shared/components/finanzas';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  usePagoDialog,
  type PagoDialogOptions,
} from '@/features/inscripciones/hooks/use-pago-dialog';
import { PagoCreateFields } from '@/features/inscripciones/components/detail/pago-create-fields';

/** "Registrar Pago" de una inscripción (se monta abierto). */
export function PagoDialog(props: PagoDialogOptions) {
  const formId = useId();
  const pago = usePagoDialog(props);
  return (
    <FormDialogShell
      open
      onOpenChange={pago.dialog.handleOpenChange}
      title={C.CREATE_TITLE}
      icon={<Banknote aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.REGISTER}
      saving={pago.dialog.saving}
      error={pago.dialog.error}
      submitDisabled={pago.summary.invalid}
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-4"
        onSubmit={pago.submit}
      >
        <PagoCreateFields pago={pago} pendiente={props.pendiente} />
      </form>
    </FormDialogShell>
  );
}
