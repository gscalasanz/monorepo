/** Enums de evento — espejo de `backend/src/common/enums/index.ts`. */

export const TIPO_EVENTO = {
  VENTA: 'venta',
  GRUPO: 'grupo',
} as const;

export type TipoEvento = (typeof TIPO_EVENTO)[keyof typeof TIPO_EVENTO];

export const TIPO_EVENTO_LABELS: Readonly<Record<TipoEvento, string>> = {
  venta: 'Evento de Venta',
  grupo: 'Evento de Grupo',
};

/** Destino de la ganancia de las ventas. */
export const DESTINO_GANANCIA = {
  CUENTAS_PERSONALES: 'cuentas_personales',
  CAJA_GRUPO: 'caja_grupo',
} as const;

export type DestinoGanancia =
  (typeof DESTINO_GANANCIA)[keyof typeof DESTINO_GANANCIA];

export const DESTINO_GANANCIA_LABELS: Readonly<
  Record<DestinoGanancia, string>
> = {
  cuentas_personales: 'Cuentas Personales',
  caja_grupo: 'Caja de Grupo',
};

/**
 * Todas las ventas con un destino (UNICA) o cada una el suyo (MIXTA). En MIXTA los
 * gastos se imputan 100% al grupo.
 */
export const MODALIDAD_VENTA = {
  UNICA: 'unica',
  MIXTA: 'mixta',
} as const;

export type ModalidadVenta =
  (typeof MODALIDAD_VENTA)[keyof typeof MODALIDAD_VENTA];

export const MODALIDAD_VENTA_LABELS: Readonly<Record<ModalidadVenta, string>> =
  {
    unica: 'Un solo destino',
    mixta: 'Mixta (destino por venta)',
  };

/** Si la plata de la venta ya entró o queda a cobrar. */
export const ESTADO_COBRO_VENTA = {
  COBRADO: 'cobrado',
  PENDIENTE: 'pendiente',
} as const;

export type EstadoCobroVenta =
  (typeof ESTADO_COBRO_VENTA)[keyof typeof ESTADO_COBRO_VENTA];

export const ESTADO_COBRO_VENTA_LABELS: Readonly<
  Record<EstadoCobroVenta, string>
> = {
  cobrado: 'Cobrado',
  pendiente: 'A cobrar',
};
