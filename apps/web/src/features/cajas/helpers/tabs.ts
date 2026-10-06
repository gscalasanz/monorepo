import {
  CAJAS_TAB,
  CAJAS_TABS,
  type CajasTab,
} from '@/features/cajas/constants/cajas';

function isCajasTab(value: string): value is CajasTab {
  return (CAJAS_TABS as readonly string[]).includes(value);
}

/** Tab del query param; cualquier valor desconocido cae en la default (`grupo`). */
export function parseCajasTab(value: string | null | undefined): CajasTab {
  return value && isCajasTab(value) ? value : CAJAS_TAB.GRUPO;
}
