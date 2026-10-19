/**
 * Acciones directas del detalle (sin formulario). Las que confirman corren la
 * request dentro del diálogo (el error se ve ahí); las demás muestran el error
 * por el toast global. Toda acción exitosa avisa y recarga.
 */
import {
  confirmPagarReembolso,
  type MovimientoCardData,
} from '@/shared/components/finanzas';
import { confirmDialog } from '@/shared/confirm';
import { MEDIO_PAGO_LABELS, type ParticipantePago } from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { notify } from '@/shared/notifications';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import {
  LIST_COPY,
  PARTICIPANTES_COPY as C,
} from '@/features/campamentos/constants/copy';
import {
  deleteCampamento,
  eliminarPago,
  marcarReembolsoPagado,
  quitarBonificacion,
  removeParticipante,
  updateAutorizacion,
} from '@/features/campamentos/services/campamentos-api';

export interface ActionContext {
  readonly campamentoId: string;
  readonly reload: () => Promise<void>;
  /** Navegación tras eliminar el campamento. */
  readonly goToList: () => void;
}

type Pago = ParticipantePago['pagos'][number];

async function succeed(ctx: ActionContext, message: string): Promise<void> {
  notify.success(message);
  await ctx.reload();
}

/** El toast global ya informó el error: solo se evita el rechazo sin manejar. */
function handledByGlobalToast(): void {
  return undefined;
}

export function toggleAutorizacion(
  ctx: ActionContext,
  p: ParticipantePago,
): Promise<void> {
  return updateAutorizacion(
    { campamentoId: ctx.campamentoId, personaId: p.id },
    !p.autorizacionEntregada,
  )
    .then(() => succeed(ctx, C.AUTORIZACION_UPDATED))
    .catch(handledByGlobalToast);
}

export function quitarBonificacionDe(
  ctx: ActionContext,
  p: ParticipantePago,
): Promise<void> {
  return quitarBonificacion({ campamentoId: ctx.campamentoId, personaId: p.id })
    .then(() => succeed(ctx, C.BONIFICACION_REMOVED))
    .catch(handledByGlobalToast);
}

export async function quitarParticipante(
  ctx: ActionContext,
  p: ParticipantePago,
): Promise<void> {
  const result = await confirmDialog.runDelete(C.removeEntity(p.nombre), {
    action: () =>
      removeParticipante({ campamentoId: ctx.campamentoId, personaId: p.id }),
  });
  if (result.confirmed) await succeed(ctx, C.REMOVED);
}

/** Reemplaza el "Editar pago" de Angular (el PATCH no existe en el backend). */
export async function eliminarPagoDe(
  ctx: ActionContext,
  pago: Pago,
): Promise<void> {
  const result = await confirmDialog.runDelete(C.pagoEntity, {
    action: () => eliminarPago(ctx.campamentoId, pago.movimientoId),
    details: [
      { label: C.PAGO_MONTO, value: formatMoney(pago.monto) },
      { label: C.PAGO_FECHA, value: formatDate(pago.fecha, DATE_FORMATS.date) },
      {
        label: C.PAGO_MEDIO,
        value: MEDIO_PAGO_LABELS[pago.medioPago] ?? pago.medioPago,
      },
    ],
  });
  if (result.confirmed) await succeed(ctx, C.PAGO_ELIMINADO);
}

export async function pagarReembolso(
  ctx: ActionContext,
  movimiento: MovimientoCardData,
): Promise<void> {
  const result = await confirmPagarReembolso({
    monto: movimiento.monto,
    descripcion: movimiento.descripcion,
    responsableNombre: movimiento.responsableNombre,
    action: () => marcarReembolsoPagado(movimiento.id),
  });
  if (result.confirmed) await ctx.reload();
}

/** Desvío: Angular solo confirmaba y navegaba; acá se elimina de verdad. */
export async function eliminarCampamento(ctx: ActionContext): Promise<void> {
  const result = await confirmDialog.runDelete(LIST_COPY.ENTITY, {
    action: () => deleteCampamento(ctx.campamentoId, { skipGlobalError: true }),
  });
  if (!result.confirmed) return;
  notify.success(LIST_COPY.DELETED);
  ctx.goToList();
}
