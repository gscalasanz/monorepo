import {
  DEFAULT_TAB,
  PERSONAS_TABS,
  type PersonasTab,
} from '@/features/personas/constants/personas';

function isPersonasTab(value: string): value is PersonasTab {
  return (PERSONAS_TABS as readonly string[]).includes(value);
}

/** Tab del query param; cualquier valor desconocido cae en la default (Manada). */
export function parsePersonasTab(
  value: string | null | undefined,
): PersonasTab {
  return value && isPersonasTab(value) ? value : DEFAULT_TAB;
}
