import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MINUS_SIGN } from '@/shared/components/data';
import { ConfirmDialogHost, confirmStore } from '@/shared/confirm';
import { formatMoney } from '@/shared/format';

import { confirmPagarReembolso } from './confirm-pagar-reembolso';
import { MovimientoCard } from './movimiento-card';
import { MovimientoFilterTabs } from './movimiento-filter-tabs';
import type { MovimientoCardData } from './types';

const BASE: MovimientoCardData = {
  id: 'm1',
  tipo: 'egreso',
  descripcion: 'Compra insumos',
  responsableNombre: 'Juan',
  monto: 1000,
  medioPago: 'efectivo',
  estadoPago: 'pagado',
  fecha: '2026-06-01',
};

describe('MovimientoCard', () => {
  it('egreso pagado: fecha, descripción, responsable, monto con signo, medio y badge no interactivo', () => {
    render(<MovimientoCard movimiento={BASE} onPagarReembolso={vi.fn()} />);
    expect(screen.getByText('1 jun 2026')).toBeInTheDocument();
    expect(screen.getByText('Compra insumos')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Egreso' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveTextContent(`${MINUS_SIGN}$1.000`);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('ingreso sin descripción, medio y estado "A cobrar"', () => {
    render(
      <MovimientoCard
        movimiento={{
          ...BASE,
          tipo: 'ingreso',
          descripcion: null,
          medioPago: 'saldo_personal',
          estadoPago: 'pendiente_cobro',
        }}
      />,
    );
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
    expect(screen.getByText('Saldo Personal')).toBeInTheDocument();
    expect(screen.getByText('A cobrar')).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveTextContent('+$1.000');
  });

  it('"Pendiente de Reembolso" es botón solo si hay onPagarReembolso', async () => {
    const onPagar = vi.fn();
    const pendiente = { ...BASE, estadoPago: 'pendiente_reembolso' as const };
    const { rerender } = render(<MovimientoCard movimiento={pendiente} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <MovimientoCard movimiento={pendiente} onPagarReembolso={onPagar} />,
    );
    const badge = screen.getByRole('button', {
      name: /Pendiente de Reembolso/,
    });
    expect(badge).toHaveAttribute('title', 'Marcar como pagado');
    await userEvent.click(badge);
    expect(onPagar).toHaveBeenCalledWith(pendiente);
  });

  it('borrar: visible solo si deletable, deshabilitado mientras deleting', async () => {
    const onDelete = vi.fn();
    const { rerender } = render(
      <MovimientoCard movimiento={BASE} onDelete={onDelete} />,
    );
    expect(
      screen.queryByRole('button', { name: 'Eliminar movimiento' }),
    ).not.toBeInTheDocument();
    rerender(
      <MovimientoCard movimiento={BASE} deletable onDelete={onDelete} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar movimiento' }),
    );
    expect(onDelete).toHaveBeenCalledWith(BASE);
    rerender(
      <MovimientoCard
        movimiento={BASE}
        deletable
        deleting
        onDelete={onDelete}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Eliminar movimiento' }),
    ).toBeDisabled();
  });
});

describe('MovimientoFilterTabs', () => {
  it('Todos/Ingresos/Egresos/Gastos como toggles', async () => {
    const onChange = vi.fn();
    render(<MovimientoFilterTabs value="todos" onValueChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Gastos' }));
    expect(onChange).toHaveBeenCalledWith('gastos');
  });
});

describe('confirmPagarReembolso', () => {
  afterEach(() => confirmStore.setState({ active: null }));

  it('muestra título, mensaje y detalles con fallbacks; "Pagar" corre la acción', async () => {
    render(<ConfirmDialogHost />);
    const action = vi.fn().mockResolvedValue(undefined);
    act(() => {
      void confirmPagarReembolso({
        monto: 1234,
        descripcion: null,
        responsableNombre: '',
        action,
      });
    });
    expect(
      await screen.findByText('Confirmar pago de reembolso'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('¿Confirmás que este gasto fue reembolsado?'),
    ).toBeInTheDocument();
    expect(screen.getByText('$ 1.234')).toBeInTheDocument();
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
    expect(screen.getByText('Desconocido')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('pasa las opciones exactas a confirmDialog.run', () => {
    const action = vi.fn().mockResolvedValue(undefined);
    act(() => {
      void confirmPagarReembolso({
        monto: 500,
        descripcion: 'Leña',
        responsableNombre: 'Ana',
        action,
      });
    });
    expect(confirmStore.getState().active).toMatchObject({
      title: 'Confirmar pago de reembolso',
      confirmText: 'Pagar',
      details: [
        { label: 'Monto', value: formatMoney(500) },
        { label: 'Descripción', value: 'Leña' },
        { label: 'Responsable', value: 'Ana' },
      ],
      action,
    });
  });
});
