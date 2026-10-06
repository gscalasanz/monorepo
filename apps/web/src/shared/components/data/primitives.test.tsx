import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { KeyValueList, MINUS_SIGN, SegmentedTabs, TotalsBar } from '@/shared/components/data';

const TABS = [
  { value: 'manada', label: 'Manada' },
  { value: 'unidad', label: 'Unidad', count: 12 },
  { value: 'rovers', label: 'Rovers', disabled: true },
] as const;

function TabsHarness() {
  const [value, setValue] = useState<string>('manada');
  return <SegmentedTabs ariaLabel="Ramas" items={TABS} value={value} onValueChange={setValue} />;
}

describe('<SegmentedTabs>', () => {
  it('tablist accesible con flechas y foco roving (salta deshabilitadas)', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);
    expect(screen.getByRole('tablist', { name: 'Ramas' })).toBeInTheDocument();
    const manada = screen.getByRole('tab', { name: 'Manada' });
    expect(manada).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Unidad/u })).toHaveAttribute('tabindex', '-1');

    manada.focus();
    await user.keyboard('{ArrowRight}');
    const unidad = screen.getByRole('tab', { name: /Unidad/u });
    expect(unidad).toHaveAttribute('aria-selected', 'true');
    expect(unidad).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Manada' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('<TotalsBar> / <KeyValueList>', () => {
  it('totales con aria-live y neto calculado', () => {
    const { container } = render(<TotalsBar count={214} ingresos={1040200} egresos={727800} />);
    const bar = container.firstElementChild;
    expect(bar).toHaveAttribute('aria-live', 'polite');
    expect(bar).toHaveTextContent('Movimientos214');
    expect(bar).toHaveTextContent(`Egresos${MINUS_SIGN}$727.800`);
    expect(bar).toHaveTextContent('Neto+$312.400');
  });

  it('valores vacíos se muestran como —', () => {
    render(<KeyValueList items={[{ label: 'DNI', value: '40.123.456' }, { label: 'Teléfono', value: null }]} />);
    expect(screen.getByText('DNI').nextElementSibling).toHaveTextContent('40.123.456');
    expect(screen.getByText('Teléfono').nextElementSibling).toHaveTextContent('—');
  });
});
