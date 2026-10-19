/** Enums de campamento — espejo de `backend/src/common/enums/index.ts`. */

export const ESTADO_PAGO_CAMPAMENTO = {
  PENDIENTE: 'pendiente',
  PARCIAL: 'parcial',
  PAGADO: 'pagado',
  /** Monto asignado 0: no se espera pago (típicamente educadores). */
  EXENTO: 'exento',
} as const;

export type EstadoPagoCampamento =
  (typeof ESTADO_PAGO_CAMPAMENTO)[keyof typeof ESTADO_PAGO_CAMPAMENTO];

export const ESTADO_PAGO_CAMPAMENTO_LABELS: Readonly<
  Record<EstadoPagoCampamento, string>
> = {
  pendiente: 'Pendiente',
  parcial: 'Pago Parcial',
  pagado: 'Pagado',
  exento: 'Exento',
};
