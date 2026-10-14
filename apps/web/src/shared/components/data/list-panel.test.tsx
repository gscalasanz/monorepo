import { render, screen, within } from '@testing-library/react';

import { ListPanel, ListToolbar } from '@/shared/components/data/list-panel';

describe('ListPanel', () => {
  it('agrupa en un solo card la barra de filtros y el contenido', () => {
    render(
      <ListPanel toolbar={<ListToolbar>filtros</ListToolbar>}>
        <p>tabla</p>
      </ListPanel>,
    );
    const card = screen.getByRole('region', { name: 'Listado' });
    expect(within(card).getByText('filtros')).toBeInTheDocument();
    expect(within(card).getByText('tabla')).toBeInTheDocument();
  });

  it('sin toolbar renderiza solo el contenido', () => {
    render(
      <ListPanel ariaLabel="Personas">
        <p>tabla</p>
      </ListPanel>,
    );
    expect(screen.getByRole('region', { name: 'Personas' })).toHaveTextContent(
      'tabla',
    );
  });
});
