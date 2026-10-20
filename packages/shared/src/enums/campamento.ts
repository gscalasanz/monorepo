/** Vocabulario de dominio de campamentos. Ver docs/adr/0001-representacion-enums.md. */

/** Estado de pago de un participante de campamento. */
export const EstadoPagoCampamento = {
  PENDIENTE: 'pendiente',
  PARCIAL: 'parcial',
  PAGADO: 'pagado',
  /** Monto asignado 0: no se espera pago (típicamente educadores). */
  EXENTO: 'exento',
} as const;
export type EstadoPagoCampamento = (typeof EstadoPagoCampamento)[keyof typeof EstadoPagoCampamento];
