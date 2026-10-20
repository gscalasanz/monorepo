/** Vocabulario de dominio de eventos. Ver docs/adr/0001-representacion-enums.md. */

/** Tipo de evento (PRD §3.4, F10/F11): de venta o de grupo. */
export const TipoEvento = {
  VENTA: 'venta',
  GRUPO: 'grupo',
} as const;
export type TipoEvento = (typeof TipoEvento)[keyof typeof TipoEvento];

/**
 * Destino de la ganancia de un evento de venta (PRD §3.4, F10). Vive en Evento Y en
 * VentaProducto: en el evento es el default de las ventas nuevas; en la venta es el que
 * decide qué caja recibe el margen. Solo difieren en eventos MIXTA.
 */
export const DestinoGanancia = {
  CUENTAS_PERSONALES: 'cuentas_personales',
  CAJA_GRUPO: 'caja_grupo',
} as const;
export type DestinoGanancia = (typeof DestinoGanancia)[keyof typeof DestinoGanancia];

/**
 * UNICA: todas las ventas heredan evento.destinoGanancia (mandar destino por venta se
 * rechaza). MIXTA: cada venta declara su destino; los gastos son del evento y se imputan
 * 100% al grupo (no reducen el neto personal).
 */
export const ModalidadVenta = {
  UNICA: 'unica',
  MIXTA: 'mixta',
} as const;
export type ModalidadVenta = (typeof ModalidadVenta)[keyof typeof ModalidadVenta];

/**
 * Si la plata de una venta ya se cobró. PENDIENTE cubre pedidos sin pago (típicamente por
 * WhatsApp). Es la fuente de la que se deriva el EstadoPago del movimiento vinculado:
 * PENDIENTE → PENDIENTE_COBRO, así el saldo de la caja no cambia hasta cobrar.
 */
export const EstadoCobroVenta = {
  COBRADO: 'cobrado',
  PENDIENTE: 'pendiente',
} as const;
export type EstadoCobroVenta = (typeof EstadoCobroVenta)[keyof typeof EstadoCobroVenta];
