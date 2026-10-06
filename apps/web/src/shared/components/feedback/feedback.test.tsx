import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Undo2 } from 'lucide-react';

import { EmptyState, ErrorState, LoadingState, NotFoundView } from '@/shared/components/feedback';

describe('<EmptyState>', () => {
  it('título por defecto', () => {
    render(<EmptyState />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('título, pista, ícono decorativo y acción', () => {
    const { container } = render(
      <EmptyState icon={Undo2} title="Nada para devolverle a Valentina" hint="Aparecerá cuando pague algo de su bolsillo." action={<button type="button">Cargar gasto</button>} />,
    );
    expect(screen.getByText('Nada para devolverle a Valentina')).toBeInTheDocument();
    expect(screen.getByText('Aparecerá cuando pague algo de su bolsillo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cargar gasto' })).toBeInTheDocument();
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass('size-9', 'bg-recessed');
  });
});

describe('<LoadingState> / <ErrorState> / <NotFoundView>', () => {
  it.each(['spinner', 'skeleton'] as const)('%s anuncia "Cargando…"', (variant) => {
    render(<LoadingState variant={variant} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
  });

  it('error con reintento', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Se cortó la conexión" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Se cortó la conexión');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('404 con link al dashboard', () => {
    render(<NotFoundView />);
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/dashboard');
  });
});
