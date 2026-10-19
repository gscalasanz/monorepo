'use client';

import { TextareaField } from '@/shared/components/ui/form';

import { DESCRIPCION_MAX_LENGTH, FINANZAS_COPY } from './copy';

export interface DescripcionFieldProps {
  readonly value: string;
  readonly placeholder: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
  readonly error?: string;
}

const DESCRIPCION_ROWS = 2;

/** Descripción obligatoria (máx. 500) de gastos e ingresos. */
export function DescripcionField(props: DescripcionFieldProps) {
  return (
    <TextareaField
      label={FINANZAS_COPY.form.descripcion}
      required
      rows={DESCRIPCION_ROWS}
      maxLength={DESCRIPCION_MAX_LENGTH}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      error={props.error}
    />
  );
}
