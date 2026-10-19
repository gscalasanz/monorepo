import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormActions } from '@/shared/components/ui/form/form-actions';

function barOf(label: string): HTMLElement {
  const bar = screen
    .getByRole('button', { name: label })
    .closest('div[class*="sticky"]');
  if (!bar) throw new Error('barra no encontrada');
  return bar as HTMLElement;
}

describe('FormActions', () => {
  it('muestra Cancelar y Guardar', () => {
    render(
      <FormActions
        onCancel={() => undefined}
        cancelLabel="Cancelar"
        saveLabel="Guardar"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('la barra es sticky abajo: queda en el flujo, así que al final de la página siempre se ve', () => {
    render(<FormActions onCancel={() => undefined} saveLabel="Guardar" />);
    const classes = barOf('Guardar').className;
    expect(classes).toContain('sticky');
    expect(classes).toContain('bottom-0');
    expect(classes).not.toMatch(/(^|\s)fixed(\s|$)/);
  });
});
