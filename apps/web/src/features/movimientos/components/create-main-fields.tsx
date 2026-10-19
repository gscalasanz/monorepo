'use client';

import {
  ComboboxField,
  MoneyField,
  SelectField,
} from '@/shared/components/ui/form';
import type { SelectOption } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  CATEGORIA_OPTIONS,
  conceptoOptions,
} from '@/features/movimientos/helpers/form-options';
import type { MovimientoCreateForm } from '@/features/movimientos/hooks/use-movimiento-create-form';
import { TipoToggleField } from '@/features/movimientos/components/tipo-toggle-field';

interface CreateMainFieldsProps {
  readonly form: MovimientoCreateForm;
  readonly cajaOptions: readonly SelectOption[];
}

/** Tipo, monto, concepto (según tipo), caja y categoría. */
export function CreateMainFields({ form, cajaOptions }: CreateMainFieldsProps) {
  const { values, errors, valid, update, blur } = form;
  return (
    <>
      <TipoToggleField
        value={values.tipo}
        onChange={(value) => update('tipo', value)}
      />
      <MoneyField
        label={C.MONTO}
        required
        value={values.monto}
        onChange={(value) => update('monto', value)}
        onBlur={() => blur('monto')}
        error={errors.monto}
        valid={valid.monto}
      />
      <SelectField
        label={C.CONCEPTO}
        required
        placeholder={C.CONCEPTO_PLACEHOLDER}
        options={conceptoOptions(values.tipo)}
        value={values.concepto}
        onChange={(value) => update('concepto', value)}
        onBlur={() => blur('concepto')}
        error={errors.concepto}
      />
      <ComboboxField
        label={C.CAJA}
        required
        placeholder={C.CAJA_PLACEHOLDER}
        emptyText={C.NO_RESULTS}
        options={cajaOptions}
        value={values.cajaId}
        onChange={(value) => update('cajaId', value)}
        onBlur={() => blur('cajaId')}
        error={errors.cajaId}
      />
      <SelectField
        label={C.CATEGORIA}
        placeholder={C.CATEGORIA_PLACEHOLDER}
        options={CATEGORIA_OPTIONS}
        value={values.categoria}
        onChange={(value) => update('categoria', value)}
      />
    </>
  );
}
