import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  cajaResponseSchema,
  movimientoSchema,
  personaSchema,
  type Movimiento,
} from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  EDUCADOR_FIXTURE,
  MOVIMIENTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import {
  MovimientoCreateView,
  MovimientoEditView,
  MovimientosListView,
} from '@/features/movimientos';

const push = vi.fn();
const replace = vi.fn();
let searchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
  useSearchParams: () => searchParams,
  usePathname: () => '/movimientos',
}));

const api = {
  fetchMovimientosPage: vi.fn(),
  deleteMovimiento: vi.fn(),
  createMovimiento: vi.fn(),
  updateMovimiento: vi.fn(),
  fetchCreateFormData: vi.fn(),
  fetchEditFormData: vi.fn(),
};
vi.mock('@/features/movimientos/services/movimientos-api', () => ({
  fetchMovimientosPage: (...args: unknown[]) =>
    api.fetchMovimientosPage(...args),
  deleteMovimiento: (...args: unknown[]) => api.deleteMovimiento(...args),
  createMovimiento: (...args: unknown[]) => api.createMovimiento(...args),
  updateMovimiento: (...args: unknown[]) => api.updateMovimiento(...args),
  fetchCreateFormData: (...args: unknown[]) => api.fetchCreateFormData(...args),
  fetchEditFormData: (...args: unknown[]) => api.fetchEditFormData(...args),
}));

const runDelete = vi.fn();
vi.mock('@/shared/confirm', () => ({
  confirmDialog: { runDelete: (...args: unknown[]) => runDelete(...args) },
}));

const notifySuccess = vi.fn();
vi.mock('@/shared/notifications', () => ({
  notify: { success: (m: string) => notifySuccess(m), error: vi.fn() },
}));

const RESPONSABLE = personaSchema.parse(EDUCADOR_FIXTURE);
const MOV: Movimiento = {
  ...movimientoSchema.parse(MOVIMIENTO_FIXTURE),
  responsable: RESPONSABLE,
};
const META = {
  page: 1,
  limit: 25,
  total: 1,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  searchParams = new URLSearchParams();
});

describe('MovimientosListView', () => {
  it('pide la página 1 con 25 y muestra columnas y filas', async () => {
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    render(<MovimientosListView />);
    expect(await screen.findByText('Garrafa')).toBeInTheDocument();
    expect(api.fetchMovimientosPage).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ page: 1, limit: 25 }),
      }),
    );
    expect(screen.getByText('1 registros')).toBeInTheDocument();
    for (const header of [
      'Fecha',
      'Concepto',
      'Caja',
      'Medio de Pago',
      'Estado',
      'Responsable',
      'Monto',
    ]) {
      expect(
        screen.getByRole('columnheader', { name: header }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText('Gasto General')).toBeInTheDocument();
    expect(screen.getByText('Laura')).toBeInTheDocument();
  });

  it('Tipo y Descripción ya no son columnas: el tile dice la dirección y la descripción es la sub-línea', async () => {
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    render(<MovimientosListView />);
    await screen.findByText('Garrafa');
    for (const header of ['Tipo', 'Descripción', 'Comprobante']) {
      expect(
        screen.queryByRole('columnheader', { name: header }),
      ).not.toBeInTheDocument();
    }
    const row = screen.getByText('Garrafa').closest('tr') as HTMLElement;
    expect(within(row).getByRole('img', { name: /Egreso|Ingreso/ })).toBeInTheDocument();
  });

  it('Editar y Eliminar viven en el menú ⋯ de la fila', async () => {
    const user = userEvent.setup();
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    render(<MovimientosListView />);
    const row = (await screen.findByText('Garrafa')).closest('tr') as HTMLElement;
    expect(within(row).queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    await user.click(within(row).getByRole('button', { name: /^Acciones para/ }));
    expect(await screen.findByRole('menuitem', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toBeInTheDocument();
  });

  it('respeta los query params iniciales', async () => {
    searchParams = new URLSearchParams('cajaId=c1&tipo=egreso');
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    render(<MovimientosListView />);
    await screen.findByText('Garrafa');
    expect(api.fetchMovimientosPage).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ cajaId: 'c1', tipo: 'egreso' }),
      }),
    );
    expect(screen.getByRole('button', { name: 'Egresos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('vacío: mensaje según tab', async () => {
    api.fetchMovimientosPage.mockResolvedValue({
      data: [],
      meta: { ...META, total: 0 },
    });
    render(<MovimientosListView />);
    expect(
      await screen.findByText('No se encontraron movimientos'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No hay movimientos registrados con los filtros seleccionados.',
      ),
    ).toBeInTheDocument();
  });

  it('cambiar de tab vuelve a pedir con el tipo', async () => {
    const user = userEvent.setup();
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    render(<MovimientosListView />);
    await screen.findByText('Garrafa');
    await user.click(screen.getByRole('button', { name: 'Ingresos' }));
    await waitFor(() =>
      expect(api.fetchMovimientosPage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ tipo: 'ingreso', page: 1 }),
        }),
      ),
    );
  });

  it('eliminar: diálogo con la acción, toast y recarga', async () => {
    const user = userEvent.setup();
    api.fetchMovimientosPage.mockResolvedValue({ data: [MOV], meta: META });
    api.deleteMovimiento.mockResolvedValue(undefined);
    runDelete.mockImplementation(
      async (_entity: string, config: { action: () => Promise<unknown> }) => {
        await config.action();
        return { confirmed: true };
      },
    );
    render(<MovimientosListView />);
    const row = (await screen.findByText('Garrafa')).closest('tr');
    expect(row).not.toBeNull();
    await user.click(
      within(row as HTMLElement).getByRole('button', { name: /^Acciones para/ }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Eliminar' }));
    await waitFor(() =>
      expect(notifySuccess).toHaveBeenCalledWith(
        'Movimiento eliminado exitosamente',
      ),
    );
    expect(runDelete).toHaveBeenCalledWith('movimiento', expect.anything());
    expect(api.deleteMovimiento).toHaveBeenCalledWith('mov-1');
    await waitFor(() =>
      expect(api.fetchMovimientosPage).toHaveBeenCalledTimes(2),
    );
  });

  it('error: mensaje y Reintentar', async () => {
    api.fetchMovimientosPage.mockRejectedValue(
      new Error('Error al cargar movimientos'),
    );
    render(<MovimientosListView />);
    expect(
      await screen.findByRole('button', { name: 'Reintentar' }),
    ).toBeInTheDocument();
  });
});

