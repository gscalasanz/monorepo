import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KpiStrip } from '@/shared/components/charts';
import { InfoHint } from '@/shared/components/ui/info-hint';

describe('InfoHint', () => {
  it('es un botón con nombre y al activarlo muestra la explicación', async () => {
    const user = userEvent.setup();
    render(<InfoHint label="Gastado" text="Gastos ya pagados." />);
    await user.click(
      screen.getByRole('button', { name: 'Qué significa Gastado' }),
    );
    expect(await screen.findByText('Gastos ya pagados.')).toBeInTheDocument();
  });
});

describe('KpiStrip con hint', () => {
  it('la métrica con hint trae su ⓘ y la que no, no', () => {
    render(
      <KpiStrip
        items={[
          { id: 'a', label: 'Recaudado', value: '1', hint: 'Plata cobrada.' },
          { id: 'b', label: 'Otra', value: '2' },
        ]}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Qué significa Recaudado' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Qué significa Otra' }),
    ).not.toBeInTheDocument();
  });
});
