'use client';

import {
  ComboboxField,
  DateField,
  MoneyField,
  SelectField,
  type FieldOption,
} from '@/shared/components/ui/form';

import { FINANZAS_COPY } from './copy';
import { DescripcionField } from './descripcion-field';
import {
  GASTO_ESTADO_PAGO_OPTIONS,
  GASTO_MEDIO_PAGO_OPTIONS,
} from './gasto-form-schema';
import { ReembolsoFields } from './reembolso-fields';
import type { GastoFormController } from './use-gasto-form';

const C = FINANZAS_COPY.form;

export interface GastoFormFieldsProps {
  readonly form: GastoFormController;
  readonly personaOptions: readonly FieldOption[];
}

/** Campos del gasto en el orden de Angular (Monto+Fecha, Responsable, Descripción, Medio+Estado). */
export function GastoFormFields({
  form,
  personaOptions,
}: GastoFormFieldsProps) {
  const { values, errors } = form;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          label={C.monto}
          required
          value={values.monto}
          onChange={(value) => form.update('monto', value)}
          onBlur={() => form.blur('monto')}
          error={errors.monto}
        />
        <DateField
          label={C.fecha}
          required
          value={values.fecha}
          onChange={(value) => form.update('fecha', value)}
          onBlur={() => form.blur('fecha')}
          error={errors.fecha}
        />
      </div>
      <ComboboxField
        label={C.responsable}
        required
        placeholder={C.responsablePlaceholder}
        options={personaOptions}
        value={values.responsableId}
        onChange={form.setResponsable}
        onBlur={() => form.blur('responsableId')}
        error={errors.responsableId}
      />
      <DescripcionField
        value={values.descripcion}
        placeholder={FINANZAS_COPY.gasto.descripcionPlaceholder}
        onChange={(value) => form.update('descripcion', value)}
        onBlur={() => form.blur('descripcion')}
        error={errors.descripcion}
      />
      <GastoPagoFields form={form} />
      <ReembolsoFields form={form} personaOptions={personaOptions} />
    </div>
  );
}

function GastoPagoFields({ form }: { readonly form: GastoFormController }) {
  const { values, errors } = form;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label={C.medioPago}
        required
        placeholder={C.medioPagoPlaceholder}
        options={GASTO_MEDIO_PAGO_OPTIONS}
        value={values.medioPago}
        onChange={(value) => form.update('medioPago', value)}
        onBlur={() => form.blur('medioPago')}
        error={errors.medioPago}
      />
      <SelectField
        label={C.estadoPago}
        required
        placeholder={C.estadoPagoPlaceholder}
        options={GASTO_ESTADO_PAGO_OPTIONS}
        value={values.estadoPago}
        onChange={form.setEstadoPago}
        onBlur={() => form.blur('estadoPago')}
        error={errors.estadoPago}
      />
    </div>
  );
}
