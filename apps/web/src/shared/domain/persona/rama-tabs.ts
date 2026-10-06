/** Claves URL-friendly de cada rama (port de `shared/constants/rama.constants.ts`). */
import { RAMA, type Rama } from '@/shared/domain/persona/enums';

export const RAMA_TAB_KEYS = {
  Manada: 'manada',
  Unidad: 'unidad',
  Caminantes: 'caminantes',
  Rovers: 'rovers',
} as const satisfies Record<Rama, string>;

export type RamaTabKey = (typeof RAMA_TAB_KEYS)[Rama];

const TAB_KEY_TO_RAMA: Readonly<Record<RamaTabKey, Rama>> = {
  manada: RAMA.MANADA,
  unidad: RAMA.UNIDAD,
  caminantes: RAMA.CAMINANTES,
  rovers: RAMA.ROVERS,
};

export function isRamaTabKey(key: string): key is RamaTabKey {
  return Object.hasOwn(TAB_KEY_TO_RAMA, key);
}

/** Rama de una tab key, o `undefined` si la tab no es de rama. */
export function ramaFromTabKey(key: string): Rama | undefined {
  return isRamaTabKey(key) ? TAB_KEY_TO_RAMA[key] : undefined;
}
