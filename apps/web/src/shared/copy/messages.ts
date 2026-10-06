/** Copy genérico de notificaciones y diálogos (port de `MESSAGES` de Angular). */
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Creado exitosamente',
    UPDATE: 'Actualizado exitosamente',
    DELETE: 'Eliminado exitosamente',
    SAVE: 'Guardado exitosamente',
    PAYMENT: 'Pago registrado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ocurrió un error inesperado',
    NETWORK: 'Error de conexión. Verifique su internet.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado',
    UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
    VALIDATION: 'Por favor, corrija los errores en el formulario',
    SERVER: 'Error en el servidor. Intente nuevamente.',
  },
  CONFIRM: {
    DELETE: '¿Está seguro que desea eliminar este registro?',
    CANCEL:
      '¿Está seguro que desea cancelar? Los cambios no guardados se perderán.',
    DAR_BAJA:
      '¿Está seguro que desea dar de baja a esta persona? El saldo se transferirá a la caja de grupo.',
  },
  LOADING: {
    DEFAULT: 'Cargando...',
    SAVING: 'Guardando...',
    DELETING: 'Eliminando...',
  },
  EMPTY: {
    PERSONAS: 'No hay personas registradas',
    MOVIMIENTOS: 'No hay movimientos registrados',
    CAMPAMENTOS: 'No hay campamentos registrados',
    EVENTOS: 'No hay eventos registrados',
    INSCRIPCIONES: 'No hay inscripciones registradas',
  },
} as const;
