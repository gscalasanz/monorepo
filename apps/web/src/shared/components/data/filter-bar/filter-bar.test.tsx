import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { FilterBar, type FilterField, type FilterValues } from '@/shared/components/data';
import { UI_CONFIG } from '@/shared/constants';

const FIELDS: readonly FilterField[] = [
  { type: 'search', key: 'q', label: 'Buscar movimientos' },
  { type: 'chips', key: 'tipo', label: 'Tipo', options: [{ value: 'ingreso', label: 'Ingresos' }, { value: 'egreso', label: 'Egresos' }] },
  { type: 'select', key: 'medio', label: 'Medio de pago', options: [{ value: 'efectivo', label: 'Efectivo' }, { value: 'transferencia', label: 'Transferencia' }] },
];

function Harness({ initial = {}, onChange }: { readonly initial?: FilterValues; readonly onChange: (v: FilterValues) => void }) {
  const [value, setValue] = useState<FilterValues>(initial);
  return (
    <FilterBar
      fields={FIELDS}
      value={value}
      onChange={(next) => {
        onChange(next);
        setValue(next);
      }}
    />
  );
}

describe('<FilterBar>', () => {
  it('chip inactivo "+ Label" → elegir opción → chip activo con valor y ×', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Medio de pago' }));
    await user.click(await screen.findByRole('button', { name: 'Efectivo' }));

    expect(onChange).toHaveBeenLastCalledWith({ medio: 'efectivo' });
    expect(screen.getByText('Efectivo', { selector: 'b' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Quitar filtro Medio de pago' }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it('segmentado: elegir Ingresos y volver a Todos quita la clave', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Ingresos' }));
    expect(onChange).toHaveBeenLastCalledWith({ tipo: 'ingreso' });
    expect(screen.getByRole('button', { name: 'Ingresos' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Todos' }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it('"Limpiar filtros" aparece solo con filtros activos y emite {}', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={{ medio: 'efectivo', q: 'carpa' }} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onChange).toHaveBeenLastCalledWith({});
    expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Buscar movimientos' })).toHaveValue('');
  });

  describe('búsqueda con debounce', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('emite una sola vez tras UI_CONFIG.DEBOUNCE_TIME_MS', () => {
      const onChange = vi.fn();
      render(<Harness onChange={onChange} />);
      const input = screen.getByRole('searchbox', { name: 'Buscar movimientos' });

      fireEvent.change(input, { target: { value: 'ca' } });
      fireEvent.change(input, { target: { value: 'carpa' } });
      act(() => vi.advanceTimersByTime(UI_CONFIG.DEBOUNCE_TIME_MS - 1));
      expect(onChange).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith({ q: 'carpa' });
    });
  });

  it('rango de fechas: setea desde/hasta y muestra el chip activo', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    function RangeHarness() {
      const [value, setValue] = useState<FilterValues>({});
      return (
        <FilterBar
          fields={[{ type: 'date-range', key: 'fecha', label: 'Fecha' }]}
          value={value}
          onChange={(next) => { onChange(next); setValue(next); }}
        />
      );
    }
    render(<RangeHarness />);
    await user.click(screen.getByRole('button', { name: 'Fecha' }));
    fireEvent.change(await screen.findByLabelText('Desde'), { target: { value: '2026-09-01' } });
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ fecha: { from: '2026-09-01' } }));
    expect(screen.getByRole('button', { name: 'Quitar filtro Fecha' })).toBeInTheDocument();
  });

  it('el trigger es el mismo nodo activo/inactivo: el popover sigue abierto al elegir fecha', async () => {
    const user = userEvent.setup();
    function RangeHarness() {
      const [value, setValue] = useState<FilterValues>({});
      return (
        <FilterBar
          fields={[{ type: 'date-range', key: 'fecha', label: 'Fecha' }]}
          value={value}
          onChange={setValue}
        />
      );
    }
    render(<RangeHarness />);
    const trigger = screen.getByRole('button', { name: 'Fecha' });
    await user.click(trigger);
    fireEvent.change(await screen.findByLabelText('Desde'), { target: { value: '2026-09-01' } });
    await screen.findByRole('button', { name: 'Quitar filtro Fecha' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Desde')).toBeInTheDocument();
  });
});
