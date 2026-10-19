/**
 * Single flight: mientras una ejecución está en curso, toda llamada recibe la
 * misma promesa (cola de refresh: N 401 concurrentes → un solo `auth/refresh`).
 * A diferencia del Angular, si falla rechaza a todos los que esperaban (allá
 * quedaban colgados para siempre).
 */
export function createSingleFlight<T>(
  task: () => Promise<T>,
): () => Promise<T> {
  let inFlight: Promise<T> | null = null;
  return () => {
    inFlight ??= task().finally(() => {
      inFlight = null;
    });
    return inFlight;
  };
}
