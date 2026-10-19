'use client';

import { RadioCardsField, type FieldOption } from '@/shared/components/ui/form';
import { ESTADO_PAGO, type EstadoPago } from '@/shared/domain';
import type { SelectOption } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { PersonaReembolsoField } from '@/features/movimientos/components/persona-reembolso-field';

interface EstadoReembolsoFieldsProps {
  readonly estadoPago: EstadoPago;
  readonly estadoOptions: readonly FieldOption<EstadoPago>[];
  readonly onEstadoChange: (value: EstadoPago) => void;
  readonly personaId: string | null;
  readonly personaOptions: readonly SelectOption[];
  readonly onPersonaChange: (value: string | null) => void;
  readonly personaError?: string;
}

/** "Estado de Pago" + "Persona a Reembolsar" (solo si está pendiente de reembolso). */
export function EstadoReembolsoFields(props: EstadoReembolsoFieldsProps) {
  return (
    <>
      <RadioCardsField
        label={C.ESTADO_PAGO}
        required
        columns={2}
        options={props.estadoOptions}
        value={props.estadoPago}
        onChange={(value) => value && props.onEstadoChange(value)}
      />
      {props.estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO && (
        <PersonaReembolsoField
          value={props.personaId}
          onChange={props.onPersonaChange}
          options={props.personaOptions}
          error={props.personaError}
        />
      )}
    </>
  );
}
