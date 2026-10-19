/**
 * Enums de caja. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  CajaType as CAJA_TYPE,
  type CajaType,
} from '@scout/shared/enums';

export { CAJA_TYPE };
export type { CajaType };
import type { Rama } from '@/shared/domain/persona';

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
