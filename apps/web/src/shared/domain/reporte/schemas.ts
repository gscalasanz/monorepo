/**
 * Reporte de evento (`GET /eventos/:id/reporte` y `/reporte/publico`): unión
 * discriminada por `variante`. Espejo de `backend/src/modules/eventos/reporte/dtos`.
 * `porcentaje` y `margen` son ratios 0–1, no porcentajes.
 */
import { z } from 'zod';

import { nullableField } from '@/shared/domain/common';
import { destinoGananciaSchema, tipoEventoSchema } from '@/shared/domain/evento';
import { personaTypeSchema } from '@/shared/domain/persona';
import { instantSchema, localDateSchema } from '@/shared/time';

/** Incluye `venta_mixta`, que el Angular y el Swagger omiten en su tipo de variante. */
export const REPORTE_VARIANTE = {
  VENTA_CAJA_GRUPO: 'venta_caja_grupo',
  VENTA_CUENTAS_PERSONALES: 'venta_cuentas_personales',
  VENTA_MIXTA: 'venta_mixta',
  GRUPO: 'grupo',
} as const;

export type ReporteVariante = (typeof REPORTE_VARIANTE)[keyof typeof REPORTE_VARIANTE];

export const REPORTE_SEVERIDAD = { ALTA: 'alta', MEDIA: 'media', OK: 'ok' } as const;
export type ReporteSeveridad = (typeof REPORTE_SEVERIDAD)[keyof typeof REPORTE_SEVERIDAD];

const reporteBaseShape = {
  generadoEn: instantSchema,
  evento: z.object({
    id: z.string(),
    nombre: z.string(),
    fecha: localDateSchema,
    tipo: tipoEventoSchema,
    destinoGanancia: nullableField(destinoGananciaSchema),
    estaCerrado: z.boolean(),
  }),
  kpis: z.object({
    recaudacionBruta: z.number(),
    ganancia: z.number(),
    egresos: z.number(),
    netoReal: z.number(),
    margen: z.number(),
    unidades: z.number(),
    pendienteReembolso: z.number(),
    /** Costo recuperado por el grupo (solo destino cuentas_personales). */
    recuperoCosto: z.number(),
  }),
  egresos: z.array(
    z.object({
      descripcion: z.string(),
      responsableNombre: nullableField(z.string()),
      medioPago: z.string(),
      estadoPago: z.string(),
      monto: z.number(),
    }),
  ),
  integridad: z.array(
    z.object({ severidad: z.nativeEnum(REPORTE_SEVERIDAD), mensaje: z.string() }),
  ),
};

const metricasShape = {
  unidades: z.number(),
  recaudado: z.number(),
  porcentaje: z.number(),
};

const ventaBaseShape = {
  ...reporteBaseShape,
  productos: z.array(
    z.object({
      nombre: z.string(),
      precioCosto: z.number(),
      precioVenta: z.number(),
      margenUnitario: z.number(),
      ...metricasShape,
    }),
  ),
  porTipoPersona: z.array(
    z.object({ tipo: personaTypeSchema, label: z.string(), vendedores: z.number(), ...metricasShape }),
  ),
  porRama: z.array(
    z.object({ grupo: z.string(), esEducador: z.boolean(), vendedores: z.number(), ...metricasShape }),
  ),
  vendedores: z.array(
    z.object({
      vendedorId: z.string(),
      nombre: z.string(),
      tipo: personaTypeSchema,
      rama: nullableField(z.string()),
      ...metricasShape,
      entregado: z.number(),
      pendiente: z.number(),
    }),
  ),
  stock: z.object({
    productos: z.array(
      z.object({ nombre: z.string(), vendido: z.number(), entregado: z.number(), pendiente: z.number() }),
    ),
    totalVendido: z.number(),
    totalEntregado: z.number(),
    totalPendiente: z.number(),
  }),
  horariosEntrega: z.object({
    diaPrincipal: z.string(),
    franjas: z.array(
      z.object({ desde: z.string(), hasta: z.string(), entregas: z.number(), porciones: z.number() }),
    ),
    totalEntregas: z.number(),
    totalPorciones: z.number(),
    fueraDeDia: z.array(z.object({ dia: z.string(), entregas: z.number(), porciones: z.number() })),
  }),
};

const gananciaPorPersonaSchema = z.array(
  z.object({ personaId: z.string(), nombre: z.string(), ganancia: z.number() }),
);

/** Un lado de un evento mixto. `neto` = lo que efectivamente le queda a ese destino. */
const destinoLadoSchema = z.object({
  recaudado: z.number(),
  ganancia: z.number(),
  unidades: z.number(),
  pendienteCobro: z.number(),
  neto: z.number(),
});

export const reporteEventoSchema = z.discriminatedUnion('variante', [
  z.object({ ...ventaBaseShape, variante: z.literal(REPORTE_VARIANTE.VENTA_CAJA_GRUPO) }),
  z.object({
    ...ventaBaseShape,
    variante: z.literal(REPORTE_VARIANTE.VENTA_CUENTAS_PERSONALES),
    gananciaPorPersona: gananciaPorPersonaSchema,
  }),
  z.object({
    ...ventaBaseShape,
    variante: z.literal(REPORTE_VARIANTE.VENTA_MIXTA),
    gananciaPorPersona: gananciaPorPersonaSchema,
    porDestino: z.object({ cajaGrupo: destinoLadoSchema, cuentasPersonales: destinoLadoSchema }),
  }),
  z.object({
    ...reporteBaseShape,
    variante: z.literal(REPORTE_VARIANTE.GRUPO),
    ingresosItemizados: z.array(
      z.object({
        descripcion: z.string(),
        responsableNombre: nullableField(z.string()),
        medioPago: z.string(),
        monto: z.number(),
        fecha: instantSchema,
      }),
    ),
  }),
]);

export type ReporteEvento = z.infer<typeof reporteEventoSchema>;
