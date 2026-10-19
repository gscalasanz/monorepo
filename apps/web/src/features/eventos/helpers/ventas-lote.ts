/** Reglas puras del registro de ventas en lote (port de `VentasLoteComponent`). */
import type { FieldOption } from '@/shared/components/ui/form';
import {
  DESTINO_GANANCIA,
  ESTADO_COBRO_VENTA,
  MEDIO_PAGO,
  MEDIO_PAGO_LABELS,
  MODALIDAD_VENTA,
  PERSONA_TYPE,
  type DestinoGanancia,
  type Evento,
  type MedioPago,
  type Persona,
  type Producto,
  type RegisterVentasLoteDto,
} from '@/shared/domain';

export const MEDIO_PAGO_OPTIONS: readonly FieldOption<MedioPago>[] =
  Object.values(MEDIO_PAGO).map((value) => ({
    value,
    label: MEDIO_PAGO_LABELS[value],
  }));

export type Cantidades = Readonly<Record<string, number | null>>;

export interface VentasLoteDraft {
  readonly vendedorId: string | null;
  readonly medioPago: MedioPago | null;
  /** Solo se usa (y se manda) si el evento es mixto. */
  readonly destinoGanancia: DestinoGanancia;
  readonly entregaInmediata: boolean;
  readonly quedaACobrar: boolean;
  readonly cantidades: Cantidades;
}

export const INITIAL_VENTAS_LOTE_DRAFT: VentasLoteDraft = {
  vendedorId: null,
  medioPago: MEDIO_PAGO.EFECTIVO,
  destinoGanancia: DESTINO_GANANCIA.CAJA_GRUPO,
  entregaInmediata: false,
  quedaACobrar: false,
  cantidades: {},
};

export function esMixto(
  evento: Pick<Evento, 'modalidadVenta'> | undefined,
): boolean {
  return evento?.modalidadVenta === MODALIDAD_VENTA.MIXTA;
}

/** Única: el destino del evento. Mixta: el que elige la venta. */
export function destinoEfectivo(params: {
  readonly evento:
    Pick<Evento, 'modalidadVenta' | 'destinoGanancia'> | undefined;
  readonly destinoElegido: DestinoGanancia;
}): DestinoGanancia | null {
  return esMixto(params.evento)
    ? params.destinoElegido
    : (params.evento?.destinoGanancia ?? null);
}

/** Con destino cuentas personales las agrupaciones no son vendedores válidos. */
export function vendedoresDisponibles(params: {
  readonly personas: readonly Persona[];
  readonly destino: DestinoGanancia | null;
}): Persona[] {
  return params.destino === DESTINO_GANANCIA.CUENTAS_PERSONALES
    ? params.personas.filter(
        (persona) => persona.tipo !== PERSONA_TYPE.AGRUPACION,
      )
    : [...params.personas];
}

/** Una agrupación no tiene caja personal: el backend rechazaría la venta. */
export function isAgrupacionConDestinoPersonal(params: {
  readonly vendedor: Persona | undefined;
  readonly destino: DestinoGanancia | null;
}): boolean {
  return (
    params.vendedor?.tipo === PERSONA_TYPE.AGRUPACION &&
    params.destino === DESTINO_GANANCIA.CUENTAS_PERSONALES
  );
}

export function cantidadOf(cantidades: Cantidades, productoId: string): number {
  return cantidades[productoId] ?? 0;
}

/** Subtotal a precio de venta (lo que se cobra, no la ganancia). */
export function subtotalOf(params: {
  readonly producto: Pick<Producto, 'id' | 'precioVenta'>;
  readonly cantidades: Cantidades;
}): number {
  return (
    params.producto.precioVenta *
    cantidadOf(params.cantidades, params.producto.id)
  );
}

export function totalGeneral(params: {
  readonly productos: readonly Pick<Producto, 'id' | 'precioVenta'>[];
  readonly cantidades: Cantidades;
}): number {
  return params.productos.reduce(
    (sum, producto) =>
      sum + subtotalOf({ producto, cantidades: params.cantidades }),
    0,
  );
}

/**
 * DTO del lote o `null` si falta vendedor/medio o no hay cantidades > 0.
 * `destinoGanancia` solo en modalidad mixta (en única el backend da 400).
 */
export function buildVentasLoteDto(params: {
  readonly draft: VentasLoteDraft;
  readonly productos: readonly Pick<Producto, 'id'>[];
  readonly mixto: boolean;
}): RegisterVentasLoteDto | null {
  const { draft } = params;
  const items = params.productos
    .map((p) => ({
      productoId: p.id,
      cantidad: cantidadOf(draft.cantidades, p.id),
    }))
    .filter((item) => item.cantidad > 0);
  if (!draft.vendedorId || !draft.medioPago || items.length === 0) return null;
  return {
    vendedorId: draft.vendedorId,
    medioPago: draft.medioPago,
    items,
    entregaInmediata: draft.entregaInmediata,
    estadoCobro: draft.quedaACobrar
      ? ESTADO_COBRO_VENTA.PENDIENTE
      : ESTADO_COBRO_VENTA.COBRADO,
    ...(params.mixto ? { destinoGanancia: draft.destinoGanancia } : {}),
  };
}
