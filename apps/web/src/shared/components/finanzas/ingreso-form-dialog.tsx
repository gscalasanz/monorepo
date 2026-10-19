'use client';

import { HandCoins } from 'lucide-react';
import { useId, useMemo, type FormEvent } from 'react';

import {
  ComboboxField,
  MoneyField,
  SelectField,
} from '@/shared/components/ui/form';
import type { Persona } from '@/shared/domain';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { personaOptions } from '@/shared/queries';

import { FINANZAS_COPY } from './copy';
import { DescripcionField } from './descripcion-field';
import { FormDialogShell } from './form-dialog-shell';
import {
  INGRESO_MEDIO_PAGO_OPTIONS,
  INITIAL_INGRESO_DRAFT,
  ingresoFormSchema,
  type IngresoFormDraft,
  type IngresoFormValues,
} from './ingreso-form-schema';
import { useDialogSubmit } from './use-dialog-submit';

const C = FINANZAS_COPY.form;

export interface IngresoFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Personas activas (`fetchPersonasActivas`). */
  readonly personas: readonly Persona[];
  /** Si rechaza, el diálogo queda abierto con el mensaje; si resuelve, se cierra. */
  readonly onSubmit: (values: IngresoFormValues) => Promise<void>;
  readonly title?: string;
}

/** "Registrar Ingreso" de eventos de grupo (mapear con `toIngresoDto`). */
export function IngresoFormDialog(props: IngresoFormDialogProps) {
  const formId = useId();
  const { saving, error, submit, handleOpenChange } = useDialogSubmit({
    onSubmit: props.onSubmit,
    onOpenChange: props.onOpenChange,
  });
  return (
    <FormDialogShell
      open={props.open}
      onOpenChange={handleOpenChange}
      title={props.title ?? FINANZAS_COPY.ingreso.title}
      icon={<HandCoins aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={FINANZAS_COPY.ingreso.submit}
      saving={saving}
      error={error}
    >
      <IngresoForm formId={formId} personas={props.personas} onValid={submit} />
    </FormDialogShell>
  );
}

interface IngresoFormProps {
  readonly formId: string;
  readonly personas: readonly Persona[];
  readonly onValid: (values: IngresoFormValues) => Promise<void>;
}

function useIngresoForm(onValid: IngresoFormProps['onValid']) {
  const form = useFormState<IngresoFormDraft>(INITIAL_INGRESO_DRAFT);
  const validation = useFieldValidation(ingresoFormSchema);
  const { values } = form;
  return {
    values,
    errors: validation.errors,
    update: <K extends keyof IngresoFormDraft>(
      name: K,
      value: IngresoFormDraft[K],
    ) => {
      form.setField(name, value);
      validation.onChange(name, value);
    },
    blur: (name: keyof IngresoFormDraft) =>
      validation.onBlur(name, values[name]),
    submit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      validation.validateAll(values);
      const result = ingresoFormSchema.safeParse(values);
      if (result.success) void onValid(result.data);
    },
  };
}

function IngresoForm({ formId, personas, onValid }: IngresoFormProps) {
  const form = useIngresoForm(onValid);
  const options = useMemo(() => personaOptions(personas), [personas]);
  const { values, errors } = form;
  return (
    <form
      id={formId}
      noValidate
      onSubmit={form.submit}
      className="flex flex-col gap-4"
    >
      <MoneyField
        label={C.monto}
        required
        value={values.monto}
        onChange={(value) => form.update('monto', value)}
        onBlur={() => form.blur('monto')}
        error={errors.monto}
      />
      <DescripcionField
        value={values.descripcion}
        placeholder={FINANZAS_COPY.ingreso.descripcionPlaceholder}
        onChange={(value) => form.update('descripcion', value)}
        onBlur={() => form.blur('descripcion')}
        error={errors.descripcion}
      />
      <ComboboxField
        label={C.responsable}
        required
        placeholder={C.responsablePlaceholder}
        options={options}
        value={values.responsableId}
        onChange={(value) => form.update('responsableId', value)}
        onBlur={() => form.blur('responsableId')}
        error={errors.responsableId}
      />
      <SelectField
        label={C.medioPago}
        required
        placeholder={C.medioPagoPlaceholder}
        options={INGRESO_MEDIO_PAGO_OPTIONS}
        value={values.medioPago}
        onChange={(value) => form.update('medioPago', value)}
        onBlur={() => form.blur('medioPago')}
        error={errors.medioPago}
      />
    </form>
  );
}
