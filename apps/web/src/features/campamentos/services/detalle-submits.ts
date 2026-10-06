/**
 * Envíos de los diálogos del detalle. Rechazan si falla la request (el
 * diálogo queda abierto con el mensaje) y, si sale bien, avisan y recargan.
 */
import { extractErrorMessage } from '@/shared/api';
import { toGastoDto, type GastoFormValues } from '@/shared/components/finanzas';
import type { RegistrarPagoCampamentoDto } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import {
  MOVIMIENTOS_COPY,
  PARTICIPANTES_COPY as C,
} from '@/features/campamentos/constants/copy';
import type { InscripcionPlan } from '@/features/campamentos/helpers/agregar-participante';
import { bonificarAction } from '@/features/campamentos/helpers/bonificar';
import {
  addParticipante,
  bonificarParticipante,
  quitarBonificacion,
  registrarGasto,
  registrarPago,
  type ParticipanteRef,
} from '@/features/campamentos/services/campamentos-api';

export interface SubmitContext {
  readonly campamentoId: string;
  readonly reload: () => Promise<void>;
}

export interface PagoSubmit {
  readonly personaId: string;
  readonly dto: RegistrarPagoCampamentoDto;
}

export interface BonificarSubmit {
  readonly personaId: string;
  /** Total deseado (0 = quitar). */
  readonly monto: number;
}

async function done(ctx: SubmitContext, message: string): Promise<void> {
  notify.success(message);
  await ctx.reload();
}

export async function submitGasto(
  ctx: SubmitContext,
  values: GastoFormValues,
): Promise<void> {
  await registrarGasto(ctx.campamentoId, toGastoDto(values));
  await done(ctx, MOVIMIENTOS_COPY.GASTO_REGISTRADO);
}

export async function submitPago(
  ctx: SubmitContext,
  { personaId, dto }: PagoSubmit,
): Promise<void> {
  await registrarPago({ campamentoId: ctx.campamentoId, personaId }, dto);
  await done(ctx, C.PAGO_REGISTRADO);
}

export async function submitBonificar(
  ctx: SubmitContext,
  { personaId, monto }: BonificarSubmit,
): Promise<void> {
  const ref = { campamentoId: ctx.campamentoId, personaId };
  const action = bonificarAction(monto);
  if (action.kind === 'quitar') {
    await quitarBonificacion(ref, { skipGlobalError: true });
    await done(ctx, C.BONIFICACION_REMOVED);
    return;
  }
  await bonificarParticipante({ ...ref, monto: action.monto });
  await done(ctx, C.BONIFICACION_UPDATED);
}

/**
 * Bonificación y pago inicial tras el alta. Si un paso falla se corta la
 * cadena (como Angular) pero el alta ya ocurrió: se informa con un toast y el
 * diálogo se cierra igual (reintentar volvería a inscribir).
 */
async function runFollowUps(
  plan: InscripcionPlan,
  ref: ParticipanteRef,
): Promise<void> {
  try {
    if (plan.montoBonificado) {
      await bonificarParticipante({ ...ref, monto: plan.montoBonificado });
      notify.success(C.BONIFICACION_UPDATED);
    }
    if (plan.pago) {
      await registrarPago(ref, {
        montoPagado: plan.pago.monto,
        medioPago: plan.pago.medioPago,
      });
      notify.success(C.PAGO_REGISTRADO);
    }
  } catch (cause) {
    notify.error(extractErrorMessage(cause));
  }
}

/** Alta → bonificación (si > 0) → pago (si > 0); siempre recarga tras el alta. */
export async function submitAgregar(
  ctx: SubmitContext,
  plan: InscripcionPlan,
): Promise<void> {
  await addParticipante(ctx.campamentoId, {
    personaId: plan.personaId,
    autorizacionEntregada: plan.autorizacionEntregada,
  });
  notify.success(C.ADDED);
  await runFollowUps(plan, {
    campamentoId: ctx.campamentoId,
    personaId: plan.personaId,
  });
  await ctx.reload();
}
