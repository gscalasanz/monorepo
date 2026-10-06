'use client';

import { useMemo, useState } from 'react';

import type { GastoFormValues } from '@/shared/components/finanzas';
import type { ParticipantePago, Persona } from '@/shared/domain';
import { fetchPersonasActivas, fetchSaldoPersonal } from '@/shared/queries';
import type { InscripcionPlan } from '@/features/campamentos/helpers/agregar-participante';
import {
  submitAgregar,
  submitBonificar,
  submitGasto,
  submitPago,
  type BonificarSubmit,
  type PagoSubmit,
} from '@/features/campamentos/services/detalle-submits';

export type DetalleDialog =
  | { readonly kind: 'agregar' }
  | { readonly kind: 'gasto'; readonly personas: readonly Persona[] }
  | {
      readonly kind: 'pago';
      readonly participante: ParticipantePago;
      readonly saldo: number;
    }
  | { readonly kind: 'bonificar'; readonly participante: ParticipantePago };

/**
 * Diálogos con formulario del detalle. Pago y gasto cargan antes de abrir el
 * saldo personal / las personas activas (si falla, informa el toast global).
 */
export function useDetalleDialogs(
  campamentoId: string,
  reload: () => Promise<void>,
) {
  const [dialog, setDialog] = useState<DetalleDialog | null>(null);
  const handlers = useMemo(() => {
    // Los errores de las lecturas previas ya los informa el toast global.
    const ctx = { campamentoId, reload };
    return {
      close: () => setDialog(null),
      openAgregar: () => setDialog({ kind: 'agregar' }),
      openBonificar: (participante: ParticipantePago) =>
        setDialog({ kind: 'bonificar', participante }),
      openPago: (participante: ParticipantePago): Promise<void> =>
        fetchSaldoPersonal(participante.id)
          .then((saldo) => setDialog({ kind: 'pago', participante, saldo }))
          .catch(() => undefined),
      openGasto: (): Promise<void> =>
        fetchPersonasActivas()
          .then((personas) => setDialog({ kind: 'gasto', personas }))
          .catch(() => undefined),
      submitGasto: (values: GastoFormValues) => submitGasto(ctx, values),
      submitPago: (params: PagoSubmit) => submitPago(ctx, params),
      submitBonificar: (params: BonificarSubmit) =>
        submitBonificar(ctx, params),
      submitAgregar: (plan: InscripcionPlan) => submitAgregar(ctx, plan),
    };
  }, [campamentoId, reload]);
  return { dialog, ...handlers };
}

export type DetalleDialogs = ReturnType<typeof useDetalleDialogs>;
