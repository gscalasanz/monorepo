import { act, render, screen } from '@testing-library/react';

import { AppToaster } from '@/shared/notifications/app-toaster';
import { notify } from '@/shared/notifications/notify';

function toastOf(text: string): HTMLElement {
  const toast = screen
    .getByText(text)
    .closest<HTMLElement>('[data-sonner-toast]');
  if (!toast) throw new Error(`sin toast para "${text}"`);
  return toast;
}

describe('<AppToaster>', () => {
  it('éxito en verde y error en rojo (colores de estado, no gris)', async () => {
    render(<AppToaster />);
    act(() => {
      notify.success('Movimiento creado');
      notify.error('No se pudo eliminar');
    });
    await screen.findByText('Movimiento creado');

    expect(toastOf('Movimiento creado')).toHaveAttribute(
      'data-rich-colors',
      'true',
    );
    expect(toastOf('Movimiento creado')).toHaveAttribute(
      'data-type',
      'success',
    );
    expect(toastOf('No se pudo eliminar')).toHaveAttribute(
      'data-type',
      'error',
    );

    const toaster = toastOf('Movimiento creado').closest<HTMLElement>(
      '[data-sonner-toaster]',
    );
    expect(toaster?.style.getPropertyValue('--success-bg')).toBe(
      'var(--color-success)',
    );
    expect(toaster?.style.getPropertyValue('--error-bg')).toBe(
      'var(--color-danger)',
    );
  });
});
