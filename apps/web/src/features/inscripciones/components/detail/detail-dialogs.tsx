'use client';

import type { Inscripcion } from '@/shared/domain';
import type { InscripcionDetailModel } from '@/features/inscripciones/hooks/use-inscripcion-detail';
import { BonificarDialog } from '@/features/inscripciones/components/detail/bonificar-dialog';
import { EditarPagoDialog } from '@/features/inscripciones/components/detail/editar-pago-dialog';
import { PagoDialog } from '@/features/inscripciones/components/detail/pago-dialog';

interface DetailDialogsProps {
  readonly inscripcion: Inscripcion;
  readonly model: InscripcionDetailModel;
}

/** Monta el diálogo activo del detalle (bonificar, registrar pago o editar pago). */
export function DetailDialogs({ inscripcion, model }: DetailDialogsProps) {
  const { dialog, setDialog, mutations } = model;
  const close = (open: boolean) => (open ? undefined : setDialog(null));
  if (dialog?.kind === 'bonificar') {
    return (
      <BonificarDialog
        onOpenChange={close}
        montoTotal={inscripcion.montoTotal}
        montoPagado={inscripcion.montoPagado}
        bonificadoActual={inscripcion.montoBonificado}
        onSubmit={mutations.bonificar}
      />
    );
  }
  if (dialog?.kind === 'pago') {
    return (
      <PagoDialog
        onOpenChange={close}
        personaId={inscripcion.personaId}
        pendiente={inscripcion.saldoPendiente}
        onSubmit={mutations.pagar}
      />
    );
  }
  if (dialog?.kind === 'editar-pago') {
    const movimientoId = dialog.movimiento.id;
    return (
      <EditarPagoDialog
        onOpenChange={close}
        movimiento={dialog.movimiento}
        pendiente={inscripcion.saldoPendiente}
        onSubmit={(dto) => mutations.editarPago(movimientoId, dto)}
        onDelete={() => mutations.eliminarPago(movimientoId)}
      />
    );
  }
  return null;
}
