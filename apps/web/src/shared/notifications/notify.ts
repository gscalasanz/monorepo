/**
 * Notificaciones al usuario (port de `NotificationService`). Fachada sobre
 * sonner: los features llaman `notify.success(...)`, nunca a sonner directo.
 * Errores duran el doble, como en Angular.
 */
import { toast } from 'sonner';

import { UI_CONFIG } from '@/shared/constants';

const ERROR_DURATION_FACTOR = 2;

export const notify = {
  success: (message: string): void => {
    toast.success(message, { duration: UI_CONFIG.TOAST_DURATION_MS });
  },
  error: (message: string): void => {
    toast.error(message, {
      duration: UI_CONFIG.TOAST_DURATION_MS * ERROR_DURATION_FACTOR,
    });
  },
  warning: (message: string): void => {
    toast.warning(message, { duration: UI_CONFIG.TOAST_DURATION_MS });
  },
  info: (message: string): void => {
    toast.info(message, { duration: UI_CONFIG.TOAST_DURATION_MS });
  },
} as const;
