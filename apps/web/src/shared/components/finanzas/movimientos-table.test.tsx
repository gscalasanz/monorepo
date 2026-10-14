import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MovimientosTable } from './movimientos-table';
import type { MovimientoCardData } from './types';

const BASE: MovimientoCardData = {
  id: 'm1',
  tipo: 'egreso',
  concepto: 'gasto_general',
  descripcion: 'Compra insumos',
  responsableNombre: 'Juan',
  monto: 1000,
  medioPago: 'efectivo',
  estadoPago: 'pagado',
  fecha: '2026-06-01',
};

describe('MovimientosTable', () => {
  it('una fila con fecha, concepto, responsable, medio, estado y monto con signo', () => {
    render(<MovimientosTable movimientos={[BASE]} ariaLabel="Movimientos" />);
    const row = screen.getByRole('row', { name: /Compra insumos/ });
    expect(within(row).getByText('Compra insumos')).toBeInTheDocument();
    expect(within(row).getByText('Juan')).toBeInTheDocument();
    expect(within(row).getByText('Efectivo')).toBeInTheDocument();
    expect(within(row).getByText('Pagado')).toBeInTheDocument();
    expect(row).toHaveTextContent('$1.000');
  });

  it('sin deletable no hay menú de acciones', () => {
    render(<MovimientosTable movimientos={[BASE]} ariaLabel="Movimientos" />);
    expect(
      screen.queryByRole('button', { name: /Acciones para/ }),
    ).not.toBeInTheDocument();
  });

  it('con deletable el ⋯ ofrece Eliminar', async () => {
    const onDelete = vi.fn();
    render(
      <MovimientosTable
        movimientos={[BASE]}
        ariaLabel="Movimientos"
        deletable
        onDelete={onDelete}
      />,
    );
    await userEvent
      .setup()
      .click(
        screen.getByRole('button', { name: 'Acciones para Gasto General' }),
      );
    await userEvent
      .setup()
      .click(await screen.findByRole('menuitem', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalledWith(BASE);
  });

  it('el pendiente de reembolso es un botón que dispara el pago', async () => {
    const onPagar = vi.fn();
    const pendiente = { ...BASE, estadoPago: 'pendiente_reembolso' as const };
    render(
      <MovimientosTable
        movimientos={[pendiente]}
        ariaLabel="Movimientos"
        onPagarReembolso={onPagar}
      />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: /Pendiente de Reembolso/ }));
    expect(onPagar).toHaveBeenCalledWith(pendiente);
  });
});
