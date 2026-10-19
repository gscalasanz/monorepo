/** Vocabulario de dominio de cajas (cuentas). Ver docs/adr/0001-representacion-enums.md. */

/**
 * Tipo de caja (PRD §2.3): caja de grupo, fondos de rama (x4) y cuentas personales.
 * El saldo nunca se persiste: se calcula siempre desde los movimientos.
 */
export const CajaType = {
  GRUPO: 'grupo',
  RAMA_MANADA: 'rama_manada',
  RAMA_UNIDAD: 'rama_unidad',
  RAMA_CAMINANTES: 'rama_caminantes',
  RAMA_ROVERS: 'rama_rovers',
  PERSONAL: 'personal',
  /**
   * Caja que financia las bonificaciones. Su plata NO es parte de la caja grupo: solo entra
   * a la caja grupo en el momento de otorgar una bonificación.
   */
  FONDO_SOLIDARIO: 'fondo_solidario',
} as const;
export type CajaType = (typeof CajaType)[keyof typeof CajaType];
