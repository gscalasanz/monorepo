import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inscripcionSchema, type Inscripcion } from '@/shared/domain';
import { INSCRIPCION_RESPONSE_FIXTURE } from '@/shared/domain/testing/fixtures';
import {
  InscripcionCreateView,
  InscripcionDetailView,
  InscripcionEditView,
  InscripcionesDashboardView,
  InscripcionesListView,
} from '@/features/inscripciones';

const push = vi.fn();
const replace = vi.fn();
let search = '';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
  usePathname: () => '/inscripciones',
  useSearchParams: () => new URLSearchParams(search),
}));

const api = {
  fetchInscripciones: vi.fn(),
  fetchConsolidado: vi.fn(),
  fetchInscripcionOrNull: vi.fn(),
  createInscripcion: vi.fn(),
  updateInscripcion: vi.fn(),
  pagarInscripcion: vi.fn(),
};
vi.mock('@/features/inscripciones/services/inscripciones-api', () => ({
  fetchInscripciones: (...args: unknown[]) => api.fetchInscripciones(...args),
  fetchConsolidado: (...args: unknown[]) => api.fetchConsolidado(...args),
  fetchInscripcionOrNull: (...args: unknown[]) =>
    api.fetchInscripcionOrNull(...args),
  createInscripcion: (...args: unknown[]) => api.createInscripcion(...args),
  updateInscripcion: (...args: unknown[]) => api.updateInscripcion(...args),
  pagarInscripcion: (...args: unknown[]) => api.pagarInscripcion(...args),
  deleteInscripcion: vi.fn(),
  deletePago: vi.fn(),
  updatePago: vi.fn(),
  bonificarInscripcion: vi.fn(),
  quitarBonificacion: vi.fn(),
}));

vi.mock('@/shared/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/queries')>();
  return {
    ...actual,
    fetchPersonasActivas: () => Promise.resolve([]),
    fetchSaldoFondoSolidario: () => Promise.resolve(5000),
    fetchSaldoPersonal: () => Promise.resolve(0),
  };
});

const INSCRIPCION: Inscripcion = inscripcionSchema.parse(
  INSCRIPCION_RESPONSE_FIXTURE,
);
const PORRAMA = {
  total: 1,
  manada: 1,
  unidad: 0,
  caminantes: 0,
  rovers: 0,
  educadores: 0,
};
const CONSOLIDADO = {
  filtros: {},
  total: 1,
  porRama: PORRAMA,
  financiero: {
    montoEsperado: 30000,
    montoPagado: 10000,
    montoAdeudado: 20000,
    montoBonificado: 0,
  },
  deudores: {
    dinero: { total: 1, monto: 20000, porRama: PORRAMA },
    documentacion: { total: 1, porRama: PORRAMA },
    ambos: PORRAMA,
  },
  fecha: '2026-03-13T15:00:00.000Z',
};

beforeEach(() => {
  search = '';
  vi.clearAllMocks();
  api.fetchInscripciones.mockResolvedValue([INSCRIPCION]);
  api.fetchConsolidado.mockResolvedValue(CONSOLIDADO);
  api.fetchInscripcionOrNull.mockResolvedValue(INSCRIPCION);
});

describe('<InscripcionesListView>', () => {
  it('muestra stats, columnas de SA y la fila', async () => {
    render(<InscripcionesListView />);
    expect(await screen.findByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Inscriptos')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Papeles' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Abrir inscripción de Juan' }),
    ).toHaveAttribute('href', '/inscripciones/ins-1');
    expect(api.fetchInscripciones).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ tipo: 'scout_argentina' }),
      }),
    );
  });

  it('Grupo (desde ?tipo) oculta las autorizaciones y el tab cambia la URL', async () => {
    search = 'tipo=grupo';
    render(<InscripcionesListView />);
    await screen.findByText('Juan');
    expect(
      screen.queryByRole('columnheader', { name: 'Papeles' }),
    ).not.toBeInTheDocument();
    await userEvent
      .setup()
      .click(screen.getByRole('tab', { name: 'Scout Argentina' }));
    expect(replace).toHaveBeenCalledWith(
      '/inscripciones?tipo=scout_argentina',
      { scroll: false },
    );
  });
});

