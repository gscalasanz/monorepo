/**
 * Keep-alive del backend (port de `KeepAliveService` + `keepAliveInterceptor`):
 * Render free tier duerme el servicio a los 15 min sin tráfico, así que tras 14
 * min sin requests reales se hace un `GET /` (público, texto plano). El ping no
 * reinicia el timer (`isKeepAlive`), pero sí lo reprograma al terminar.
 */
import { MS_PER_MINUTE } from '@/shared/time';

const KEEP_ALIVE_MINUTES = 14;

export const KEEP_ALIVE_MS = KEEP_ALIVE_MINUTES * MS_PER_MINUTE;

export interface KeepAliveDeps {
  readonly ping: () => Promise<unknown>;
  readonly delayMs?: number;
}

export interface KeepAlive {
  /** Llamar en cada request real: reinicia la cuenta regresiva. */
  notifyActivity(): void;
  /** Cancela el ping pendiente (equivale a `ngOnDestroy`). */
  stop(): void;
}

export function createKeepAlive({
  ping,
  delayMs = KEEP_ALIVE_MS,
}: KeepAliveDeps): KeepAlive {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const stop = (): void => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = null;
  };

  const schedule = (): void => {
    stop();
    timerId = setTimeout(() => {
      // El error del ping ya lo reporta el cliente; acá solo se reprograma.
      ping().then(schedule, schedule);
    }, delayMs);
  };

  return { notifyActivity: schedule, stop };
}
