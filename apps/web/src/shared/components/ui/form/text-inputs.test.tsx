import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { MoneyField } from '@/shared/components/ui/form/money-field';
import { NumberField } from '@/shared/components/ui/form/number-field';
import { PasswordField } from '@/shared/components/ui/form/password-field';
import { PhoneField } from '@/shared/components/ui/form/phone-field';
import { TextareaField } from '@/shared/components/ui/form/textarea-field';

describe('PasswordField', () => {
  it('alterna mostrar/ocultar con nombre accesible y aria-pressed', async () => {
    const user = userEvent.setup();
    render(
      <PasswordField label="Contraseña" value="secreto" onChange={vi.fn()} />,
    );
    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');

    const toggle = screen.getByRole('button', { name: FORM_COPY.showPassword });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    const hide = screen.getByRole('button', { name: FORM_COPY.hidePassword });
    expect(hide).toHaveAttribute('aria-pressed', 'true');
    await user.click(hide);
    expect(input).toHaveAttribute('type', 'password');
  });
});

function PhoneHarness({
  onValue,
  format,
}: {
  onValue: (v: string) => void;
  format?: 'E164' | 'digits';
}) {
  const [value, setValue] = useState('');
  return (
    <PhoneField
      label="Teléfono"
      value={value}
      valueFormat={format}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
    />
  );
}

describe('PhoneField', () => {
  it('enmascara mientras se tipea y entrega E.164', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<PhoneHarness onValue={onValue} />);
    const input = screen.getByLabelText('Teléfono');
    await user.type(input, '1112345678');
    expect(input).toHaveValue('(11) 1234-5678');
    expect(onValue).toHaveBeenLastCalledWith('+541112345678');
  });

  it('formato digits, descarta letras y el excedente', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<PhoneHarness onValue={onValue} format="digits" />);
    const input = screen.getByLabelText('Teléfono');
    await user.type(input, '11abc123456789');
    expect(input).toHaveValue('(11) 1234-5678');
    expect(onValue).toHaveBeenLastCalledWith('1112345678');
  });

  it('muestra enmascarado un valor E.164 inicial', () => {
    render(
      <PhoneField label="Teléfono" value="+543514445566" onChange={vi.fn()} />,
    );
    expect(screen.getByLabelText('Teléfono')).toHaveValue('(35) 1444-5566');
  });
});

function MoneyHarness({
  initial,
  onValue,
}: {
  initial: number | null;
  onValue: (v: number | null) => void;
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <MoneyField
      label="Monto"
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
    />
  );
}

describe('MoneyField', () => {
  it('parsea decimales es-AR, entrega number y reformatea al salir', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<MoneyHarness initial={null} onValue={onValue} />);
    const input = screen.getByLabelText('Monto');
    await user.type(input, '1234,5');
    expect(onValue).toHaveBeenLastCalledWith(1234.5);
    expect(input).toHaveValue('1234,5');
    await user.tab();
    expect(input).toHaveValue('1.234,5');
  });

  it('acepta enteros y punto decimal; ignora letras; nunca NaN', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<MoneyHarness initial={null} onValue={onValue} />);
    const input = screen.getByLabelText('Monto');
    await user.type(input, 'a1b2.5');
    expect(input).toHaveValue('12.5');
    expect(onValue).toHaveBeenLastCalledWith(12.5);
    for (const [value] of onValue.mock.calls) {
      expect(Number.isNaN(value)).toBe(false);
    }
  });

  it('vaciar entrega null; valor inicial se muestra formateado', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<MoneyHarness initial={2000} onValue={onValue} />);
    const input = screen.getByLabelText('Monto');
    expect(input).toHaveValue('2.000');
    await user.clear(input);
    expect(onValue).toHaveBeenLastCalledWith(null);
  });

  it('se resincroniza si el valor cambia desde afuera', () => {
    const { rerender } = render(
      <MoneyField label="Monto" value={100} onChange={vi.fn()} />,
    );
    rerender(<MoneyField label="Monto" value={1500.25} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Monto')).toHaveValue('1.500,25');
  });
});

function NumberHarness({ onValue }: { onValue: (v: number | null) => void }) {
  const [value, setValue] = useState<number | null>(null);
  return (
    <NumberField
      label="Cupo"
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(next);
      }}
    />
  );
}

describe('NumberField', () => {
  it('entrega number o null, nunca NaN', () => {
    const onValue = vi.fn();
    render(<NumberHarness onValue={onValue} />);
    const input = screen.getByLabelText('Cupo');
    fireEvent.change(input, { target: { value: '12' } });
    expect(onValue).toHaveBeenLastCalledWith(12);
    fireEvent.change(input, { target: { value: '2.5' } });
    expect(onValue).toHaveBeenLastCalledWith(2.5);
    fireEvent.change(input, { target: { value: '' } });
    expect(onValue).toHaveBeenLastCalledWith(null);
  });
});

describe('TextareaField', () => {
  it('muestra el contador cuando hay maxLength', () => {
    render(
      <TextareaField
        label="Motivo"
        value="hola"
        onChange={vi.fn()}
        maxLength={10}
      />,
    );
    expect(screen.getByLabelText('Motivo')).toHaveAttribute('maxlength', '10');
    expect(screen.getByText('4/10')).toBeInTheDocument();
  });
});
