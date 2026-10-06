import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { eventoSchema, personaSchema, productoSchema } from '@/shared/domain';
import {
  AGRUPACION_FIXTURE,
  EVENTO_FIXTURE,
  PRODUCTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { ProductoDialog } from '@/features/eventos/components/producto-dialog';
import {
  EventoCreateView,
  EventoDetailView,
  EventosListView,
  VentasLoteView,
} from '@/features/eventos';

const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), search: '' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push, replace: nav.replace }),
  usePathname: () => '/eventos/evt-1',
  useSearchParams: () => new URLSearchParams(nav.search),
}));

const api = vi.hoisted(() => ({
  fetchEventos: vi.fn(),
  fetchEvento: vi.fn(),
  createEvento: vi.fn(),
  updateEvento: vi.fn(),
  deleteEvento: vi.fn(),
  cerrarEvento: vi.fn(),
  habilitarMovimientos: vi.fn(),
  updateReportePublico: vi.fn(),
  fetchEventoKpis: vi.fn(),
  fetchEventoMovimientos: vi.fn(),
  registrarIngreso: vi.fn(),
  registrarGasto: vi.fn(),
  deleteMovimiento: vi.fn(),
  pagarReembolso: vi.fn(),
}));
vi.mock('@/features/eventos/services/eventos-api', () => api);

const ventasApi = vi.hoisted(() => ({
  fetchProductos: vi.fn(),
  createProducto: vi.fn(),
  updateProducto: vi.fn(),
  deleteProducto: vi.fn(),
  fetchVentas: vi.fn(),
  registrarVentasLote: vi.fn(),
  deleteVenta: vi.fn(),
  cobrarVenta: vi.fn(),
  fetchVendedoresElegibles: vi.fn(),
  fetchEntregas: vi.fn(),
  fetchStockEntregas: vi.fn(),
  createEntrega: vi.fn(),
  deleteEntrega: vi.fn(),
}));
vi.mock('@/features/eventos/services/ventas-api', () => ventasApi);

const queries = vi.hoisted(() => ({ fetchPersonasActivas: vi.fn() }));
vi.mock('@/shared/queries', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  fetchPersonasActivas: queries.fetchPersonasActivas,
}));

const notifyMock = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));
vi.mock('@/shared/notifications', () => ({ notify: notifyMock }));

const evento = eventoSchema.parse(EVENTO_FIXTURE);
const grupo = {
  ...evento,
  id: 'evt-2',
  nombre: 'Kermesse',
  tipo: 'grupo' as const,
  tipoEvento: 'Salida',
};
const productoSinCosto = {
  ...productoSchema.parse(PRODUCTO_FIXTURE),
  cantidadVendida: 3,
};
const KPIS = {
  totalRecaudado: 1000,
  gananciaVentas: 400,
  totalRecuperado: 600,
  totalGastado: 200,
  totalPendienteReembolso: 50,
  balance: 800,
};

beforeEach(() => {
  vi.clearAllMocks();
  nav.search = '';
  api.fetchEventoKpis.mockResolvedValue(KPIS);
  api.fetchEventoMovimientos.mockResolvedValue([]);
  ventasApi.fetchProductos.mockResolvedValue([productoSinCosto]);
  ventasApi.fetchVentas.mockResolvedValue([]);
  ventasApi.fetchEntregas.mockResolvedValue([]);
  ventasApi.fetchStockEntregas.mockResolvedValue([]);
  queries.fetchPersonasActivas.mockResolvedValue([]);
});

describe('EventosListView', () => {
  it('muestra stats, cards y filtra por nombre', async () => {
    api.fetchEventos.mockResolvedValue([evento, grupo]);
    render(<EventosListView />);
    expect(
      await screen.findByRole('link', { name: 'Venta de pastelitos' }),
    ).toBeInTheDocument();
    const stats = screen.getByLabelText('Resumen de eventos');
    expect(within(stats).getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Salida')).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Editar evento' })[0],
    ).toHaveAttribute('href', '/eventos/evt-1/editar');
  });

  it('vacío: "No hay eventos registrados" + Crear Evento', async () => {
    api.fetchEventos.mockResolvedValue([]);
    render(<EventosListView />);
    expect(
      await screen.findByText('No hay eventos registrados'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /Crear Evento/ })[0],
    ).toHaveAttribute('href', '/eventos/crear');
  });
});

describe('EventoCreateView', () => {
  it('valida requeridos y crea el evento', async () => {
    const user = userEvent.setup();
    api.createEvento.mockResolvedValue({ ...grupo, id: 'nuevo' });
    render(<EventoCreateView />);
    await user.click(screen.getByRole('button', { name: 'Crear Evento' }));
    expect(
      await screen.findByText('El nombre es requerido (mínimo 3 caracteres)'),
    ).toBeInTheDocument();
    expect(api.createEvento).not.toHaveBeenCalled();
  });
});

