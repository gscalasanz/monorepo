/**
 * Entregas de productos de eventos de venta (`/eventos/:eventoId/entregas`).
 * Stock disponible = Σ ventas − Σ entregas por (producto, vendedor).
 */
import { z } from 'zod';

import { nullableField } from '@/shared/domain/common';
import { instantSchema } from '@/shared/time';

export const entregaSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  vendedorId: z.string(),
  vendedorNombre: z.string(),
  fecha: nullableField(instantSchema),
  notas: nullableField(z.string()),
  createdAt: instantSchema,
  lineas: z.array(
    z.object({
      id: z.string(),
      productoId: z.string(),
      productoNombre: z.string(),
      cantidad: z.number(),
    }),
  ),
});

export type Entrega = z.infer<typeof entregaSchema>;
export const entregasSchema = z.array(entregaSchema);

/** `GET /eventos/:eventoId/entregas/stock-disponible` (una fila por producto × vendedor). */
export const stockEntregaSchema = z.object({
  productoId: z.string(),
  productoNombre: z.string(),
  vendedorId: z.string(),
  vendedorNombre: z.string(),
  cantidadVendida: z.number(),
  cantidadEntregada: z.number(),
  cantidadDisponible: z.number(),
});

export type StockEntrega = z.infer<typeof stockEntregaSchema>;
export const stockEntregasSchema = z.array(stockEntregaSchema);

export interface EntregaItemDto {
  readonly productoId: string;
  readonly cantidad: number;
}

/**
 * `POST /eventos/:eventoId/entregas`. Sin productoId repetidos; cada cantidad
 * ≤ stock disponible; notas ≤ 500 (validado en el backend).
 */
export interface CreateEntregaDto {
  readonly vendedorId: string;
  /** ISO 8601 */
  readonly fecha?: string;
  readonly notas?: string;
  readonly items: readonly EntregaItemDto[];
}
