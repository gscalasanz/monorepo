/** Ganancia de ventas (port de los cálculos puros de `SaldoCalculatorService`). */

export interface ProfitProducto {
  readonly id: string;
  readonly precioVenta: number;
  readonly precioCosto: number | null;
}

export interface ProfitVenta {
  readonly productoId: string;
  readonly vendedorId: string;
  readonly cantidad: number;
}

export interface ProfitInput {
  readonly ventas: readonly ProfitVenta[];
  readonly productos: readonly ProfitProducto[];
}

/** (precioVenta − costo) × cantidad; costo null = 0; venta sin producto = 0. */
function profitOf(venta: ProfitVenta, productos: readonly ProfitProducto[]): number {
  const producto = productos.find((p) => p.id === venta.productoId);
  if (!producto) return 0;
  return (producto.precioVenta - (producto.precioCosto ?? 0)) * venta.cantidad;
}

export function calculateEventProfit({ ventas, productos }: ProfitInput): number {
  return ventas.reduce((total, venta) => total + profitOf(venta, productos), 0);
}

/** Ganancia por vendedor (solo vendedores con al menos una venta de producto conocido). */
export function calculateProfitBySeller({ ventas, productos }: ProfitInput): Map<string, number> {
  return ventas
    .filter((venta) => productos.some((p) => p.id === venta.productoId))
    .reduce(
      (acc, venta) =>
        new Map(acc).set(venta.vendedorId, (acc.get(venta.vendedorId) ?? 0) + profitOf(venta, productos)),
      new Map<string, number>(),
    );
}