describe('<InscripcionesDashboardView>', () => {
  it('resume en una tira: inscriptos, esperado, pagado, adeudado y bonificado', async () => {
    render(<InscripcionesDashboardView />);
    const strip = await screen.findByLabelText('Resumen de inscripciones');
    for (const label of [
      'Inscriptos',
      'Monto Esperado',
      'Monto Pagado',
      'Monto Adeudado',
      'Bonificado',
    ]) {
      expect(within(strip).getByText(label)).toBeInTheDocument();
    }
  });

  it('el cobro es una sola barra apilada y los deudores llevan al reporte', async () => {
    render(<InscripcionesDashboardView />);
    expect(
      await screen.findByRole('img', { name: /^Cobro de las inscripciones/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver deudores' })).toHaveAttribute(
      'href',
      '/reportes/deudas',
    );
    expect(screen.getByText('Deuda de Dinero')).toBeInTheDocument();
  });
});

describe('<InscripcionDetailView>', () => {
  it('muestra saldo pendiente, historial y autorizaciones', async () => {
    render(<InscripcionDetailView id="ins-1" />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Juan' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Saldo pendiente')).toBeInTheDocument();
    expect(screen.getByText('33% completado')).toBeInTheDocument();
    expect(screen.getByText('Historial de pagos')).toBeInTheDocument();
    expect(screen.getByText('3 de 5')).toBeInTheDocument();
  });

  it('404 → "Inscripción no encontrada"', async () => {
    api.fetchInscripcionOrNull.mockResolvedValue(null);
    render(<InscripcionDetailView id="nope" />);
    expect(
      await screen.findByText('Inscripción no encontrada'),
    ).toBeInTheDocument();
  });

  it('registra un pago desde el diálogo', async () => {
    api.pagarInscripcion.mockResolvedValue({
      ...INSCRIPCION,
      montoPagado: 10100,
      saldoPendiente: 19900,
    });
    const user = userEvent.setup();
    render(<InscripcionDetailView id="ins-1" />);
    await user.click(
      await screen.findByRole('button', {
        name: 'Registrar nuevo pago para esta inscripción',
      }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText('Pago en Efectivo/Transferencia'),
      '100',
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Registrar Pago' }),
    );
    await waitFor(() =>
      expect(api.pagarInscripcion).toHaveBeenCalledWith(
        'ins-1',
        expect.objectContaining({ montoPagado: 100, medioPago: 'efectivo' }),
      ),
    );
  });
});

describe('<InscripcionEditView>', () => {
  it('en Grupo no manda las autorizaciones', async () => {
    api.fetchInscripcionOrNull.mockResolvedValue({
      ...INSCRIPCION,
      tipo: 'grupo',
    });
    api.updateInscripcion.mockResolvedValue(INSCRIPCION);
    const user = userEvent.setup();
    render(<InscripcionEditView id="ins-1" />);
    await user.click(
      await screen.findByRole('button', { name: 'Guardar cambios' }),
    );
    await waitFor(() =>
      expect(api.updateInscripcion).toHaveBeenCalledWith('ins-1', {}),
    );
    expect(push).toHaveBeenCalledWith('/inscripciones');
  });
});

describe('<InscripcionCreateView>', () => {
  it('monto total desde la config local y Grupo por ?tipo', async () => {
    window.localStorage.setItem(
      'scout_inscripcion_config',
      JSON.stringify({ montoScoutArgentina: 1000, montoGrupo: 700 }),
    );
    search = 'tipo=grupo';
    render(<InscripcionCreateView />);
    expect(await screen.findByLabelText('Monto Total')).toHaveValue('700');
    expect(screen.queryByText('Persona nueva')).not.toBeInTheDocument();
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Crear inscripción' }));
    expect(
      await screen.findByText('Selecciona una persona'),
    ).toBeInTheDocument();
    expect(api.createInscripcion).not.toHaveBeenCalled();
  });
});
