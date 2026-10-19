'use client';

import { SwitchField, TextareaField } from '@/shared/components/ui/form';
import type { EstadoPago } from '@/shared/domain';
import type { SelectOption } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  DESCRIPCION_MAX_LENGTH,
  DESCRIPCION_ROWS,
} from '@/features/movimientos/constants/movimientos';
import { estadoPagoOptions } from '@/features/movimientos/helpers/form-options';
import type { MovimientoEditForm } from '@/features/movimientos/hooks/use-movimiento-edit-form';
import { EstadoReembolsoFields } from '@/features/movimientos/components/estado-reembolso-fields';

interface EditEditableFieldsProps {
  readonly form: MovimientoEditForm;
  readonly personaOptions: readonly SelectOption[];
  /** Estado original (si no es de los del form, se agrega a las opciones). */
  readonly originalEstado: EstadoPago;
}

/** "Campos Editables": descripción, estado, persona a reembolsar y comprobante. */
export function EditEditableFields({
  form,
  personaOptions,
  originalEstado,
}: EditEditableFieldsProps) {
  const { values, errors } = form;
  return (
    <>
      <h2
        id="movimiento-editable-title"
        className="text-sm font-semibold text-ink"
      >
        {C.EDITABLE_TITLE}
      </h2>
      <TextareaField
        label={C.DESCRIPCION}
        placeholder={C.DESCRIPCION_PLACEHOLDER}
        rows={DESCRIPCION_ROWS}
        maxLength={DESCRIPCION_MAX_LENGTH}
        value={values.descripcion}
        onChange={(value) => form.update('descripcion', value)}
        onBlur={() => form.blur('descripcion')}
        error={errors.descripcion}
      />
      <EstadoReembolsoFields
        estadoPago={values.estadoPago}
        estadoOptions={estadoPagoOptions(originalEstado)}
        onEstadoChange={form.updateEstado}
        personaId={values.personaAReembolsarId}
        personaOptions={personaOptions}
        onPersonaChange={(value) => form.update('personaAReembolsarId', value)}
        personaError={errors.personaAReembolsarId}
      />
      <SwitchField
        label={C.COMPROBANTE_ENTREGADO}
        value={values.comprobanteEntregado}
        onChange={(value) => form.update('comprobanteEntregado', value)}
      />
    </>
  );
}
