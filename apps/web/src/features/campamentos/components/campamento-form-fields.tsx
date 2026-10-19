'use client';

import {
  DateField,
  FormCard,
  MoneyField,
  NumberField,
  TextField,
  TextareaField,
} from '@/shared/components/ui/form';
import { FORM_COPY as C } from '@/features/campamentos/constants/copy';
import {
  CAMPAMENTO_LIMITS as L,
  type CampamentoDraft,
} from '@/features/campamentos/helpers/campamento-form';
import type { CampamentoFormController } from '@/features/campamentos/hooks/use-campamento-form';

const DESCRIPCION_ROWS = 3;
const MONEY_PLACEHOLDER = '0,00';

type Form = CampamentoFormController;

/** Props controladas de un campo (valor, cambio, blur y error). */
function bind<K extends keyof CampamentoDraft>(form: Form, name: K) {
  return {
    value: form.values[name],
    onChange: (value: CampamentoDraft[K]) => form.update(name, value),
    onBlur: () => form.blur(name),
    error: form.errors[name],
  };
}

function FechasFields({ form }: { readonly form: Form }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DateField
        label={C.FECHA_INICIO}
        required
        {...bind(form, 'fechaInicio')}
      />
      <DateField label={C.FECHA_FIN} required {...bind(form, 'fechaFin')} />
    </div>
  );
}

function CostosFields({ form }: { readonly form: Form }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          label={C.COSTO}
          required
          size="md"
          placeholder={MONEY_PLACEHOLDER}
          {...bind(form, 'costoPorPersona')}
          valid={form.valid.costoPorPersona}
        />
        <NumberField
          label={C.CUOTAS}
          required
          min={L.CUOTAS_MIN}
          max={L.CUOTAS_MAX}
          placeholder={String(L.DEFAULT_CUOTAS)}
          {...bind(form, 'cuotasBase')}
          valid={form.valid.cuotasBase}
        />
      </div>
      <MoneyField
        label={C.COSTO_EDUCADORES}
        required
        size="md"
        placeholder={MONEY_PLACEHOLDER}
        helper={C.COSTO_EDUCADORES_HINT}
        {...bind(form, 'costoEducadores')}
      />
    </>
  );
}

/** Dos tarjetas como el resto de los formularios: datos (nombre, fechas, descripción) y costos. */
export function CampamentoFormFields({ form }: { readonly form: Form }) {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
      <FormCard label={C.SECTION_DATOS}>
        <TextField
          label={C.NOMBRE}
          required
          maxLength={L.NOMBRE_MAX}
          placeholder={C.NOMBRE_PLACEHOLDER}
          {...bind(form, 'nombre')}
          valid={form.valid.nombre}
        />
        <FechasFields form={form} />
        <TextareaField
          label={C.DESCRIPCION}
          rows={DESCRIPCION_ROWS}
          maxLength={L.DESCRIPCION_MAX}
          placeholder={C.DESCRIPCION_PLACEHOLDER}
          {...bind(form, 'descripcion')}
        />
      </FormCard>
      <FormCard label={C.SECTION_COSTOS}>
        <CostosFields form={form} />
      </FormCard>
    </div>
  );
}
