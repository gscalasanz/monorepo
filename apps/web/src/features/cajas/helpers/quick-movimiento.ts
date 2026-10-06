/** Lógica pura del `QuickMovimientoDialog` (caja fija). */
import type { FieldOption } from '@/shared/components/ui/form';
import {
  CAJA_TYPE_LABELS,
  CONCEPTOS_MANUALES_POR_TIPO,
  CONCEPTO_MOVIMIENTO_LABELS,
  ESTADO_PAGO,
  ESTADO_PAGO_LABELS,
  MEDIO_PAGO,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  TIPO_MOVIMIENTO_LABELS,
  type CajaConSaldo,
  type ConceptoMovimiento,
  type CreateMovimientoDto,
  type TipoMovimiento,
} from '@/shared/domain';
import {
  personaAReembolsarOnEstadoChange,
  personaAReembolsarOnResponsableChange,
} from '@/shared/validators';
import {
  QUICK_ESTADO_PAGO,
  QUICK_MEDIO_PAGO,
  type QuickEstadoPago,
  type QuickMedioPago,
  type QuickMovimientoFormValues,
} from '@/features/cajas/models/schemas';

const SHORT_ID_LENGTH = 8;

export const QUICK_MOVIMIENTO_INITIAL: QuickMovimientoFormValues = {
  tipo: TIPO_MOVIMIENTO.INGRESO,
  concepto: null,
  monto: null,
  responsableId: null,
  medioPago: MEDIO_PAGO.EFECTIVO,
  estadoPago: ESTADO_PAGO.PAGADO,
  personaAReembolsarId: null,
  descripcion: '',
};

export const TIPO_OPTIONS: readonly FieldOption<TipoMovimiento>[] =
  Object.values(TIPO_MOVIMIENTO).map((value) => ({
    value,
    label: TIPO_MOVIMIENTO_LABELS[value],
  }));

export const MEDIO_OPTIONS: readonly FieldOption<QuickMedioPago>[] =
  QUICK_MEDIO_PAGO.map((value) => ({
    value,
    label: MEDIO_PAGO_LABELS[value],
  }));

export const ESTADO_OPTIONS: readonly FieldOption<QuickEstadoPago>[] =
  QUICK_ESTADO_PAGO.map((value) => ({
    value,
    label: ESTADO_PAGO_LABELS[value],
  }));

/** Conceptos de carga manual según el tipo (`CONCEPTOS_MANUALES_POR_TIPO`). */
export function conceptoOptions(
  tipo: TipoMovimiento,
): FieldOption<ConceptoMovimiento>[] {
  return CONCEPTOS_MANUALES_POR_TIPO[tipo].map((value) => ({
    value,
    label: CONCEPTO_MOVIMIENTO_LABELS[value],
  }));
}

/** Nombre visible de la caja (paridad: `nombre`, label del tipo o "Caja {id8}"). */
export function cajaDisplayName(
  caja: Pick<CajaConSaldo, 'id' | 'nombre' | 'tipo'>,
): string {
  return (
    caja.nombre ??
    CAJA_TYPE_LABELS[caja.tipo] ??
    `Caja ${caja.id.slice(0, SHORT_ID_LENGTH)}`
  );
}

/** Cambio de tipo: resetea el concepto (no aplica al otro tipo). */
export function withTipo(
  values: QuickMovimientoFormValues,
  tipo: TipoMovimiento,
): QuickMovimientoFormValues {
  return { ...values, tipo, concepto: null };
}

/** Cambio de estado: precarga/limpia la persona a reembolsar. */
export function withEstadoPago(
  values: QuickMovimientoFormValues,
  estadoPago: QuickEstadoPago,
): QuickMovimientoFormValues {
  const personaAReembolsarId = personaAReembolsarOnEstadoChange({
    estadoPago,
    personaAReembolsarId: values.personaAReembolsarId,
    responsableId: values.responsableId,
  });
  return { ...values, estadoPago, personaAReembolsarId };
}

/** Cambio de responsable: la persona a reembolsar lo sigue si no se eligió otra. */
export function withResponsable(
  values: QuickMovimientoFormValues,
  responsableId: string | null,
): QuickMovimientoFormValues {
  const personaAReembolsarId = personaAReembolsarOnResponsableChange({
    estadoPago: values.estadoPago,
    personaAReembolsarId: values.personaAReembolsarId,
    responsableId,
    previousResponsableId: values.responsableId,
  });
  return { ...values, responsableId, personaAReembolsarId };
}

/** DTO del POST; `null` si falta un obligatorio (el form ya lo valida antes). */
export function buildQuickMovimientoDto(
  values: QuickMovimientoFormValues,
  cajaId: string,
): CreateMovimientoDto | null {
  const { concepto, monto, responsableId } = values;
  if (concepto === null || monto === null || !responsableId) return null;
  const descripcion = values.descripcion.trim();
  return {
    cajaId,
    tipo: values.tipo,
    monto,
    concepto,
    responsableId,
    medioPago: values.medioPago,
    estadoPago: values.estadoPago,
    requiereComprobante: false,
    ...(values.personaAReembolsarId
      ? { personaAReembolsarId: values.personaAReembolsarId }
      : {}),
    ...(descripcion ? { descripcion } : {}),
  };
}
