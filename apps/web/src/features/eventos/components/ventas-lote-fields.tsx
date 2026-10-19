'use client';

import { CircleAlert } from 'lucide-react';

import { CheckboxField, SelectField } from '@/shared/components/ui/form';
import {
  DESTINO_GANANCIA,
  PERSONA_TYPE,
  type DestinoGanancia,
} from '@/shared/domain';
import { personaOptions } from '@/shared/queries';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { DESTINO_OPTIONS } from '@/features/eventos/helpers/evento-form';
import { MEDIO_PAGO_OPTIONS } from '@/features/eventos/helpers/ventas-lote';
import type { VentasLoteState } from '@/features/eventos/hooks/use-ventas-lote';

const C = EVENTOS_COPY.lote;

interface FieldsProps {
  readonly state: VentasLoteState;
}

/** Vendedor ("Responsable de las ventas") + aviso de agrupación con destino personal. */
export function VendedorFields({ state }: FieldsProps) {
  const { form, rules, submitted } = state;
  const missing = submitted && !form.values.vendedorId;
  return (
    <div className="flex flex-col gap-3">
      <SelectField
        label={C.vendedor}
        required
        placeholder={C.vendedorPlaceholder}
        options={personaOptions(rules.vendedores)}
        value={form.values.vendedorId}
        onChange={(value) => form.setField('vendedorId', value)}
        error={missing ? C.vendedorRequerido : undefined}
      />
      {rules.agrupacionInvalida && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {C.agrupacionInvalida}{' '}
            {rules.mixto ? C.agrupacionMixta : C.agrupacionUnica}
          </span>
        </p>
      )}
    </div>
  );
}

/** En mixta, pasar a "Cuentas Personales" con una agrupación elegida la deselecciona. */
function useDestinoChange(state: VentasLoteState) {
  return (destino: DestinoGanancia | null) => {
    if (!destino) return;
    const vendedor = state.data.personas.data?.find(
      (p) => p.id === state.form.values.vendedorId,
    );
    const limpiar =
      destino === DESTINO_GANANCIA.CUENTAS_PERSONALES &&
      vendedor?.tipo === PERSONA_TYPE.AGRUPACION;
    state.form.setValues({
      destinoGanancia: destino,
      ...(limpiar ? { vendedorId: null } : {}),
    });
  };
}

/** Medio de pago, destino (solo mixta), entrega en el acto y "queda a cobrar". */
export function PagoFields({ state }: FieldsProps) {
  const { form, rules, submitted } = state;
  const onDestino = useDestinoChange(state);
  return (
    <div className="flex flex-col gap-3">
      <SelectField
        label={C.medio}
        required
        placeholder={C.medioPlaceholder}
        options={MEDIO_PAGO_OPTIONS}
        value={form.values.medioPago}
        onChange={(value) => form.setField('medioPago', value)}
        error={
          submitted && !form.values.medioPago ? C.medioRequerido : undefined
        }
      />
      {rules.mixto && (
        <SelectField
          label={C.destino}
          required
          helper={C.destinoHint}
          placeholder={C.destinoPlaceholder}
          options={DESTINO_OPTIONS}
          value={form.values.destinoGanancia}
          onChange={onDestino}
        />
      )}
      <CheckboxField
        label={C.entregado}
        description={C.entregadoHint}
        value={form.values.entregaInmediata}
        onChange={(value) => form.setField('entregaInmediata', value)}
      />
      <CheckboxField
        label={C.aCobrar}
        description={C.aCobrarHint}
        value={form.values.quedaACobrar}
        onChange={(value) => form.setField('quedaACobrar', value)}
      />
    </div>
  );
}
