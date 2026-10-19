/** Copy del diálogo de confirmación (port de `ConfirmDialogComponent`). */
export const CONFIRM_COPY = {
  CONFIRM: 'Confirmar',
  CANCEL: 'Cancelar',
  DELETE: 'Eliminar',
  CLOSE: 'Cerrar',
  DEFAULT_ENTITY: 'registro',
  UNEXPECTED: 'Ocurrió un error inesperado. Intenta nuevamente.',
  deleteTitle: (entity: string): string => `Eliminar ${entity}`,
  deleteMessage: (entity: string): string =>
    `¿Estás seguro de que deseas eliminar este ${entity}? Esta acción no se puede deshacer.`,
  loading: (entity: string, destructive: boolean): string =>
    destructive
      ? `Eliminando ${entity}. Por favor espera.`
      : `Procesando ${entity}. Por favor espera.`,
  successTitle: (destructive: boolean): string =>
    destructive ? 'Eliminado correctamente' : 'Completado',
  successMessage: (entity: string, destructive: boolean): string => {
    const titled = entity.charAt(0).toUpperCase() + entity.slice(1);
    return destructive
      ? `${titled} eliminado exitosamente.`
      : `${titled} procesado exitosamente.`;
  },
  HINT_LINKED_MOVEMENTS:
    'Primero debes eliminar los movimientos relacionados antes de poder eliminar este registro.',
  HINT_NOT_FOUND: 'Es posible que este registro ya haya sido eliminado.',
} as const;

/** Tiempo que queda visible el estado de éxito antes de cerrar (paridad: 1200ms). */
export const CONFIRM_SUCCESS_CLOSE_MS = 1200;
