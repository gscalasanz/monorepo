/** Pestañas del detalle; la activa vive en la URL (`?tab=`) como en eventos. */
export const CAMP_TAB = {
  PARTICIPANTES: 'participantes',
  MOVIMIENTOS: 'movimientos',
} as const;

export type CampTab = (typeof CAMP_TAB)[keyof typeof CAMP_TAB];

export const CAMP_TAB_QUERY_PARAM = 'tab';

const TAB_VALUES: readonly string[] = Object.values(CAMP_TAB);

function isCampTab(value: string | null): value is CampTab {
  return value !== null && TAB_VALUES.includes(value);
}

export function resolveCampTab(requested: string | null): CampTab {
  return isCampTab(requested) ? requested : CAMP_TAB.PARTICIPANTES;
}