describe('MovimientoCreateView', () => {
  const caja = cajaResponseSchema.parse({
    ...CAJA_RESPONSE_FIXTURE,
    id: 'caja-1',
    tipo: 'grupo',
    nombre: 'Caja de Grupo',
  });

  it('precarga ?cajaId y valida requeridos al enviar', async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams('cajaId=caja-1');
    api.fetchCreateFormData.mockResolvedValue({
      cajas: [caja],
      personas: [RESPONSABLE],
    });
    render(<MovimientoCreateView />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Nuevo Movimiento',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue('Caja de Grupo'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Crear Movimiento' }));
    expect(
      await screen.findByText('El monto es requerido'),
    ).toBeInTheDocument();
    expect(screen.getByText('El concepto es requerido')).toBeInTheDocument();
    expect(screen.getByText('El responsable es requerido')).toBeInTheDocument();
    expect(screen.queryByText('La caja es requerida')).not.toBeInTheDocument();
    expect(api.createMovimiento).not.toHaveBeenCalled();
  });

  it('pendiente de reembolso muestra "Persona a Reembolsar"', async () => {
    const user = userEvent.setup();
    api.fetchCreateFormData.mockResolvedValue({
      cajas: [caja],
      personas: [RESPONSABLE],
    });
    render(<MovimientoCreateView />);
    await screen.findByRole('heading', { level: 1, name: 'Nuevo Movimiento' });
    expect(screen.queryByText('Persona a Reembolsar')).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('radio', { name: /Pendiente de Reembolso/ }),
    );
    expect(screen.getByText('Persona a Reembolsar')).toBeInTheDocument();
  });
});

describe('MovimientoEditView', () => {
  it('muestra el resumen y guarda los campos editables', async () => {
    const user = userEvent.setup();
    const juan = personaSchema.parse(PROTAGONISTA_FIXTURE);
    api.fetchEditFormData.mockResolvedValue({
      movimiento: { ...MOV, responsableId: 'per-1' },
      personas: [juan],
    });
    api.updateMovimiento.mockResolvedValue(undefined);
    render(<MovimientoEditView id="mov-1" />);
    expect(await screen.findByText('Datos del Movimiento')).toBeInTheDocument();
    expect(
      screen.getByText(/Solo puedes editar la descripción/),
    ).toBeInTheDocument();
    const descripcion = screen.getByRole('textbox', { name: /Descripción/ });
    await user.type(descripcion, ' editado');
    await user.click(
      screen.getByRole('radio', { name: /Pendiente de Reembolso/ }),
    );
    await user.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() =>
      expect(api.updateMovimiento).toHaveBeenCalledWith('mov-1', {
        descripcion: 'Garrafa editado',
        comprobanteEntregado: false,
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'per-1',
      }),
    );
    expect(notifySuccess).toHaveBeenCalledWith(
      'Movimiento actualizado exitosamente',
    );
    expect(push).toHaveBeenCalledWith('/movimientos');
  });

  it('si la carga falla vuelve a la lista', async () => {
    api.fetchEditFormData.mockRejectedValue(new Error('404'));
    render(<MovimientoEditView id="mov-x" />);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/movimientos'));
  });
});
