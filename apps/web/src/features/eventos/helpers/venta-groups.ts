/** Agrupa las ventas por lote (`movimientoId`), como el detalle de Angular. */
import { ESTADO_COBRO_VENTA, calculateEventProfit } from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { VENTA_SOLO_KEY_PREFIX } from '@/features/eventos/constants/eventos';
import type {
  VentaGroup,
  VentaItemView,
  VentaListado,
} from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.ventas;

/**
 * Ganancia de la venta (precioVenta − costo) × cantidad: los ingresos de
 * ventas registran **ganancia**, no recaudación. Sin producto → 0.
 */
export function toVentaItemView(venta: VentaListado): VentaItemView {
  const producto = venta.producto;
  const ganancia = producto
    ? calculateEventProfit({ ventas: [venta], productos: [producto] })
    : 0;
  return {
    ventaId: venta.id,
    productoNombre: producto?.nombre ?? C.producto,
    cantidad: venta.cantidad,
    ganancia,
  };
}

function newGroup(venta: VentaListado, key: string): VentaGroup {
  const item = toVentaItemView(venta);
  return {
    key,
    movimientoId: venta.movimientoId,
    primaryVentaId: venta.id,
    vendedorNombre: venta.vendedor?.nombre ?? C.sinVendedor,
    totalUnidades: item.cantidad,
    gananciaTotal: item.ganancia,
    items: [item],
    fecha: venta.createdAt,
    isSingleton: true,
    aCobrar: venta.estadoCobro === ESTADO_COBRO_VENTA.PENDIENTE,
  };
}

function addToGroup(group: VentaGroup, venta: VentaListado): VentaGroup {
  const item = toVentaItemView(venta);
  return {
    ...group,
    items: [...group.items, item],
    totalUnidades: group.totalUnidades + item.cantidad,
    gananciaTotal: group.gananciaTotal + item.ganancia,
    isSingleton: false,
    aCobrar:
      group.aCobrar || venta.estadoCobro === ESTADO_COBRO_VENTA.PENDIENTE,
  };
}

/**
 * Una card por lote. Las ventas legacy (sin movimiento) quedan solas con una
 * key sintética. Respeta el orden del backend (primera aparición de cada lote).
 */
export function groupVentasByLote(
  ventas: readonly VentaListado[],
): VentaGroup[] {
  const groups = ventas.reduce((acc, venta) => {
    const key = venta.movimientoId ?? `${VENTA_SOLO_KEY_PREFIX}${venta.id}`;
    const existing = acc.get(key);
    return new Map(acc).set(
      key,
      existing ? addToGroup(existing, venta) : newGroup(venta, key),
    );
  }, new Map<string, VentaGroup>());
  return [...groups.values()];
}
