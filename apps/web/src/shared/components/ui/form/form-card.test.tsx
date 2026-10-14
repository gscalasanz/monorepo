import { render, screen } from '@testing-library/react';

import { FormCard } from './form-card';

describe('FormCard', () => {
  it('es una sección nombrada por su título, con descripción opcional', () => {
    render(
      <FormCard title="Datos del evento" description="Lo básico">
        <input aria-label="Nombre" />
      </FormCard>,
    );
    const section = screen.getByRole('region', { name: 'Datos del evento' });
    expect(section).toContainElement(screen.getByLabelText('Nombre'));
    expect(screen.getByText('Lo básico')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Datos del evento' }),
    ).toBeInTheDocument();
  });
});
