import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CheckboxField } from '@/shared/components/ui/form/checkbox-field';
import { ComboboxField } from '@/shared/components/ui/form/combobox-field';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { DaysOfWeekField } from '@/shared/components/ui/form/days-of-week-field';
import { RadioCardsField } from '@/shared/components/ui/form/radio-cards-field';
import { SelectField } from '@/shared/components/ui/form/select-field';
import { SwitchField } from '@/shared/components/ui/form/switch-field';
import type { DayOfWeek } from '@/shared/domain';

const RAMAS = [
  { value: 'Manada', label: 'Manada' },
  { value: 'Unidad', label: 'Unidad' },
  { value: 'Caminantes', label: 'Caminantes' },
] as const;

type Rama = (typeof RAMAS)[number]['value'];

function SelectHarness({ onValue }: { onValue: (v: Rama | null) => void }) {
  const [value, setValue] = useState<Rama | null>(null);
  return (
    <SelectField<Rama>
      label="Rama"
      options={RAMAS}
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
    />
  );
}

describe('SelectField', () => {
  it('muestra el placeholder y selecciona una opción', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<SelectHarness onValue={onValue} />);
    const trigger = screen.getByLabelText('Rama');
    expect(trigger).toHaveTextContent(FORM_COPY.selectPlaceholder);
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Unidad' }));
    expect(onValue).toHaveBeenLastCalledWith('Unidad');
    await waitFor(() => expect(trigger).toHaveTextContent('Unidad'));
  });

  it('marca aria-invalid y describe el error', () => {
    render(
      <SelectField
        label="Rama"
        options={RAMAS}
        value={null}
        onChange={vi.fn()}
        error="Elegí una rama"
      />,
    );
    const trigger = screen.getByLabelText('Rama');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Elegí una rama');
  });
});

describe('ComboboxField', () => {
  it('filtra al tipear y selecciona', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboboxField
        label="Persona"
        options={RAMAS}
        value={null}
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText('Persona');
    await user.type(input, 'cami');
    const option = await screen.findByRole('option', { name: 'Caminantes' });
    expect(
      screen.queryByRole('option', { name: 'Manada' }),
    ).not.toBeInTheDocument();
    await user.click(option);
    expect(onChange).toHaveBeenLastCalledWith('Caminantes');
  });
});

describe('CheckboxField / SwitchField', () => {
  it('checkbox: label clickeable y entrega boolean', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CheckboxField
        label="Comprobante entregado"
        value={false}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByText('Comprobante entregado'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(
      screen.getByRole('checkbox', { name: /Comprobante entregado/ }),
    ).toBeInTheDocument();
  });

  it('switch: role switch con nombre y entrega boolean', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SwitchField label="Evento público" value onChange={onChange} />);
    const control = screen.getByRole('switch', { name: /Evento público/ });
    await user.click(control);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });
});

describe('RadioCardsField', () => {
  it('grupo con nombre (legend) y selección por tarjeta', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioCardsField
        label="Medio de pago"
        value={null}
        onChange={onChange}
        options={[
          {
            value: 'efectivo',
            label: 'Efectivo',
            description: 'Entra a la caja',
          },
          { value: 'transferencia', label: 'Transferencia' },
        ]}
      />,
    );
    expect(
      screen.getByRole('radiogroup', { name: 'Medio de pago' }),
    ).toBeInTheDocument();
    await user.click(screen.getByText('Transferencia'));
    expect(onChange).toHaveBeenLastCalledWith('transferencia');
  });
});

function DaysHarness({
  initial,
  onValue,
}: {
  initial: DayOfWeek[];
  onValue: (v: readonly DayOfWeek[]) => void;
}) {
  const [value, setValue] = useState<readonly DayOfWeek[]>(initial);
  return (
    <DaysOfWeekField
      label="Días"
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
    />
  );
}

describe('DaysOfWeekField', () => {
  it('alterna días con aria-pressed y mantiene el orden lunes→domingo', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<DaysHarness initial={['friday']} onValue={onValue} />);
    expect(screen.getByRole('group', { name: 'Días' })).toBeInTheDocument();
    const lunes = screen.getByRole('button', { name: 'Lunes' });
    expect(lunes).toHaveAttribute('aria-pressed', 'false');
    await user.click(lunes);
    expect(onValue).toHaveBeenLastCalledWith(['monday', 'friday']);
    expect(lunes).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Viernes' }));
    expect(onValue).toHaveBeenLastCalledWith(['monday']);
  });

  it('Todos / Ninguno', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<DaysHarness initial={[]} onValue={onValue} />);
    await user.click(
      screen.getByRole('button', { name: FORM_COPY.selectAllDays }),
    );
    expect(onValue).toHaveBeenLastCalledWith([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]);
    await user.click(
      screen.getByRole('button', { name: FORM_COPY.clearAllDays }),
    );
    expect(onValue).toHaveBeenLastCalledWith([]);
  });

  it('deshabilitado: no se puede tocar', () => {
    render(
      <DaysOfWeekField label="Días" value={[]} onChange={vi.fn()} disabled />,
    );
    expect(screen.getByRole('button', { name: 'Martes' })).toBeDisabled();
  });
});
