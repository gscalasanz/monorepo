/**
 * Schemas y view-models propios del feature. Las respuestas del backend se
 * validan con los schemas de `@/shared/domain`; acá solo se relaja lo que el
 * feature no necesita validar en profundidad.
 */
import { z } from 'zod';

import { productoSchema, ventaSchema, type Entrega } from '@/shared/domain';

/**
 * `GET /eventos/:id/ventas`: el vendedor puede ser una agrupación o una persona
 * con campos que el listado no usa → solo `{ id, nombre }` (ver paridad).
 */
export const ventaListadoSchema = ventaSchema.extend({
  vendedor: z.object({ id: z.string(), nombre: z.string() }).nullish(),
  producto: productoSchema.nullish(),
});

export type VentaListado = z.infer<typeof ventaListadoSchema>;

export const ventasListadoSchema = z.array(ventaListadoSchema);

/** `GET /eventos/:id/productos` (agrega `cantidadVendida`). */
export const productoConVentasSchema = productoSchema.extend({
  cantidadVendida: z.number(),
});

export type ProductoConVentas = z.infer<typeof productoConVentasSchema>;

/** Una línea de un lote de ventas, con la ganancia ya calculada. */
export interface VentaItemView {
  readonly ventaId: string;
  readonly productoNombre: string;
  readonly cantidad: number;
  readonly ganancia: number;
}

/**
 * Ventas que comparten `movimientoId` (un lote): el backend las borra y cobra
 * juntas, así que la UI las muestra como una sola card.
 */
export interface VentaGroup {
  readonly key: string;
  readonly movimientoId: string | null;
  /** Id que se manda al borrar / cobrar (el backend cascadea al resto). */
  readonly primaryVentaId: string;
  readonly vendedorNombre: string;
  readonly totalUnidades: number;
  readonly gananciaTotal: number;
  readonly items: readonly VentaItemView[];
  readonly fecha: string;
  readonly isSingleton: boolean;
  /** Basta una venta pendiente para que el lote esté "a cobrar". */
  readonly aCobrar: boolean;
}

/** Progreso de entrega por producto (todas las personas sumadas). */
export interface ProductoEntregaKpi {
  readonly productoId: string;
  readonly productoNombre: string;
  readonly cantidadVendida: number;
  readonly cantidadEntregada: number;
}

/** Fila del tab Entregas: un vendedor con su stock y su historial. */
export interface VendedorEntregasRow {
  readonly vendedorId: string;
  readonly vendedorNombre: string;
  readonly productos: readonly ProductoEntregaKpi[];
  readonly entregas: readonly Entrega[];
  readonly tieneStockDisponible: boolean;
}

/** Producto con stock para el diálogo de entrega. */
export interface ProductoDisponible {
  readonly productoId: string;
  readonly productoNombre: string;
  readonly cantidadDisponible: number;
}
