'use client';

import { GastoFormDialog } from '@/shared/components/finanzas';
import type { CampamentoDetalle } from '@/shared/domain';
import { AgregarParticipanteDialog } from '@/features/campamentos/components/agregar-participante-dialog';
import { BonificarDialog } from '@/features/campamentos/components/bonificar-dialog';
import { PagoDialog } from '@/features/campamentos/components/pago-dialog';
import type { useDetalleDialogs } from '@/features/campamentos/hooks/use-detalle-dialogs';

export interface DetailDialogsProps {
  readonly detalle: CampamentoDetalle;
  readonly dialogs: ReturnType<typeof useDetalleDialogs>;
}

/** Monta el diálogo abierto (cada apertura arranca con el form limpio). */
export function DetailDialogs({ detalle, dialogs }: DetailDialogsProps) {
  const { dialog } = dialogs;
  const onOpenChange = (open: boolean) => {
    if (!open) dialogs.close();
  };
  switch (dialog?.kind) {
    case 'agregar':
      return (
        <AgregarParticipanteDialog
          campamento={detalle.campamento}
          inscriptosIds={detalle.participantes.map((p) => p.id)}
          onOpenChange={onOpenChange}
          onSubmit={dialogs.submitAgregar}
        />
      );
    case 'gasto':
      return (
        <GastoFormDialog
          open
          personas={dialog.personas}
          onOpenChange={onOpenChange}
          onSubmit={dialogs.submitGasto}
        />
      );
    case 'pago':
      return (
        <PagoDialog
          participante={dialog.participante}
          saldoCuentaPersonal={dialog.saldo}
          onOpenChange={onOpenChange}
          onSubmit={dialogs.submitPago}
        />
      );
    case 'bonificar':
      return (
        <BonificarDialog
          participante={dialog.participante}
          onOpenChange={onOpenChange}
          onSubmit={dialogs.submitBonificar}
        />
      );
    default:
      return null;
  }
}
