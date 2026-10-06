/** Mensajes de error HTTP (port literal de `ErrorHandlerService.getErrorMessage`). */
export const HTTP_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  0: 'No se pudo conectar con el servidor. Verifique su conexión.',
  400: 'Error en los datos enviados. Verifique los campos.',
  401: 'No autorizado. Inicie sesión nuevamente.',
  403: 'No tiene permisos para realizar esta acción.',
  404: 'Recurso no encontrado.',
  409: 'Conflicto con los datos existentes.',
  422: 'Datos inválidos. Verifique la información.',
  500: 'Error del servidor. Intente más tarde.',
  503: 'Servicio no disponible. Intente más tarde.',
};

export const API_ERROR_COPY = {
  UNEXPECTED: 'Ocurrió un error inesperado.',
  CONTRACT: 'El servidor respondió algo inesperado. Intente nuevamente.',
} as const;
