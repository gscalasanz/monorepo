import type { ReactNode } from 'react';

import { SelectField, TextareaField } from '@/shared/components/ui/form';
import type { MedioPago } from '@/shared/domain';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import { MEDIO_PAGO_OPTIONS } from '@/features/inscripciones/constants/inscripciones';

interface PagoMetaFieldsProps {
  readonly medioPago: MedioPago | null;
  readonly descripcion: string;
  readonly onMedioPagoChange: (value: MedioPago | null) => void;
  readonly onDescripcionChange: (value: string) => void;
  /** Saldo personal u otros campos entre el medio y la descripción. */
  readonly children?: ReactNode;
}

const DESCRIPCION_ROWS = 2;

/** "Medio de Pago" (requerido) + "Descripción" (opcional) de los diálogos de pago. */
export function PagoMetaFields(props: PagoMetaFieldsProps) {
  return (
    <>
      <SelectField<MedioPago>
        label={C.MEDIO_PAGO}
        required
        options={MEDIO_PAGO_OPTIONS}
        placeholder={C.MEDIO_PLACEHOLDER}
        value={props.medioPago}
        error={props.medioPago === null ? C.MEDIO_REQUIRED : undefined}
        onChange={props.onMedioPagoChange}
      />
      {props.children}
      <TextareaField
        label={C.DESCRIPCION}
        helper={C.DESCRIPCION_HINT}
        placeholder={C.DESCRIPCION_PLACEHOLDER}
        rows={DESCRIPCION_ROWS}
        value={props.descripcion}
        onChange={props.onDescripcionChange}
      />
    </>
  );
}
