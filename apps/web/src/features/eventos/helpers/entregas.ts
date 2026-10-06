/** Derivados puros de stock y entregas (tab Entregas, KPIs y diálogo). */
import type { Entrega, StockEntrega } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import type {
  ProductoDisponible,
  ProductoEntregaKpi,
  VendedorEntregasRow,
} from '@/features/eventos/models/eventos';

const LOCALE_COMPARE = 'es';

const byProductoNombre = (
  a: { productoNombre: string },
  b: { productoNombre: string },
) => a.productoNombre.localeCompare(b.productoNombre, LOCALE_COMPARE);

function toKpi(row: StockEntrega): ProductoEntregaKpi {
  return {
    productoId: row.productoId,
    productoNombre: row.productoNombre,
    cantidadVendida: row.cantidadVendida,
    cantidadEntregada: row.cantidadEntregada,
  };
}

/** "entregado / vendido" por producto sumando todos los vendedores. */
export function aggregateProductoKpis(
  stock: readonly StockEntrega[],
): ProductoEntregaKpi[] {
  const byProducto = stock.reduce((acc, row) => {
    const prev = acc.get(row.productoId);
    const next: ProductoEntregaKpi = prev
      ? {
          ...prev,
          cantidadVendida: prev.cantidadVendida + row.cantidadVendida,
          cantidadEntregada: prev.cantidadEntregada + row.cantidadEntregada,
        }
      : toKpi(row);
    return new Map(acc).set(row.productoId, next);
  }, new Map<string, ProductoEntregaKpi>());
  return [...byProducto.values()].sort(byProductoNombre);
}

export function isEntregaCompleta(kpi: ProductoEntregaKpi): boolean {
  return kpi.cantidadEntregada >= kpi.cantidadVendida;
}

function groupBy<T>(
  items: readonly T[],
  keyOf: (item: T) => string,
): Map<string, T[]> {
  return items.reduce(
    (acc, item) =>
      new Map(acc).set(keyOf(item), [...(acc.get(keyOf(item)) ?? []), item]),
    new Map<string, T[]>(),
  );
}

/** Una fila por vendedor (alfabético), con sus productos y su historial (reciente primero). */
export function buildVendedorRows(params: {
  readonly stock: readonly StockEntrega[];
  readonly entregas: readonly Entrega[];
}): VendedorEntregasRow[] {
  const stockByVendedor = groupBy(params.stock, (row) => row.vendedorId);
  const entregasByVendedor = groupBy(
    params.entregas,
    (entrega) => entrega.vendedorId,
  );
  const rows = [...stockByVendedor.entries()].map(([vendedorId, stockRows]) => {
    const productos = stockRows.map(toKpi).sort(byProductoNombre);
    return {
      vendedorId,
      vendedorNombre: stockRows[0]?.vendedorNombre ?? '',
      productos,
      entregas: [...(entregasByVendedor.get(vendedorId) ?? [])].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
      tieneStockDisponible: productos.some(
        (p) => p.cantidadVendida - p.cantidadEntregada > 0,
      ),
    };
  });
  return rows.sort((a, b) =>
    a.vendedorNombre.localeCompare(b.vendedorNombre, LOCALE_COMPARE),
  );
}

/** Productos con stock > 0 del vendedor elegido (alfabético). */
export function productosDisponibles(params: {
  readonly stock: readonly StockEntrega[];
  readonly vendedorId: string | null;
}): ProductoDisponible[] {
  if (!params.vendedorId) return [];
  return params.stock
    .filter(
      (row) =>
        row.vendedorId === params.vendedorId && row.cantidadDisponible > 0,
    )
    .map((row) => ({
      productoId: row.productoId,
      productoNombre: row.productoNombre,
      cantidadDisponible: row.cantidadDisponible,
    }))
    .sort(byProductoNombre);
}

/** Vendedores únicos con ventas (selector del diálogo sin preselección). */
export function vendedorOptions(
  stock: readonly StockEntrega[],
): { value: string; label: string }[] {
  const unique = new Map(
    stock.map((row) => [row.vendedorId, row.vendedorNombre]),
  );
  return [...unique.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, LOCALE_COMPARE));
}

/** `dd/MM/yyyy HH:mm` de la entrega (fecha declarada o, si no hay, la de carga). */
export function entregaFechaLabel(entrega: Entrega): string {
  return formatDate(
    entrega.fecha ?? entrega.createdAt,
    DATE_FORMATS.dateTimeCompact,
  );
}

/** ¿Las cantidades son válidas (0 ≤ cant ≤ disponible) y hay al menos una > 0? */
export function canSubmitEntrega(params: {
  readonly productos: readonly ProductoDisponible[];
  readonly cantidades: Readonly<Record<string, number | null>>;
}): boolean {
  const values = params.productos.map((p) => ({
    cant: params.cantidades[p.productoId] ?? 0,
    max: p.cantidadDisponible,
  }));
  return (
    values.length > 0 &&
    values.every(({ cant, max }) => cant >= 0 && cant <= max) &&
    values.some(({ cant }) => cant > 0)
  );
}

/** Items del DTO de entrega: solo cantidades > 0. */
export function entregaItems(params: {
  readonly productos: readonly ProductoDisponible[];
  readonly cantidades: Readonly<Record<string, number | null>>;
}): { productoId: string; cantidad: number }[] {
  return params.productos
    .map((p) => ({
      productoId: p.productoId,
      cantidad: params.cantidades[p.productoId] ?? 0,
    }))
    .filter((item) => item.cantidad > 0);
}
