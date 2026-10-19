import { render, screen } from '@testing-library/react';

import { DirectionTile, RamaChip, StatusBadge } from '@/shared/components/data';

describe('<StatusBadge>', () => {
  it.each([
    ['pagado', 'Pagado', 'success'],
    ['parcial', 'Parcial', 'warning'],
    ['bonificado', 'Bonificado', 'info'],
    ['a_reembolsar', 'A reembolsar', 'info'],
    ['vencido', 'Vencido', 'danger'],
    ['IN_PROGRESS', 'In progress', 'info'],
    ['desconocido', 'Desconocido', 'neutral'],
  ])('%s → texto "%s" + tono %s + ícono', (status, text, tone) => {
    const { container } = render(<StatusBadge status={status} />);
    const badge = screen.getByText(text);
    expect(badge).toHaveAttribute('data-tone', tone);
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('label y tone explícitos ganan', () => {
    render(<StatusBadge status="pendiente" label="Vence 15 oct" tone="danger" />);
    expect(screen.getByText('Vence 15 oct')).toHaveAttribute('data-tone', 'danger');
  });

  it('hideIcon para badges de categoría', () => {
    const { container } = render(<StatusBadge label="Protagonista" hideIcon />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('<RamaChip> / <DirectionTile>', () => {
  it('rama con nombre y punto de color', () => {
    const { container } = render(<RamaChip rama="Manada" />);
    expect(screen.getByText('Manada')).toHaveClass('bg-rama-manada-soft');
    expect(container.querySelector('.bg-rama-manada')).toBeInTheDocument();
  });

  it('valor fuera de las ramas usa fallback', () => {
    render(<RamaChip rama="Educadores" variant="dot" />);
    expect(screen.getByText('Educadores')).not.toHaveClass('bg-recessed');
  });

  it('tile de dirección con nombre accesible', () => {
    render(<DirectionTile direction="in" />);
    expect(screen.getByRole('img', { name: 'Ingreso' })).toHaveAttribute('data-direction', 'in');
  });
});
