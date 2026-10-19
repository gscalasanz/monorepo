'use client';

import { ReceiptText } from 'lucide-react';
import { useId, useMemo } from 'react';

import type { Persona } from '@/shared/domain';
import { personaOptions } from '@/shared/queries';

import { FINANZAS_COPY } from './copy';
import { FormDialogShell } from './form-dialog-shell';
import { GastoFormFields } from './gasto-form-fields';
import type { GastoFormValues } from './gasto-form-schema';
import { useDialogSubmit } from './use-dialog-submit';
import { useGastoForm } from './use-gasto-form';

export interface GastoFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Personas activas (`fetchPersonasActivas`): responsables y a reembolsar. */
  readonly personas: readonly Persona[];
  /** Si rechaza, el diálogo queda abierto con el mensaje; si resuelve, se cierra. */
  readonly onSubmit: (values: GastoFormValues) => Promise<void>;
  readonly title?: string;
}

/** "Registrar Gasto" de campamentos y eventos (mapear con `toGastoDto` / `toGastoEventoDto`). */
export function GastoFormDialog(props: GastoFormDialogProps) {
  const formId = useId();
  const { saving, error, submit, handleOpenChange } = useDialogSubmit({
    onSubmit: props.onSubmit,
    onOpenChange: props.onOpenChange,
  });
  return (
    <FormDialogShell
      open={props.open}
      onOpenChange={handleOpenChange}
      title={props.title ?? FINANZAS_COPY.gasto.title}
      icon={<ReceiptText aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={FINANZAS_COPY.gasto.submit}
      savingLabel={FINANZAS_COPY.gasto.saving}
      saving={saving}
      error={error}
    >
      <GastoForm formId={formId} personas={props.personas} onValid={submit} />
    </FormDialogShell>
  );
}

interface GastoFormProps {
  readonly formId: string;
  readonly personas: readonly Persona[];
  readonly onValid: (values: GastoFormValues) => Promise<void>;
}

/** Se monta con el diálogo abierto: cada apertura arranca con el form limpio. */
function GastoForm({ formId, personas, onValid }: GastoFormProps) {
  const form = useGastoForm((values) => void onValid(values));
  const options = useMemo(() => personaOptions(personas), [personas]);
  return (
    <form id={formId} noValidate onSubmit={form.submit}>
      <GastoFormFields form={form} personaOptions={options} />
    </form>
  );
}
