import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Receipt } from 'lucide-react';

import { ActionsMenu } from '@/shared/components/data';

const ITEMS = [
  { key: 'gasto', label: 'Registrar Gasto', href: '/movimientos/nuevo', icon: Receipt },
  { key: 'evento', label: 'Crear Evento', href: '/eventos/crear' },
] as const;

describe('<ActionsMenu>', () => {
  it('muestra el botón con su etiqueta y las opciones cerradas', () => {
    render(<ActionsMenu label="Acciones" items={ITEMS} />);
    expect(screen.getByRole('button', { name: 'Acciones' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('al abrirlo, cada opción es un link a su ruta', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu label="Acciones" items={ITEMS} />);
    await user.click(screen.getByRole('button', { name: 'Acciones' }));
    expect(await screen.findByRole('menuitem', { name: 'Registrar Gasto' })).toHaveAttribute('href', '/movimientos/nuevo');
    expect(screen.getByRole('menuitem', { name: 'Crear Evento' })).toHaveAttribute('href', '/eventos/crear');
  });

  it('variante primary usa el color de marca', () => {
    render(<ActionsMenu label="Acciones" items={ITEMS} variant="primary" />);
    expect(screen.getByRole('button', { name: 'Acciones' }).className).toContain('bg-brand');
  });
});

