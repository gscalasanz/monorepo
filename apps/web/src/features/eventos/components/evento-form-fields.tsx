'use client';

import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
} from '@/shared/components/ui/form';
import { MODALIDAD_VENTA, TIPO_EVENTO } from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTO_LIMITS as L } from '@/features/eventos/constants/eventos';
import {
  DESTINO_OPTIONS,
  MODALIDAD_OPTIONS,
  TIPO_OPTIONS,
} from '@/features/eventos/helpers/evento-form';
import type { EventoFormState } from '@/features/eventos/hooks/use-evento-form';

const C = EVENTOS_COPY.form;

interface FieldsProps {
  readonly form: EventoFormState;
  readonly isEditing: boolean;
}

/** Modalidad y destino: solo al crear un evento de venta (destino solo si no es mixta). */
function VentaFields({ form, isEditing }: FieldsProps) {
  const { values } = form;
  if (isEditing || values.tipo !== TIPO_EVENTO.VENTA) return null;
  return (
    <>
      <SelectField
        label={C.modalidad}
        helper={C.modalidadHint}
        placeholder={C.modalidadPlaceholder}
        options={MODALIDAD_OPTIONS}
        value={values.modalidadVenta}
        onChange={(value) => value && form.update('modalidadVenta', value)}
      />
      {values.modalidadVenta !== MODALIDAD_VENTA.MIXTA && (
        <SelectField
          label={C.destino}
          placeholder={C.destinoPlaceholder}
          options={DESTINO_OPTIONS}
          value={values.destinoGanancia}
          onChange={(value) => value && form.update('destinoGanancia', value)}
        />
      )}
    </>
  );
}

function BaseFields({ form }: { readonly form: EventoFormState }) {
  const { values, errors } = form;
  return (
    <>
      <TextField
        label={C.nombre}
        required
        placeholder={C.nombrePlaceholder}
        maxLength={L.NOMBRE_MAX}
        value={values.nombre}
        onChange={(value) => form.update('nombre', value)}
        onBlur={() => form.blur('nombre')}
        error={errors.nombre}
      />
      <SelectField
        label={C.tipo}
        required
        placeholder={C.tipoPlaceholder}
        options={TIPO_OPTIONS}
        value={values.tipo}
        onChange={(value) => form.update('tipo', value)}
        onBlur={() => form.blur('tipo')}
        error={errors.tipo}
      />
      <DateField
        label={C.fecha}
        required
        value={values.fecha}
        onChange={(value) => form.update('fecha', value)}
        onBlur={() => form.blur('fecha')}
        error={errors.fecha}
      />
    </>
  );
}

/** Campos del form de evento (orden y condiciones de Angular). */
export function EventoFormFields({ form, isEditing }: FieldsProps) {
  const { values, errors } = form;
  return (
    <div className="flex flex-col gap-4">
      <BaseFields form={form} />
      {values.tipo === TIPO_EVENTO.GRUPO && (
        <TextField
          label={C.tipoEvento}
          placeholder={C.tipoEventoPlaceholder}
          maxLength={L.TIPO_EVENTO_MAX}
          value={values.tipoEvento}
          onChange={(value) => form.update('tipoEvento', value)}
          onBlur={() => form.blur('tipoEvento')}
          error={errors.tipoEvento}
        />
      )}
      <VentaFields form={form} isEditing={isEditing} />
      <TextareaField
        label={C.descripcion}
        placeholder={C.descripcionPlaceholder}
        rows={3}
        maxLength={L.DESCRIPCION_MAX}
        value={values.descripcion}
        onChange={(value) => form.update('descripcion', value)}
        onBlur={() => form.blur('descripcion')}
        error={errors.descripcion}
      />
    </div>
  );
}
