import { CONFIRM_COPY } from '@/shared/confirm/copy';

/** Pista según el mensaje del backend (paridad con `ConfirmDialogComponent.handleError`). */
export function errorHintFor(message: string): string {
  if (message.includes('movimiento(s) asociado(s)')) {
    return CONFIRM_COPY.HINT_LINKED_MOVEMENTS;
  }
  if (message.includes('no encontrad')) return CONFIRM_COPY.HINT_NOT_FOUND;
  return '';
}
