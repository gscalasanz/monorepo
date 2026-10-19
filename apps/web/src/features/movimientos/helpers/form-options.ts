/** Opciones de los selects del form (paridad con `MovimientoFormComponent`). */
import type { FieldOption } from '@/shared/components/ui/form';
import {
  CATEGORIA_MOVIMIENTO,
  CATEGORIA_MOVIMIENTO_LABELS,
  CONCEPTOS_MANUALES_POR_TIPO,
  CONCEPTO_MOVIMIENTO_LABELS,
  ESTADO_PAGO_LABELS,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  TIPO_MOVIMIENTO_LABELS,
  type CategoriaMovimiento,
  type ConceptoMovimiento,
  type EstadoPago,
  type MedioPago,
  type TipoMovimiento,
} from '@/shared/domain';
import {
  ESTADOS_PAGO_FORM,
  MEDIOS_PAGO_MANUALES,
} from '@/features/movimientos/constants/movimientos';

export const TIPO_OPTIONS: readonly FieldOption<TipoMovimiento>[] = [
  { value: TIPO_MOVIMIENTO.INGRESO, label: TIPO_MOVIMIENTO_LABELS.ingreso },
  { value: TIPO_MOVIMIENTO.EGRESO, label: TIPO_MOVIMIENTO_LABELS.egreso },
];

export function conceptoOptions(
  tipo: TipoMovimiento,
): readonly FieldOption<ConceptoMovimiento>[] {
  return CONCEPTOS_MANUALES_POR_TIPO[tipo].map((value) => ({
    value,
    label: CONCEPTO_MOVIMIENTO_LABELS[value],
  }));
}

export const CATEGORIA_OPTIONS: readonly FieldOption<CategoriaMovimiento>[] = Object.values(
  CATEGORIA_MOVIMIENTO,
).map((value) => ({ value, label: CATEGORIA_MOVIMIENTO_LABELS[value] }));

export const MEDIO_PAGO_OPTIONS: readonly FieldOption<MedioPago>[] =
  MEDIOS_PAGO_MANUALES.map((value) => ({
    value,
    label: MEDIO_PAGO_LABELS[value],
  }));

/**
 * Estados del form: Pagado / Pendiente de Reembolso. En edición, si el
 * movimiento ya está en otro estado (p. ej. "A cobrar"), se agrega para que se vea.
 */
export function estadoPagoOptions(
  current?: EstadoPago,
): readonly FieldOption<EstadoPago>[] {
  const base: readonly EstadoPago[] = ESTADOS_PAGO_FORM;
  const estados =
    current && !base.includes(current) ? [...base, current] : base;
  return estados.map((value) => ({ value, label: ESTADO_PAGO_LABELS[value] }));
}
