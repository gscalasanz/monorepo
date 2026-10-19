import { MESSAGES } from '@/shared/copy';

describe('MESSAGES (copy de Angular)', () => {
  it('conserva los textos de notificaciones', () => {
    expect(MESSAGES.SUCCESS.PAYMENT).toBe('Pago registrado exitosamente');
    expect(MESSAGES.ERROR.NETWORK).toBe(
      'Error de conexión. Verifique su internet.',
    );
    expect(MESSAGES.EMPTY.EVENTOS).toBe('No hay eventos registrados');
  });
});
