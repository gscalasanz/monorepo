import { render, screen } from '@testing-library/react';

import { Money, MINUS_SIGN, formatSignedMoney, toMoneyParts } from '@/shared/components/data';

const NBSP = ' ';

describe('toMoneyParts / formatSignedMoney', () => {
  it('ingreso: + y dirección in', () => {
    expect(toMoneyParts(60000, { sign: 'in' })).toEqual({ sign: '+', symbol: '$', digits: '60.000', direction: 'in' });
  });

  it('egreso: U+2212 (no guion) aunque el monto venga positivo', () => {
    expect(formatSignedMoney(17600, { sign: 'out' })).toBe(`${MINUS_SIGN}$${NBSP}17.600`);
  });

  it('auto: el signo sale del monto', () => {
    expect(toMoneyParts(-500, { sign: 'auto' }).direction).toBe('out');
    expect(toMoneyParts(500, { sign: 'auto' }).direction).toBe('in');
    expect(toMoneyParts(0, { sign: 'auto' })).toMatchObject({ sign: '', direction: 'neutral' });
  });

  it("sign 'in' con monto negativo: manda el monto (−, dirección out)", () => {
    expect(toMoneyParts(-500, { sign: 'in' })).toMatchObject({ sign: MINUS_SIGN, direction: 'out' });
  });

  it('sin sign: negativo igual lleva U+2212, sin color', () => {
    expect(toMoneyParts(-1500)).toMatchObject({ sign: MINUS_SIGN, digits: '1.500', direction: 'neutral' });
  });
});

describe('<Money>', () => {
  it('ingreso en money-in con +', () => {
    const { container } = render(<Money amount={60000} sign="in" />);
    const root = container.firstElementChild;
    expect(root).toHaveTextContent('+$60.000');
    expect(root).toHaveClass('text-money-in');
    expect(root).toHaveAttribute('data-direction', 'in');
  });

  it('egreso en money-out (tinta, no rojo)', () => {
    const { container } = render(<Money amount={-17600} sign="auto" />);
    expect(container.firstElementChild).toHaveTextContent(`${MINUS_SIGN}$17.600`);
    expect(container.firstElementChild).toHaveClass('text-money-out');
  });

  it('deuda en danger y sin signo', () => {
    const { container } = render(<Money amount={96000} sign="in" tone="debt" />);
    expect(container.firstElementChild).toHaveTextContent('$96.000');
    expect(container.firstElementChild).not.toHaveTextContent('+');
    expect(container.firstElementChild).toHaveClass('text-danger');
  });

  it('nulo usa el placeholder de formatMoney', () => {
    render(<Money amount={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('$ en ink-subtle para montos neutros', () => {
    render(<Money amount={1234} />);
    expect(screen.getByText('$')).toHaveClass('text-ink-subtle');
  });
});
