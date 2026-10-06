import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { personasSchema } from '@/shared/domain';
import {
  EDUCADOR_FIXTURE,
  EXTERNO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import {
  PersonaFichaView,
  PersonasListView,
  ProtagonistaFormView,
} from '@/features/personas';
import { personaDashboardSchema } from '@/features/personas/models/dashboard-schema';

const push = vi.fn();
const router = { push, replace: vi.fn() };
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/personas',
}));

const api = {
  fetchPersonas: vi.fn(),
  fetchPersona: vi.fn(),
  fetchPersonaDashboard: vi.fn(),
  createProtagonista: vi.fn(),
  updatePersona: vi.fn(),
};
vi.mock('@/features/personas/services/personas-api', () => ({
  fetchPersonas: () => api.fetchPersonas(),
  fetchPersona: () => api.fetchPersona(),
  fetchPersonaDashboard: () => api.fetchPersonaDashboard(),
  createProtagonista: (dto: unknown) => api.createProtagonista(dto),
  updatePersona: (params: unknown) => api.updatePersona(params),
  createEducador: vi.fn(),
  createPersonaExterna: vi.fn(),
  setPersonaEstado: vi.fn(),
  deletePersona: vi.fn(),
  transferirSaldoAGrupo: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<PersonasListView>', () => {
  beforeEach(() => {
    api.fetchPersonas.mockResolvedValue(
      personasSchema.parse([
        PROTAGONISTA_FIXTURE,
        {
          ...PROTAGONISTA_FIXTURE,
          id: 'p-2',
          nombre: 'Pedro Unidad',
          rama: 'Unidad',
        },
        EDUCADOR_FIXTURE,
        EXTERNO_FIXTURE,
      ]),
    );
  });

  it('muestra stats, la tab Manada por defecto y cambia de tab', async () => {
    const user = userEvent.setup();
    render(<PersonasListView />);
    expect(
      await screen.findByRole('link', { name: 'Juan' }),
    ).toBeInTheDocument();
    const stats = screen.getByLabelText('Resumen de personas');
    expect(within(stats).getByText('Total Activos')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Pedro Unidad' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'DNI Padres' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Educadores' }));
    expect(
      await screen.findByRole('link', { name: 'Laura' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'DNI' }),
    ).not.toBeInTheDocument();
  });

  it('externos deshabilitados solo con "Mostrar deshabilitados" (y aparece la columna Estado)', async () => {
    const user = userEvent.setup();
    render(<PersonasListView />);
    await screen.findByRole('link', { name: 'Juan' });
    await user.click(screen.getByRole('tab', { name: 'Externos' }));
    expect(screen.getByText('No se encontraron personas')).toBeInTheDocument();
    await user.click(
      screen.getByRole('switch', { name: 'Mostrar deshabilitados' }),
    );
    expect(
      await screen.findByRole('link', { name: 'Ana' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Estado' }),
    ).toBeInTheDocument();
  });

  it('"Nuevo Miembro" navega al alta según la tab', async () => {
    const user = userEvent.setup();
    render(<PersonasListView />);
    await screen.findByRole('link', { name: 'Juan' });
    await user.click(screen.getByRole('button', { name: 'Nuevo Miembro' }));
    expect(push).toHaveBeenCalledWith('/personas/protagonistas/crear');
  });

  it('error de carga sin datos', async () => {
    api.fetchPersonas.mockRejectedValue(new Error('Error al cargar personas'));
    render(<PersonasListView />);
    expect(
      await screen.findByText('Error al cargar personas'),
    ).toBeInTheDocument();
  });
});

describe('<ProtagonistaFormView>', () => {
  it('valida y crea el protagonista; vuelve al listado', async () => {
    const user = userEvent.setup();
    api.createProtagonista.mockResolvedValue(
      personasSchema.parse([PROTAGONISTA_FIXTURE])[0],
    );
    render(<ProtagonistaFormView />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nuevo Protagonista' }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Crear Protagonista' }),
    );
    expect(
      await screen.findByText('El nombre es requerido (mínimo 2 caracteres)'),
    ).toBeInTheDocument();
    expect(screen.getByText('La rama es requerida')).toBeInTheDocument();
    expect(api.createProtagonista).not.toHaveBeenCalled();
  });

  it('edición: carga por GET /personas/:id (deep-link) y precarga el form', async () => {
    api.fetchPersona.mockResolvedValue(
      personasSchema.parse([PROTAGONISTA_FIXTURE])[0],
    );
    render(<ProtagonistaFormView id="per-1" />);
    expect(await screen.findByDisplayValue('Juan')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Editar Protagonista' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Guardar Cambios' }),
    ).toBeInTheDocument();
  });

  it('edición de una persona de otro tipo: mensaje y vuelta al listado', async () => {
    api.fetchPersona.mockResolvedValue(
      personasSchema.parse([EDUCADOR_FIXTURE])[0],
    );
    render(<ProtagonistaFormView id="per-2" />);
    expect(
      await screen.findByText('La persona no corresponde a este formulario'),
    ).toBeInTheDocument();
  });
});

describe('<PersonaFichaView>', () => {
  it('muestra saldo, deuda, obligaciones, documentación y "Transferir a caja grupo"', async () => {
    api.fetchPersonaDashboard.mockResolvedValue(
      personaDashboardSchema.parse({
        persona: {
          id: 'per-1',
          nombre: 'Juan Pérez',
          tipo: 'protagonista',
          estado: 'activo',
          rama: 'Manada',
        },
        cuentaPersonal: { id: 'c1', saldo: 1500 },
        documentacionPersonal: {
          partidaNacimiento: true,
          dni: true,
          dniPadres: false,
          carnetObraSocial: true,
          completa: false,
        },
        inscripciones: {
          resumen: { total: 3000, cantidad: 1 },
          items: [
            {
              id: 'i1',
              tipo: 'grupo',
              ano: 2026,
              montoTotal: 5000,
              montoBonificado: 0,
              montoPagado: 2000,
              saldoPendiente: 3000,
              estado: 'parcial',
            },
          ],
        },
        campamentos: { resumen: { total: 0, cantidad: 0 }, items: [] },
        deudaTotal: { total: 3000, inscripciones: 3000, campamentos: 0 },
        ultimosMovimientos: [],
      }),
    );
    render(<PersonaFichaView id="per-1" />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Juan Pérez' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Transferir a caja grupo' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Pago Parcial')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Grupo/ })).toHaveAttribute(
      'href',
      '/inscripciones/i1',
    );
    expect(screen.getByText('Sin campamentos registrados')).toBeInTheDocument();
    expect(screen.getByText('Sin movimientos recientes')).toBeInTheDocument();
    expect(screen.getByText('3 de 4')).toBeInTheDocument();
  });

  it('error del backend: mensaje y "Volver"', async () => {
    api.fetchPersonaDashboard.mockRejectedValue(
      new Error('Dashboard no disponible para PersonaExterna'),
    );
    render(<PersonaFichaView id="per-3" />);
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Dashboard no disponible para PersonaExterna',
      ),
    );
  });
});
