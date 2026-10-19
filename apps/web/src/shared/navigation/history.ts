/**
 * Profundidad de navegación interna de la sesión. Next no expone el historial del navegador:
 * lo reconstruimos contando entradas (push suma, "atrás" del navegador resta). Con profundidad
 * ≤ 1 la página es la primera que se abrió (link directo / recarga) y no hay a dónde volver.
 */
const FIRST_DEPTH = 1;

interface HistoryState {
  readonly depth: number;
  readonly lastKey: string | null;
  readonly popPending: boolean;
}

const INITIAL_STATE: HistoryState = { depth: 0, lastKey: null, popPending: false };

let state: HistoryState = INITIAL_STATE;

/** Registra una vista nueva; la misma clave consecutiva (StrictMode, re-render) se ignora. */
export function recordNavigation(key: string): void {
  if (state.lastKey === key) return;
  const depth = state.popPending ? state.depth - 1 : state.depth + 1;
  state = { depth: Math.max(depth, FIRST_DEPTH), lastKey: key, popPending: false };
}

/** El navegador disparó `popstate`: la próxima vista es un retroceso/avance, no un push. */
export function markHistoryPop(): void {
  state = { ...state, popPending: true };
}

export function canGoBackInApp(): boolean {
  return state.depth > FIRST_DEPTH;
}

/** Solo tests. */
export function resetNavigationHistory(): void {
  state = INITIAL_STATE;
}
