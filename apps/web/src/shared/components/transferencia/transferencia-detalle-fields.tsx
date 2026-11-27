'use client';

import { User } from 'lucide-react';

import {
  DateField,
  ReadonlyInfo,
  TextareaField,
} from '@/shared/components/ui/form';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import type { useTransferenciaForm } from '@/shared/components/transferencia/use-transferencia-form';

export interface TransferenciaDetalleFieldsProps {
  readonly form: ReturnType<typeof useTransferenciaForm>;
}

/** Responsable (usuario logueado, fijo), fecha y descripción de la transferencia. */
export function TransferenciaDetalleFields({
  form,
}: TransferenciaDetalleFieldsProps) {
  const { values, validation } = form;
  return (
    <>
      <ReadonlyInfo
        label={C.RESPONSABLE}
        icon={User}
        title={form.responsableLabel}
        meta={C.RESPONSABLE_AUTO}
      />
      <DateField
        label={C.FECHA}
        required
        value={values.fecha}
        error={validation.errors.fecha}
        onChange={(value) => form.update('fecha', value)}
        onBlur={() => validation.onBlur('fecha', values.fecha)}
      />
      <TextareaField
        label={C.DESCRIPCION}
        rows={2}
        placeholder={C.TRANSFER_DESCRIPCION_PLACEHOLDER}
        value={values.descripcion}
        onChange={(value) => form.update('descripcion', value)}
      />
    </>
  );
}
