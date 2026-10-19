/** Enums de caja — espejo de `backend/src/common/enums/index.ts`. */
import type { Rama } from '@/shared/domain/persona';

export const CAJA_TYPE = {
  GRUPO: 'grupo',
  RAMA_MANADA: 'rama_manada',
  RAMA_UNIDAD: 'rama_unidad',
  RAMA_CAMINANTES: 'rama_caminantes',
  RAMA_ROVERS: 'rama_rovers',
  PERSONAL: 'personal',
  /** Financia las bonificaciones. Su plata NO es parte de la caja grupo. */
  FONDO_SOLIDARIO: 'fondo_solidario',
} as const;

export type CajaType = (typeof CAJA_TYPE)[keyof typeof CAJA_TYPE];

export const CAJA_TYPE_LABELS: Readonly<Record<CajaType, string>> = {
  grupo: 'Caja de Grupo',
  rama_manada: 'Fondo Manada',
  rama_unidad: 'Fondo Unidad',
  rama_caminantes: 'Fondo Caminantes',
  rama_rovers: 'Fondo Rovers',
  personal: 'Cuenta Personal',
  fondo_solidario: 'Fondo Solidario',
};

export const FONDO_RAMA_TYPES = [
  CAJA_TYPE.RAMA_MANADA,
  CAJA_TYPE.RAMA_UNIDAD,
  CAJA_TYPE.RAMA_CAMINANTES,
  CAJA_TYPE.RAMA_ROVERS,
] as const;

export type FondoRamaType = (typeof FONDO_RAMA_TYPES)[number];

/** Fondo de cada rama (port de `SaldoCalculatorService`). */
export const RAMA_TO_CAJA_TYPE: Readonly<Record<Rama, FondoRamaType>> = {
  Manada: CAJA_TYPE.RAMA_MANADA,
  Unidad: CAJA_TYPE.RAMA_UNIDAD,
  Caminantes: CAJA_TYPE.RAMA_CAMINANTES,
  Rovers: CAJA_TYPE.RAMA_ROVERS,
};
