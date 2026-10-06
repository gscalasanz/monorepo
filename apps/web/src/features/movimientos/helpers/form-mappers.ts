/** Valores iniciales, transiciones y DTOs de los forms (port de `MovimientosFormBuilder`). */
import {
  CONCEPTOS_MANUALES_POR_TIPO,
  ESTADO_PAGO,
  MEDIO_PAGO,
  TIPO_MOVIMIENTO,
  type CajaConSaldo,
  type ConceptoMovimiento,
  type CreateMovimientoDto,
  type Movimiento,
  type Persona,
  type TipoMovimiento,
  type UpdateMovimientoDto,
} from '@/shared/domain';
import type {
  MovimientoCreateParsed,
  MovimientoCreateValues,
  MovimientoEditValues,
} from '@/features/movimientos/models/form-schemas';

/** Defaults de Angular: ingreso, efectivo, pagado, fecha de hoy; `?cajaId` si existe. */
export function initialCreateValues(params: {
  readonly cajas: readonly CajaConSaldo[];
  readonly cajaId: string | null;
  readonly today: string;
}): MovimientoCreateValues {
  const cajaExists = params.cajas.some((caja) => caja.id === params.cajaId);
  return {
    cajaId: cajaExists ? params.cajaId : null,
    tipo: TIPO_MOVIMIENTO.INGRESO,
    monto: null,
    concepto: null,
    categoria: null,
    responsableId: null,
    medioPago: MEDIO_PAGO.EFECTIVO,
    fecha: params.today,
    descripcion: '',
    estadoPago: ESTADO_PAGO.PAGADO,
    personaAReembolsarId: null,
  };
}

/** Al cambiar el tipo, el concepto se limpia si no pertenece al nuevo tipo. */
export function conceptoForTipo(params: {
  readonly concepto: ConceptoMovimiento | null;
  readonly tipo: TipoMovimiento;
}): ConceptoMovimiento | null {
  const { concepto, tipo } = params;
  return concepto && CONCEPTOS_MANUALES_POR_TIPO[tipo].includes(concepto)
    ? concepto
    : null;
}

const optional = (value: string | null): string | undefined =>
  value || undefined;

/** Body de `POST /movimientos` a partir de los valores validados. */
export function toCreateDto(
  values: MovimientoCreateParsed,
): CreateMovimientoDto {
  return {
    cajaId: values.cajaId,
    tipo: values.tipo,
    monto: values.monto,
    concepto: values.concepto,
    categoria: values.categoria ?? undefined,
    descripcion: optional(values.descripcion.trim()),
    responsableId: values.responsableId,
    medioPago: values.medioPago,
    requiereComprobante: false,
    estadoPago: values.estadoPago,
    personaAReembolsarId: optional(values.personaAReembolsarId),
    fecha: optional(values.fecha),
  };
}

export function initialEditValues(
  movimiento: Movimiento,
): MovimientoEditValues {
  return {
    descripcion: movimiento.descripcion ?? '',
    estadoPago: movimiento.estadoPago,
    personaAReembolsarId: movimiento.personaAReembolsarId ?? null,
    comprobanteEntregado: movimiento.comprobanteEntregado ?? false,
  };
}

/** Body de `PATCH /movimientos/:id` (paridad: descripción vacía no viaja). */
export function toUpdateDto(values: MovimientoEditValues): UpdateMovimientoDto {
  return {
    descripcion: optional(values.descripcion.trim()),
    comprobanteEntregado: values.comprobanteEntregado,
    estadoPago: values.estadoPago,
    personaAReembolsarId: optional(values.personaAReembolsarId),
  };
}

/**
 * Personas del selector de edición: solo activas, más la persona a reembolsar
 * ya asignada aunque esté deshabilitada (si no, el valor actual no se vería).
 */
export function editPersonas(params: {
  readonly personas: readonly Persona[];
  readonly movimiento: Movimiento;
}): readonly Persona[] {
  const asignada = params.movimiento.personaAReembolsar;
  if (!asignada || params.personas.some((p) => p.id === asignada.id))
    return params.personas;
  return [...params.personas, asignada];
}
