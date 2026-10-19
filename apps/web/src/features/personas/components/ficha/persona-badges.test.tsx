import { render, screen } from '@testing-library/react';

import { PersonaBadges } from '@/features/personas/components/ficha/persona-badges';

describe('<PersonaBadges>', () => {
  it('no repite el cargo cuando coincide con el tipo ("Educador")', () => {
    render(
      <PersonaBadges
        persona={{
          id: 'e1',
          nombre: 'Mora',
          tipo: 'educador',
          estado: 'activo',
          rama: 'Rovers',
          cargo: 'Educador',
        }}
      />,
    );
    expect(screen.getAllByText('Educador')).toHaveLength(1);
  });

  it('muestra el cargo cuando agrega información', () => {
    render(
      <PersonaBadges
        persona={{
          id: 'e2',
          nombre: 'Laura',
          tipo: 'educador',
          estado: 'activo',
          rama: null,
          cargo: 'Jefe de Grupo',
        }}
      />,
    );
    expect(screen.getByText('Educador')).toBeInTheDocument();
    expect(screen.getByText('Jefe de Grupo')).toBeInTheDocument();
  });
});
