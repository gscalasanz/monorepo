import { ApiError, extractErrorMessage, isApiError } from '@/shared/api';

function httpError(status: number, body?: unknown): ApiError {
  return new ApiError({ kind: 'http', status, body, method: 'GET', url: '/x' });
}

describe('ApiError', () => {
  it('es un Error con status, body y kind', () => {
    const error = httpError(404, { statusCode: 404, message: 'No existe' });
    expect(error).toBeInstanceOf(Error);
    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(404);
    expect(error.message).toBe('No existe');
  });

  it('isApiError rechaza otras cosas', () => {
    expect(isApiError(new Error('x'))).toBe(false);
    expect(isApiError({ status: 404 })).toBe(false);
  });
});

describe('extractErrorMessage (port de ErrorHandlerService)', () => {
  it('usa el message string de NestJS', () => {
    expect(
      extractErrorMessage(
        httpError(404, { message: 'Persona con ID x no encontrada' }),
      ),
    ).toBe('Persona con ID x no encontrada');
  });

  it('une con ". " el array de class-validator (ignorando no-strings)', () => {
    expect(
      extractErrorMessage(
        httpError(400, {
          message: ['monto must be positive', 7, 'fecha is required'],
        }),
      ),
    ).toBe('monto must be positive. fecha is required');
  });

  it.each([
    [400, 'Error en los datos enviados. Verifique los campos.'],
    [401, 'No autorizado. Inicie sesión nuevamente.'],
    [403, 'No tiene permisos para realizar esta acción.'],
    [404, 'Recurso no encontrado.'],
    [409, 'Conflicto con los datos existentes.'],
    [422, 'Datos inválidos. Verifique la información.'],
    [500, 'Error del servidor. Intente más tarde.'],
    [503, 'Servicio no disponible. Intente más tarde.'],
    [0, 'No se pudo conectar con el servidor. Verifique su conexión.'],
    [418, 'Ocurrió un error inesperado.'],
  ])('sin message usa el fallback por status %i', (status, expected) => {
    expect(extractErrorMessage(httpError(status, { message: [] }))).toBe(
      expected,
    );
    expect(extractErrorMessage(httpError(status, ''))).toBe(expected);
  });

  it('un Error común usa su message', () => {
    expect(extractErrorMessage(new Error('Algo falló'))).toBe('Algo falló');
  });

  it('cualquier otra cosa usa el fallback dado o el genérico', () => {
    expect(extractErrorMessage('x', 'No se pudo guardar')).toBe(
      'No se pudo guardar',
    );
    expect(extractErrorMessage(undefined)).toBe('Ocurrió un error inesperado.');
  });

  it('respuesta con forma inesperada (contrato roto)', () => {
    const error = new ApiError({
      kind: 'contract',
      status: 200,
      method: 'GET',
      url: '/x',
    });
    expect(extractErrorMessage(error)).toBe(
      'El servidor respondió algo inesperado. Intente nuevamente.',
    );
  });
});
