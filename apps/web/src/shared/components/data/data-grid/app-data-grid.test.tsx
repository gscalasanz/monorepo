import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppDataGrid, Money, type AppColumnDef } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';

interface Mov {
  readonly id: string;
  readonly concepto: string;
  readonly monto: number;
}

const COLUMNS: readonly AppColumnDef<Mov>[] = [
  { accessorKey: 'concepto', header: 'Concepto' },
  { accessorKey: 'monto', header: 'Monto', cell: ({ row }) => <Money amount={row.original.monto} sign="auto" /> },
];

const makeRows = (count: number): Mov[] =>
  Array.from({ length: count }, (_, index) => ({ id: `m${index + 1}`, concepto: `Concepto ${index + 1}`, monto: (index + 1) * 100 }));

describe('<AppDataGrid>', () => {
  it('renderiza encabezados y filas', () => {
    render(<AppDataGrid columns={COLUMNS} data={makeRows(2)} layout="table" getRowId={(row) => row.id} />);
    expect(screen.getByRole('columnheader', { name: 'Concepto' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Concepto 1' })).toBeInTheDocument();
    expect(screen.getByText('Concepto 2')).toBeInTheDocument();
  });

  it('muestra el empty state si no hay datos', () => {
    render(<AppDataGrid columns={COLUMNS} data={[]} layout="table" emptyState={<EmptyState title="Sin movimientos" />} />);
    expect(screen.getByText('Sin movimientos')).toBeInTheDocument();
  });

  it('loading: anuncia "Cargando…" y no muestra filas', () => {
    render(<AppDataGrid columns={COLUMNS} data={makeRows(3)} isLoading layout="table" />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
    expect(screen.queryByText('Concepto 1')).not.toBeInTheDocument();
  });

  it('paginación cliente: 10 por página (UI_CONFIG) y página siguiente', async () => {
    const user = userEvent.setup();
    render(<AppDataGrid columns={COLUMNS} data={makeRows(12)} layout="table" />);
    expect(screen.getByText('Concepto 10')).toBeInTheDocument();
    expect(screen.queryByText('Concepto 11')).not.toBeInTheDocument();
    expect(screen.getByText('Mostrando 1–10 de 12')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));
    expect(screen.getByText('Concepto 11')).toBeInTheDocument();
    expect(screen.queryByText('Concepto 1')).not.toBeInTheDocument();
  });

  it('paginación servidor: delega el cambio de página', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AppDataGrid
        columns={COLUMNS}
        data={makeRows(10)}
        layout="table"
        pagination={{ pageIndex: 0, pageSize: 10, total: 35, onChange }}
      />,
    );
    expect(screen.getByText('Mostrando 1–10 de 35')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));
    expect(onChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  });

  it('onRowClick recibe la fila', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<AppDataGrid columns={COLUMNS} data={makeRows(1)} layout="table" onRowClick={onRowClick} />);
    await user.click(screen.getByText('Concepto 1'));
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'm1' }));
  });

  describe('lista mobile', () => {
    it('layout="list" usa mobileRow y botones si hay onRowClick', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <AppDataGrid
          columns={COLUMNS}
          data={makeRows(2)}
          layout="list"
          ariaLabel="Movimientos"
          onRowClick={onRowClick}
          mobileRow={(row) => <span>{`móvil ${row.concepto}`}</span>}
        />,
      );
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      const list = screen.getByRole('list', { name: 'Movimientos' });
      expect(within(list).getAllByRole('listitem')).toHaveLength(2);
      await user.click(screen.getByRole('button', { name: 'móvil Concepto 2' }));
      expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'm2' }));
    });

    it('con onRowClick no anida interactivos: el botón de fila es un overlay hermano', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      const onInner = vi.fn();
      render(
        <AppDataGrid
          columns={COLUMNS}
          data={makeRows(1)}
          layout="list"
          ariaLabel="Movimientos"
          onRowClick={onRowClick}
          mobileRow={(row) => (
            <span>
              {row.concepto}
              <button type="button" onClick={onInner}>
                Acción
              </button>
            </span>
          )}
        />,
      );
      const inner = screen.getByRole('button', { name: 'Acción' });
      expect(inner.parentElement?.closest('button')).toBeNull();
      await user.click(inner);
      expect(onInner).toHaveBeenCalledTimes(1);
      expect(onRowClick).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: /Concepto 1/ }));
      expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'm1' }));
    });

    it('layout="auto" pasa a lista cuando matchMedia matchea (<860px)', () => {
      const spy = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      render(<AppDataGrid columns={COLUMNS} data={makeRows(1)} ariaLabel="Movimientos" />);
      expect(screen.getByRole('list', { name: 'Movimientos' })).toHaveTextContent('Concepto 1');
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      spy.mockRestore();
    });
  });
});