describe('EventoDetailView', () => {
  it('evento de grupo: solo tab Movimientos con "Registrar Ingreso"', async () => {
    api.fetchEvento.mockResolvedValue(grupo);
    render(<EventoDetailView id="evt-2" />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Kermesse' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Movimientos',
    ]);
    expect(
      await screen.findByRole('button', { name: 'Registrar Ingreso' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Sin movimientos registrados'),
    ).toBeInTheDocument();
  });

  it('venta sin movimientos: banner y "Habilitar movimientos" exige costos', async () => {
    const user = userEvent.setup();
    api.fetchEvento.mockResolvedValue({
      ...evento,
      movimientosHabilitados: false,
    });
    render(<EventoDetailView id="evt-1" />);
    expect(
      await screen.findByText(/Movimientos pendientes/),
    ).toBeInTheDocument();
    expect(await screen.findByText('Sin costo')).toBeInTheDocument();
    expect(screen.getByText('Costo recuperado (grupo)')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Habilitar movimientos' }),
    );
    expect(notifyMock.error).toHaveBeenCalledWith(
      expect.stringContaining('Faltan cargar los costos de: Pastelitos.'),
    );
    expect(api.habilitarMovimientos).not.toHaveBeenCalled();
  });

  it('evento cerrado: sin acciones de edición', async () => {
    api.fetchEvento.mockResolvedValue({ ...evento, estaCerrado: true });
    render(<EventoDetailView id="evt-1" />);
    expect(await screen.findByText('Cerrado')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cerrar evento' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Gestionar Productos' }),
    ).not.toBeInTheDocument();
  });
});

describe('ProductoDialog', () => {
  it('valida y crea el producto', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    ventasApi.createProducto.mockResolvedValue(productoSinCosto);
    render(
      <ProductoDialog
        open
        onOpenChange={vi.fn()}
        eventoId="evt-1"
        producto={null}
        preciosBloqueados={false}
        onSaved={onSaved}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Agregar Producto' }));
    expect(
      await screen.findByText('El nombre es requerido'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('El precio de venta es requerido'),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Nombre del Producto/), 'Locro');
    await user.type(screen.getByLabelText(/Precio de Venta/), '1500');
    await user.click(screen.getByRole('button', { name: 'Agregar Producto' }));
    await waitFor(() =>
      expect(ventasApi.createProducto).toHaveBeenCalledWith({
        eventoId: 'evt-1',
        dto: { nombre: 'Locro', precioVenta: 1500 },
      }),
    );
    expect(onSaved).toHaveBeenCalled();
  });
});

describe('VentasLoteView', () => {
  it('registra el lote y vuelve al tab ventas', async () => {
    const user = userEvent.setup();
    api.fetchEvento.mockResolvedValue({
      ...evento,
      destinoGanancia: 'caja_grupo',
    });
    ventasApi.fetchVendedoresElegibles.mockResolvedValue([
      personaSchema.parse(PROTAGONISTA_FIXTURE),
      personaSchema.parse(AGRUPACION_FIXTURE),
    ]);
    ventasApi.registrarVentasLote.mockResolvedValue(undefined);
    render(<VentasLoteView id="evt-1" />);
    await user.type(
      await screen.findByLabelText('Cantidad de Pastelitos'),
      '2',
    );
    await user.click(screen.getByRole('button', { name: 'Registrar Ventas' }));
    expect(
      await screen.findByText('El vendedor es requerido'),
    ).toBeInTheDocument();
    expect(ventasApi.registrarVentasLote).not.toHaveBeenCalled();
  });
});

describe('tab Ventas', () => {
  it('agrupa el lote, muestra "A cobrar" y registra el cobro', async () => {
    const user = userEvent.setup();
    nav.search = 'tab=ventas';
    api.fetchEvento.mockResolvedValue(evento);
    ventasApi.cobrarVenta.mockResolvedValue({
      ventaId: 'v1',
      hermanasCobradas: 1,
      movimientosActualizados: [],
    });
    const base = {
      eventoId: 'evt-1',
      productoId: 'prod-1',
      vendedorId: 'per-1',
      destinoGanancia: 'caja_grupo',
      movimientoId: 'mov-1',
      movimientoRecuperoId: null,
      createdAt: '2026-05-25T15:00:00.000Z',
      updatedAt: '2026-05-25T15:00:00.000Z',
      deletedAt: null,
      producto: { ...productoSinCosto, precioCosto: 200 },
      vendedor: { id: 'per-1', nombre: 'Juan' },
    };
    ventasApi.fetchVentas.mockResolvedValue([
      { ...base, id: 'v1', cantidad: 2, estadoCobro: 'pendiente' },
      { ...base, id: 'v2', cantidad: 1, estadoCobro: 'cobrado' },
    ]);
    render(<EventoDetailView id="evt-1" />);
    expect(await screen.findByText('Ventas registradas')).toBeInTheDocument();
    expect(screen.getByText('A cobrar')).toBeInTheDocument();
    expect(screen.getByText('3 u')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Registrar cobro/ }));
    await waitFor(() =>
      expect(ventasApi.cobrarVenta).toHaveBeenCalledWith({
        eventoId: 'evt-1',
        ventaId: 'v1',
      }),
    );
  });
});
