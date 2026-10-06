'use client';

import { User } from 'lucide-react';

import { DateField, TextareaField } from '@/shared/components/ui/form';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { ReadonlyInfo } from '@/features/cajas/components/readonly-info';
import type { useTransferenciaForm } from '@/features/cajas/hooks/use-transferencia-form';

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
