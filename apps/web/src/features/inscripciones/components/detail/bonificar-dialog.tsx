'use client';

import { HandHeart } from 'lucide-react';
import { useId } from 'react';

import { FormDialogShell } from '@/shared/components/finanzas';
import { BONIFICAR_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  useBonificarDialog,
  type BonificarDialogOptions,
} from '@/features/inscripciones/hooks/use-bonificar-dialog';
import { BonificarFields } from '@/features/inscripciones/components/detail/bonificar-fields';

/** "Bonificar Inscripción" contra el fondo solidario (se monta abierto). */
export function BonificarDialog(props: BonificarDialogOptions) {
  const formId = useId();
  const state = useBonificarDialog(props);
  return (
    <FormDialogShell
      open
      onOpenChange={state.dialog.handleOpenChange}
      title={C.TITLE}
      icon={<HandHeart aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.CONFIRM}
      saving={state.dialog.saving}
      error={state.dialog.error}
      submitDisabled={!state.canConfirm}
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-4"
        onSubmit={state.submit}
      >
        <BonificarFields state={state} montoTotal={props.montoTotal} />
      </form>
    </FormDialogShell>
  );
}
