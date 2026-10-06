import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  cajaResponseSchema,
  movimientoSchema,
  type CajaConSaldo,
} from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  MOVIMIENTO_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { CajasView } from '@/features/cajas';

let currentTab: string | null = null;
const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => '/cajas',
  useSearchParams: () =>
    new URLSearchParams(currentTab ? { tab: currentTab } : {}),
}));

vi.mock('@/shared/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/auth')>();
  return {
    ...actual,
    useSession: () => ({
      user: { id: 'u-1', nombre: 'Tesorera', email: 't@x', tipo: 'educador' },
      isAuthenticated: true,
      isLoading: false,
      initialized: true,
    }),
  };
});

const runDelete = vi.fn();
vi.mock('@/shared/confirm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/confirm')>();
  return {
    ...actual,
    confirmDialog: {
      ...actual.confirmDialog,
      runDelete: (...args: unknown[]) => runDelete(...args),
    },
  };
});

const api = {
  fetchCajaGrupoData: vi.fn(),
  fetchMovimientosCaja: vi.fn(),
  fetchFondoSolidarioData: vi.fn(),
  createTransferencia: vi.fn(),
  deleteMovimiento: vi.fn(),
};
vi.mock('@/features/cajas/services/cajas-api', () => ({
  fetchCajaGrupoData: () => api.fetchCajaGrupoData(),
  fetchMovimientosCaja: () => api.fetchMovimientosCaja(),
  fetchFondoSolidarioData: () => api.fetchFondoSolidarioData(),
  createTransferencia: (dto: unknown) => api.createTransferencia(dto),
  deleteMovimiento: (id: string) => api.deleteMovimiento(id),
  fetchFondosRama: vi.fn(),
  fetchMovimientosFiltrados: vi.fn(),
  fetchCuentasPersonales: vi.fn(),
  createFondoSolidario: vi.fn(),
  createMovimiento: vi.fn(),
}));

const fetchCajas = vi.fn();
vi.mock('@/shared/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/queries')>();
  return { ...actual, fetchCajas: () => fetchCajas() };
});

const grupo: CajaConSaldo = {
  ...cajaResponseSchema.parse(CAJA_RESPONSE_FIXTURE),
  id: 'g',
  tipo: 'grupo',
  nombre: null,
  propietarioId: null,
  propietario: null,
  saldoActual: 100,
};
const manada: CajaConSaldo = {
  ...grupo,
  id: 'm',
  tipo: 'rama_manada',
  saldoActual: 0,
};
const movimiento = movimientoSchema.parse({
  ...MOVIMIENTO_FIXTURE,
  cajaId: 'g',
});

beforeEach(() => {
  currentTab = null;
  vi.clearAllMocks();
  api.fetchCajaGrupoData.mockResolvedValue({
    caja: grupo,
    movimientos: [movimiento],
  });
  api.fetchMovimientosCaja.mockResolvedValue([movimiento]);
  fetchCajas.mockResolvedValue([grupo, manada]);
});

describe('<CajasView> caja de grupo', () => {
  it('muestra saldo, acciones y últimos movimientos; las tabs cambian el query param', async () => {
    const user = userEvent.setup();
    render(<CajasView />);
    expect(await screen.findByText('Saldo Caja de Grupo')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Registrar Movimiento/ }),
    ).toHaveAttribute('href', '/movimientos/nuevo?cajaId=g');
    expect(
      screen.getByRole('link', { name: /Ver Todos los Movimientos/ }),
    ).toHaveAttribute('href', '/movimientos?cajaId=g');
    expect(screen.getAllByText('Gasto General').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('tab', { name: /Fondos de Rama/ }));
    expect(replace).toHaveBeenCalledWith('/cajas?tab=rama', { scroll: false });
  });

  it('error al cargar la caja de grupo', async () => {
    api.fetchCajaGrupoData.mockRejectedValue(
      new Error('Caja del grupo no encontrada'),
    );
    render(<CajasView />);
    expect(
      await screen.findByText('Caja del grupo no encontrada'),
    ).toBeInTheDocument();
  });

  it('"Ver Detalles" abre el drawer con filtro y vacío por tipo', async () => {
    const user = userEvent.setup();
    render(<CajasView />);
    await user.click(
      await screen.findByRole('button', { name: /Ver Detalles/ }),
    );
    const drawer = await screen.findByRole('dialog');
    expect(within(drawer).getByText('Caja de Grupo')).toBeInTheDocument();
    await user.click(within(drawer).getByRole('button', { name: 'Ingresos' }));
    expect(
      within(drawer).getByText('No hay ingresos registrados en esta caja.'),
    ).toBeInTheDocument();
    await user.click(
      within(drawer).getByRole('button', { name: 'Cerrar drawer' }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('transferencia: valida saldo en cliente y no llama al backend', async () => {
    const user = userEvent.setup();
    render(<CajasView />);
    await user.click(
      await screen.findByRole('button', { name: /Transferir a Rama/ }),
    );
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Tesorera')).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole('button', { name: /^Transferir$/ }),
    );
    expect(
      await within(dialog).findByText('Debe seleccionar una caja destino'),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText('Ingresá un monto válido mayor a cero'),
    ).toBeInTheDocument();
    expect(api.createTransferencia).not.toHaveBeenCalled();
  });
});

describe('<CajasView> fondo solidario', () => {
  it('sin caja ofrece crearla; con caja lista transferencias y borra con advertencia', async () => {
    currentTab = 'fondo-solidario';
    const base = {
      consolidado: {
        cajaGrupo: { id: 'g', saldo: 100 },
        fondoSolidario: { id: 'fs', saldo: 50, bonificacionesOtorgadas: 0 },
      },
      fondo: { caja: null, historial: [] },
    };
    const transferencia = movimientoSchema.parse({
      ...MOVIMIENTO_FIXTURE,
      id: 't-1',
      tipo: 'ingreso',
      concepto: 'transferencia_entre_cajas',
      descripcion: 'Aporte',
    });
    api.fetchFondoSolidarioData.mockResolvedValue({
      ...base,
      movimientos: [transferencia],
    });
    runDelete.mockResolvedValue({ confirmed: true });
    const user = userEvent.setup();
    render(<CajasView />);
    expect(
      await screen.findByText('Transferencias Recibidas'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Aporte').length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]!);
    expect(runDelete).toHaveBeenCalledWith(
      'transferencia',
      expect.objectContaining({
        warning:
          'Se eliminará también el egreso correspondiente en la caja de origen. Esta acción no se puede deshacer.',
      }),
    );
  });

  it('sin fondo creado muestra "Crear Fondo Solidario"', async () => {
    currentTab = 'fondo-solidario';
    api.fetchFondoSolidarioData.mockResolvedValue({
      consolidado: {
        cajaGrupo: { id: 'g', saldo: 100 },
        fondoSolidario: { id: null, saldo: 0, bonificacionesOtorgadas: 0 },
      },
      fondo: { caja: null, historial: [] },
      movimientos: [],
    });
    render(<CajasView />);
    expect(
      await screen.findByRole('button', { name: /Crear Fondo Solidario/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Transferencias Recibidas'),
    ).not.toBeInTheDocument();
  });
});
