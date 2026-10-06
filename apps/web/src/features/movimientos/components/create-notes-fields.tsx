'use client';

import { TextareaField } from '@/shared/components/ui/form';
import type { SelectOption } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { DESCRIPCION_MAX_LENGTH } from '@/features/movimientos/constants/movimientos';
import { estadoPagoOptions } from '@/features/movimientos/helpers/form-options';
import type { MovimientoCreateForm } from '@/features/movimientos/hooks/use-movimiento-create-form';
import { EstadoReembolsoFields } from '@/features/movimientos/components/estado-reembolso-fields';

interface CreateNotesFieldsProps {
  readonly form: MovimientoCreateForm;
  readonly personaOptions: readonly SelectOption[];
}

const DESCRIPCION_ROWS_CREATE = 2;
const ESTADO_OPTIONS = estadoPagoOptions();

/** Descripción, estado de pago y persona a reembolsar. */
export function CreateNotesFields({
  form,
  personaOptions,
}: CreateNotesFieldsProps) {
  const { values, errors, update, blur } = form;
  return (
    <>
      <TextareaField
        label={C.DESCRIPCION}
        placeholder={C.DESCRIPCION_PLACEHOLDER}
        rows={DESCRIPCION_ROWS_CREATE}
        maxLength={DESCRIPCION_MAX_LENGTH}
        value={values.descripcion}
        onChange={(value) => update('descripcion', value)}
        onBlur={() => blur('descripcion')}
        error={errors.descripcion}
      />
      <EstadoReembolsoFields
        estadoPago={values.estadoPago}
        estadoOptions={ESTADO_OPTIONS}
        onEstadoChange={(value) => update('estadoPago', value)}
        personaId={values.personaAReembolsarId}
        personaOptions={personaOptions}
        onPersonaChange={(value) => update('personaAReembolsarId', value)}
        personaError={errors.personaAReembolsarId}
      />
    </>
  );
}
