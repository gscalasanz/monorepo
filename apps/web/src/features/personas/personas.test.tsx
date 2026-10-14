import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { personasSchema } from '@/shared/domain';
import {
  EDUCADOR_FIXTURE,
  EXTERNO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import {
  EducadorFormView,
  PersonaExternaDetailView,
  PersonaExternaFormView,
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

  it('fila navegable: nombre y chevron a la ficha, ⋯ con acciones y cargo como sub-línea', async () => {
    const user = userEvent.setup();
    render(<PersonasListView />);
    expect(await screen.findByRole('link', { name: 'Juan' })).toHaveAttribute(
      'href',
      '/personas/protagonistas/per-1',
    );
    expect(
      screen.getByRole('link', { name: 'Abrir ficha de Juan' }),
    ).toHaveAttribute('href', '/personas/protagonistas/per-1');
    expect(
      screen.getByRole('button', { name: 'Acciones para Juan' }),
    ).toBeInTheDocument();
    await user.click(screen.getByText('Manada', { selector: 'td *' }));
    expect(push).toHaveBeenCalledWith('/personas/protagonistas/per-1');
    await user.click(screen.getByRole('tab', { name: 'Educadores' }));
    expect(await screen.findByText('Jefe de Grupo')).toBeInTheDocument();
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

  it('dos tarjetas: datos de la persona y documentación', async () => {
    render(<ProtagonistaFormView />);
    const datos = screen.getByRole('region', { name: 'Datos de la persona' });
    expect(within(datos).getByLabelText(/Nombre/)).toBeInTheDocument();
    const docs = screen.getByRole('region', {
      name: 'Documentación entregada',
    });
    expect(within(docs).getAllByRole('checkbox')).toHaveLength(4);
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

const DASHBOARD_BASE = {
  persona: {
    id: 'per-1',
    nombre: 'Juan Pérez',
    tipo: 'protagonista',
    estado: 'activo',
    rama: 'Manada',
  },
  cuentaPersonal: { id: 'c1', saldo: 0 },
  documentacionPersonal: {
    partidaNacimiento: true,
    dni: true,
    dniPadres: true,
    carnetObraSocial: true,
    completa: true,
  },
  inscripciones: { resumen: { total: 0, cantidad: 0 }, items: [] },
  campamentos: { resumen: { total: 0, cantidad: 0 }, items: [] },
  deudaTotal: { total: 0, inscripciones: 0, campamentos: 0 },
  ultimosMovimientos: [],
};
const INSCRIPCION_ITEM = {
  id: 'i1',
  tipo: 'grupo',
  ano: 2026,
  montoTotal: 5000,
  montoBonificado: 0,
  montoPagado: 5000,
  saldoPendiente: 0,
  estado: 'pagado',
};
const CAMPAMENTO_ITEM = {
  id: 'c1',
  nombre: 'Campamento de verano',
  ano: 2026,
  montoTotal: 60000,
  montoPagado: 0,
  saldoPendiente: 60000,
  autorizacionEntregada: false,
};

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
    expect(
      screen.queryByText('Sin campamentos registrados'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^Obligaciones/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Actividad' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Sin movimientos recientes')).toBeInTheDocument();
    expect(screen.getByText('3 de 4')).toBeInTheDocument();
    expect(screen.getByText('Falta')).toBeInTheDocument();
  });

  it('inscripciones y campamentos conviven en Obligaciones; el año se elige solo si hay más de uno', async () => {
    const user = userEvent.setup();
    api.fetchPersonaDashboard.mockResolvedValue(
      personaDashboardSchema.parse({
        ...DASHBOARD_BASE,
        inscripciones: {
          resumen: { total: 0, cantidad: 2 },
          items: [
            { ...INSCRIPCION_ITEM, id: 'i1', ano: 2026 },
            {
              ...INSCRIPCION_ITEM,
              id: 'i0',
              ano: 2025,
              tipo: 'scout_argentina',
            },
          ],
        },
        campamentos: {
          resumen: { total: 60000, cantidad: 1 },
          items: [CAMPAMENTO_ITEM],
        },
      }),
    );
    render(<PersonaFichaView id="per-1" />);
    const panel = (
      await screen.findByRole('heading', { name: /^Obligaciones/ })
    ).closest('section') as HTMLElement;
    expect(within(panel).getByRole('link', { name: /Grupo/ })).toHaveAttribute(
      'href',
      '/inscripciones/i1',
    );
    expect(
      within(panel).getByRole('link', { name: /Campamento de verano/ }),
    ).toHaveAttribute('href', '/campamentos/c1');
    expect(
      within(panel).queryByRole('link', { name: /Scout Argentina/ }),
    ).not.toBeInTheDocument();
    expect(within(panel).getByText('Falta autorización')).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: '2025' }));
    expect(
      within(panel).getByRole('link', { name: /Scout Argentina/ }),
    ).toHaveAttribute('href', '/inscripciones/i0');
    expect(
      within(panel).queryByRole('link', { name: /Campamento de verano/ }),
    ).not.toBeInTheDocument();
  });

  it('no hay avatar con iniciales y todo lo navegable lleva chevron', async () => {
    api.fetchPersonaDashboard.mockResolvedValue(
      personaDashboardSchema.parse({
        ...DASHBOARD_BASE,
        inscripciones: {
          resumen: { total: 0, cantidad: 1 },
          items: [INSCRIPCION_ITEM],
        },
        ultimosMovimientos: [
          {
            id: 'm1',
            fecha: '2026-05-15T15:00:00.000Z',
            tipo: 'ingreso',
            concepto: 'Pago inscripción grupo',
            monto: 1500,
            medioPago: 'efectivo',
          },
        ],
      }),
    );
    render(<PersonaFichaView id="per-1" />);
    const heading = await screen.findByRole('heading', {
      level: 1,
      name: 'Juan Pérez',
    });
    expect(heading.parentElement?.previousElementSibling).toBeNull();
    expect(screen.queryByText('JP')).not.toBeInTheDocument();
    const insc = screen.getByRole('link', { name: /Grupo/ });
    expect(insc.querySelector('svg.lucide-chevron-right')).not.toBeNull();
    const mov = screen.getByRole('link', { name: /Pago inscripción grupo/ });
    expect(mov).toHaveAttribute('href', '/movimientos/m1/editar');
    expect(mov.querySelector('svg.lucide-chevron-right')).not.toBeNull();
    expect(screen.getByRole('link', { name: /Actualizar/ })).toHaveAttribute(
      'href',
      '/personas/protagonistas/per-1/editar',
    );
  });

  it('con un solo año no hay selector de año; sin obligaciones, un estado vacío', async () => {
    api.fetchPersonaDashboard.mockResolvedValue(
      personaDashboardSchema.parse({ ...DASHBOARD_BASE }),
    );
    render(<PersonaFichaView id="per-1" />);
    expect(
      await screen.findByText('Sin inscripciones ni campamentos registrados'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Año' }),
    ).not.toBeInTheDocument();
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

describe('<PersonaExternaDetailView>', () => {
  it('encabezado como la ficha: nombre, chips, Editar y ⋯ con Eliminar; datos en un panel', async () => {
    api.fetchPersona.mockResolvedValue(
      personasSchema.parse([EXTERNO_FIXTURE])[0],
    );
    const user = userEvent.setup();
    render(<PersonaExternaDetailView id="per-3" />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Ana' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Persona Externa')).toBeInTheDocument();
    const datos = screen
      .getByRole('heading', { name: 'Datos de contacto' })
      .closest('section');
    expect(datos).toHaveTextContent('Mamá de Juan');
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    expect(push).toHaveBeenCalledWith(
      '/personas/personas-externas/per-3/editar',
    );
    await user.click(
      screen.getByRole('button', { name: 'Más acciones de Ana' }),
    );
    expect(
      await screen.findByRole('menuitem', { name: 'Eliminar' }),
    ).toBeInTheDocument();
  });
});

describe('formularios de educador y persona externa', () => {
  it('educador (alta): datos a la izquierda y acceso al sistema a la derecha', () => {
    render(<EducadorFormView />);
    const datos = screen.getByRole('region', { name: 'Datos de la persona' });
    expect(within(datos).getByLabelText(/Cargo/)).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Acceso al sistema' }),
    ).toBeInTheDocument();
  });

  it('persona externa: datos y notas en dos tarjetas', () => {
    render(<PersonaExternaFormView />);
    expect(
      screen.getByRole('region', { name: 'Datos de la persona' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Notas' })).toBeInTheDocument();
  });
});
