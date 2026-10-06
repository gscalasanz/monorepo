/** Respuestas de `/eventos` (eventos, productos, ventas, KPIs). */
import { z } from 'zod';

import { baseEntityShape, decimalSchema, nullableField } from '@/shared/domain/common';
import {
  DESTINO_GANANCIA,
  ESTADO_COBRO_VENTA,
  MODALIDAD_VENTA,
  TIPO_EVENTO,
} from '@/shared/domain/evento/enums';
import { personaSchema } from '@/shared/domain/persona';
import { localDateSchema } from '@/shared/time';

export const tipoEventoSchema = z.nativeEnum(TIPO_EVENTO);
export const destinoGananciaSchema = z.nativeEnum(DESTINO_GANANCIA);
export const modalidadVentaSchema = z.nativeEnum(MODALIDAD_VENTA);
export const estadoCobroVentaSchema = z.nativeEnum(ESTADO_COBRO_VENTA);

export const productoSchema = z.object({
  ...baseEntityShape,
  eventoId: z.string(),
  nombre: z.string(),
  precioVenta: decimalSchema,
  /** null si se creó sin costo (se carga después). */
  precioCosto: nullableField(decimalSchema),
});

export type Producto = z.infer<typeof productoSchema>;

/** `GET /eventos/:id/productos` agrega `cantidadVendida`. */
export const productosConVentasSchema = z.array(
  productoSchema.extend({ cantidadVendida: z.number() }),
);

export const eventoKpisSchema = z.object({
  /** Ventas + ingresos manuales. */
  totalRecaudado: z.number(),
  gananciaVentas: z.number(),
  /** Costo devuelto a la caja grupo (solo destino cuentas_personales). */
  totalRecuperado: z.number(),
  totalGastado: z.number(),
  totalPendienteReembolso: z.number(),
  balance: z.number(),
});

export type EventoKpis = z.infer<typeof eventoKpisSchema>;

export const eventoSchema = z.object({
  ...baseEntityShape,
  nombre: z.string(),
  fecha: localDateSchema,
  descripcion: nullableField(z.string()),
  tipo: tipoEventoSchema,
  /** UNICA: EL destino. MIXTA: solo el default. Solo eventos de venta. */
  destinoGanancia: nullableField(destinoGananciaSchema),
  modalidadVenta: modalidadVentaSchema,
  /** Solo eventos de grupo (p. ej. "Kermesse"). */
  tipoEvento: nullableField(z.string()),
  estaCerrado: z.boolean(),
  reportePublico: z.boolean(),
  /** Irreversible (false → true): al habilitarlo se generan los movimientos retroactivos. */
  movimientosHabilitados: z.boolean(),
  productos: z.array(productoSchema).optional(),
});

export type Evento = z.infer<typeof eventoSchema>;
export const eventosSchema = z.array(eventoSchema);

/** `GET /eventos/:id` agrega `resumenFinanciero`. */
export const eventoDetalleSchema = eventoSchema.extend({ resumenFinanciero: eventoKpisSchema });
export type EventoDetalle = z.infer<typeof eventoDetalleSchema>;

export const ventaSchema = z.object({
  ...baseEntityShape,
  eventoId: z.string(),
  productoId: z.string(),
  vendedorId: z.string(),
  cantidad: z.number().int(),
  /** Destino de ESTA venta (varía por venta en un evento mixto). */
  destinoGanancia: destinoGananciaSchema,
  estadoCobro: estadoCobroVentaSchema,
  /** Movimiento de ingreso (compartido por un lote). null en ventas legacy. */
  movimientoId: nullableField(z.string()),
  movimientoRecuperoId: nullableField(z.string()),
  producto: productoSchema.optional(),
  vendedor: personaSchema.optional(),
});

export type Venta = z.infer<typeof ventaSchema>;
export const ventasSchema = z.array(ventaSchema);

/** `DELETE /eventos/:eventoId/ventas/:ventaId` */
export const deleteVentaResultSchema = z.object({
  ventaId: z.string(),
  movimientoIdEliminado: nullableField(z.string()),
  hermanasEliminadas: z.number(),
});

export type DeleteVentaResult = z.infer<typeof deleteVentaResultSchema>;

/** `POST /eventos/:eventoId/ventas/:ventaId/cobrar` */
export const cobrarVentaResultSchema = z.object({
  ventaId: z.string(),
  hermanasCobradas: z.number(),
  movimientosActualizados: z.array(z.string()),
});

export type CobrarVentaResult = z.infer<typeof cobrarVentaResultSchema>;

/** `GET /eventos/:id/resumen-ventas` (precioCosto null → 0). */
export const resumenVentasSchema = z.object({
  productos: z.array(
    z.object({
      nombre: z.string(),
      precioCosto: z.number(),
      precioVenta: z.number(),
      cantidadVendida: z.number(),
      ganancia: z.number(),
    }),
  ),
  ventasPorVendedor: z.array(
    z.object({
      vendedorId: z.string(),
      vendedorNombre: z.string(),
      cantidadTotal: z.number(),
      gananciaTotal: z.number(),
      desglose: z.array(
        z.object({
          productoId: z.string(),
          nombreProducto: z.string(),
          cantidad: z.number(),
          ganancia: z.number(),
        }),
      ),
    }),
  ),
  gananciaTotal: z.number(),
});

export type ResumenVentas = z.infer<typeof resumenVentasSchema>;
