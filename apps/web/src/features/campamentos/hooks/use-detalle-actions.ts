'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { MovimientoCardData } from '@/shared/components/finanzas';
import type { ParticipantePago } from '@/shared/domain';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  eliminarCampamento,
  eliminarPagoDe,
  pagarReembolso,
  quitarBonificacionDe,
  quitarParticipante,
  toggleAutorizacion,
  type ActionContext,
} from '@/features/campamentos/services/detalle-actions';

type Pago = ParticipantePago['pagos'][number];

/** Acciones directas del detalle, ligadas al campamento y a su recarga. */
export function useDetalleActions(
  campamentoId: string,
  reload: () => Promise<void>,
) {
  const router = useRouter();
  return useMemo(() => {
    const ctx: ActionContext = {
      campamentoId,
      reload,
      goToList: () => router.push(CAMPAMENTO_ROUTES.LIST),
    };
    return {
      toggleAutorizacion: (p: ParticipantePago) => toggleAutorizacion(ctx, p),
      quitarBonificacion: (p: ParticipantePago) => quitarBonificacionDe(ctx, p),
      removeParticipante: (p: ParticipantePago) => quitarParticipante(ctx, p),
      eliminarPago: (pago: Pago) => eliminarPagoDe(ctx, pago),
      pagarReembolso: (movimiento: MovimientoCardData) =>
        pagarReembolso(ctx, movimiento),
      deleteCampamento: () => eliminarCampamento(ctx),
    };
  }, [campamentoId, reload, router]);
}

export type DetalleActions = ReturnType<typeof useDetalleActions>;
