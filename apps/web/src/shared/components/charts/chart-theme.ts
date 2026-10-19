/**
 * Tema de gráficos: SOLO variables CSS de tokens (light/dark las resuelve el CSS).
 * Series categóricas en orden fijo (nunca cicladas por rank): DESIGN `--color-data-1…5`.
 */
export const SERIES_COLORS = [
  'var(--color-data-1)',
  'var(--color-data-2)',
  'var(--color-data-3)',
  'var(--color-data-4)',
  'var(--color-data-5)',
] as const;

export const CHART_COLORS = {
  grid: 'var(--color-border)',
  axis: 'var(--color-ink-subtle)',
  cursor: 'var(--color-recessed)',
  surface: 'var(--color-surface)',
  moneyIn: 'var(--color-money-in)',
  moneyOut: 'var(--color-ink-subtle)',
} as const;

/** Ejes recesivos: 11px, ink-subtle, sin línea. */
export const AXIS_TICK = { fill: CHART_COLORS.axis, fontSize: 11 } as const;

/** Extremos de dato redondeados 4px, anclados a la base. */
export const BAR_RADIUS = {
  vertical: [4, 4, 0, 0] as [number, number, number, number],
  horizontal: [0, 4, 4, 0] as [number, number, number, number],
} as const;

export const CHART_DEFAULT_HEIGHT = 240;

/** Ancho máximo de cada barra (px) y separación entre barras pareadas. */
export const BAR_MAX_SIZE = 28;
export const BAR_GAP = 2;

/** Color de la serie `index` (las de más de 5 deben agruparse en "Otros"). */
export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length] ?? SERIES_COLORS[0];
}
