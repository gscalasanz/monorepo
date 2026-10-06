'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useId } from 'react';

import { FormDialogShell } from '@/shared/components/finanzas';
import { Button } from '@/shared/components/ui/button';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  useEditarPagoDialog,
  type EditarPagoDialogOptions,
} from '@/features/inscripciones/hooks/use-editar-pago-dialog';
import { EditarPagoFields } from '@/features/inscripciones/components/detail/editar-pago-fields';

/** "Editar Pago" de una inscripción, con "Eliminar" en el pie (se monta abierto). */
export function EditarPagoDialog(props: EditarPagoDialogOptions) {
  const formId = useId();
  const model = useEditarPagoDialog(props);
  const deleteButton = (
    <Button
      type="button"
      variant="danger-soft"
      icon={<Trash2 aria-hidden />}
      loading={model.deleting}
      disabled={model.saving}
      onClick={model.remove}
    >
      {C.DELETE}
    </Button>
  );
  return (
    <FormDialogShell
      open
      onOpenChange={model.handleOpenChange}
      title={C.EDIT_TITLE}
      icon={<Pencil aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.SAVE}
      saving={model.saving && !model.deleting}
      error={model.error}
      submitDisabled={model.summary.invalid || model.deleting}
      footerExtra={deleteButton}
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-4"
        onSubmit={model.submit}
      >
        <EditarPagoFields
          model={model}
          movimiento={props.movimiento}
          pendiente={props.pendiente}
        />
      </form>
    </FormDialogShell>
  );
}
