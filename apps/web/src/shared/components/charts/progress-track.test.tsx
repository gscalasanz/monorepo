import { render, screen } from '@testing-library/react';

import { ProgressTrack } from '@/shared/components/charts';

const fillOf = (container: HTMLElement): HTMLElement => {
  const fill = container.querySelector<HTMLElement>('[data-fill]');
  if (!fill) throw new Error('sin relleno');
  return fill;
};

describe('<ProgressTrack>', () => {
  it('rellena el porcentaje value/max', () => {
    const { container } = render(<ProgressTrack value={25} max={100} />);
    expect(fillOf(container).style.width).toBe('25%');
  });

  it('acota entre 0 y 100 y tolera max 0', () => {
    const over = render(<ProgressTrack value={300} max={100} />);
    expect(fillOf(over.container).style.width).toBe('100%');
    const empty = render(<ProgressTrack value={5} max={0} />);
    expect(fillOf(empty.container).style.width).toBe('0%');
  });

  it('es decorativo salvo que se pase ariaLabel', () => {
    const { container } = render(<ProgressTrack value={1} max={2} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    render(<ProgressTrack value={1} max={2} ariaLabel="Pagado" />);
    expect(screen.getByRole('progressbar', { name: 'Pagado' })).toHaveAttribute('aria-valuenow', '50');
  });

  it('usa el color indicado (variable de token)', () => {
    const { container } = render(<ProgressTrack value={1} max={2} color="var(--color-rama-manada)" />);
    expect(fillOf(container).style.background).toContain('--color-rama-manada');
  });
});
