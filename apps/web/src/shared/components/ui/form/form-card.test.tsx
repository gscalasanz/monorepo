import { render, screen } from '@testing-library/react';

import { FormCard } from './form-card';

describe('FormCard', () => {
  it('es una sección nombrada que agrupa los campos, sin título visible', () => {
    render(
      <FormCard label="Datos del evento">
        <input aria-label="Nombre" />
      </FormCard>,
    );
    const section = screen.getByRole('region', { name: 'Datos del evento' });
    expect(section).toContainElement(screen.getByLabelText('Nombre'));
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
