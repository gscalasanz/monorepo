import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PERSONA_TYPE, movimientoSchema, personaDeudaSchema, type PersonaDeuda } from '@/shared/domain';
import { MOVIMIENTO_FIXTURE } from '@/shared/domain/testing/fixtures';
import { DashboardView } from '@/features/dashboard';
import { CONSOLIDADO } from '@/features/dashboard/testing/fixtures';

const fetchDashboardData = vi.fn();
vi.mock('@/features/dashboard/services/dashboard-api', () => ({
  fetchDashboardData: () => fetchDashboardData(),
}));

const fetchMovimientosSince = vi.fn();
vi.mock('@/features/dashboard/services/cash-flow-api', () => ({
  fetchMovimientosSince: () => fetchMovimientosSince(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard',
}));

const DEUDOR: PersonaDeuda = personaDeudaSchema.parse({
  personaId: 'p1',
  nombre: 'Lucía Paz',
  tipo: PERSONA_TYPE.PROTAGONISTA,
  estado: 'activo',
  rama: 'Unidad',
  esMayorDeEdad: false,
  deudaTotal: 96000,
  campamentos: [
    { campamentoId: 'c', nombre: 'Verano', ano: 2026, montoTotal: 96000, montoPagado: 0, saldo: 96000, autorizacionEntregada: true },
  ],
  inscripcionesGrupo: [],
  inscripcionesScout: [],
  documentacionPersonal: null,
  documentacionInscripcion: [],
});

const BASE_DATA = {
  consolidado: CONSOLIDADO,
  eventos: [],
  recientes: [],
  deudas: [],
  inscripciones: [],
};

beforeEach(() => {
  fetchDashboardData.mockReset();
  fetchMovimientosSince.mockReset();
  fetchDashboardData.mockResolvedValue(BASE_DATA);
  fetchMovimientosSince.mockResolvedValue({ movimientos: [], truncated: false });
});

describe('DashboardView', () => {
  it('saluda y muestra el dinero del grupo con el reparto por caja y los pendientes', async () => {
    render(<DashboardView />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/^(Buen día|Buenas tardes|Buenas noches)/);
    expect(await screen.findByText('Dinero del grupo')).toBeInTheDocument();
    const saldos = screen.getByLabelText('Saldos del grupo');
    for (const label of ['Caja de Grupo', 'Fondos de Rama', 'Cuentas Personales', 'Fondo Solidario', 'Reembolsos Pendientes', 'Cobros Pendientes']) {
      expect(within(saldos).getByText(label)).toBeInTheDocument();
    }
  });

  it('muestra el estado vacío de cada lista', async () => {
    render(<DashboardView />);
    await waitFor(() => expect(screen.getByText('No hay eventos próximos')).toBeInTheDocument());
    expect(screen.getByText('No hay movimientos recientes')).toBeInTheDocument();
    expect(screen.getByText('Nadie debe nada')).toBeInTheDocument();
  });

  it('los accesos rápidos viven en un menú y cada uno es un link', async () => {
    const user = userEvent.setup();
    render(<DashboardView />);
    await user.click(await screen.findByRole('button', { name: 'Acciones' }));
    expect(await screen.findByRole('menuitem', { name: 'Nuevo movimiento' })).toHaveAttribute('href', '/movimientos/nuevo');
    expect(screen.getByRole('menuitem', { name: 'Registrar Inscripción' })).toHaveAttribute('href', '/inscripciones/crear');
    expect(screen.getByRole('menuitem', { name: 'Deudores' })).toHaveAttribute('href', '/reportes/deudas');
  });

  it('"Nuevo movimiento" ya no es un botón aparte: vive solo en el menú', async () => {
    render(<DashboardView />);
    await screen.findByText('Dinero del grupo');
    expect(screen.queryByRole('button', { name: 'Nuevo movimiento' })).not.toBeInTheDocument();
  });

  it('lista los deudores con su origen y el total adeudado', async () => {
    fetchDashboardData.mockResolvedValue({ ...BASE_DATA, deudas: [DEUDOR] });
    render(<DashboardView />);
    expect(await screen.findByText('Lucía Paz')).toBeInTheDocument();
    expect(screen.getByText('1 persona')).toBeInTheDocument();
    expect(screen.getByText(/Campamento/)).toBeInTheDocument();
    expect(screen.getByText('Total adeudado')).toBeInTheDocument();
  });

  it('la franja de métricas incluye la deuda a cobrar y las inscripciones al día', async () => {
    render(<DashboardView />);
    const metrics = await screen.findByLabelText('Resumen del mes');
    expect(within(metrics).getByText('Deuda a cobrar')).toBeInTheDocument();
    expect(within(metrics).getByText(/^Inscripciones \d{4}$/)).toBeInTheDocument();
  });

  it('si falla el historial, el gráfico lo dice y el resto de la pantalla sigue', async () => {
    fetchMovimientosSince.mockRejectedValue(new Error('boom'));
    render(<DashboardView />);
    expect(await screen.findByText('No se pudo cargar la evolución mensual.')).toBeInTheDocument();
    expect(screen.getByText('Dinero del grupo')).toBeInTheDocument();
  });

  it('si no carga el consolidado, el gráfico no queda cargando para siempre', async () => {
    fetchDashboardData.mockResolvedValue({ ...BASE_DATA, consolidado: null });
    render(<DashboardView />);
    expect(await screen.findByText('No se pudo cargar la evolución mensual.')).toBeInTheDocument();
    expect(fetchMovimientosSince).not.toHaveBeenCalled();
  });

  describe('navegación', () => {
    it('cada caja del reparto lleva a su pestaña en Cajas', async () => {
      render(<DashboardView />);
      const saldos = await screen.findByLabelText('Saldos del grupo');
      expect(within(saldos).getByRole('link', { name: /Caja de Grupo/ })).toHaveAttribute('href', '/cajas?tab=grupo');
      expect(within(saldos).getByRole('link', { name: /Fondos de Rama/ })).toHaveAttribute('href', '/cajas?tab=rama');
      expect(within(saldos).getByRole('link', { name: /Cuentas Personales/ })).toHaveAttribute('href', '/cajas?tab=personal');
      expect(within(saldos).getByRole('link', { name: /Fondo Solidario/ })).toHaveAttribute('href', '/cajas?tab=fondo-solidario');
    });

    it('"Dinero del grupo" lleva a Cajas y los pendientes a la lista filtrada', async () => {
      render(<DashboardView />);
      expect(await screen.findByRole('link', { name: 'Dinero del grupo' })).toHaveAttribute('href', '/cajas');
      expect(screen.getByRole('link', { name: /Reembolsos Pendientes/ })).toHaveAttribute(
        'href',
        '/movimientos?tipo=egreso&estadoPago=pendiente_reembolso',
      );
      expect(screen.getByRole('link', { name: /Cobros Pendientes/ })).toHaveAttribute(
        'href',
        '/movimientos?tipo=ingreso&estadoPago=pendiente_cobro',
      );
    });

    it('las métricas navegan: deuda a cobrar → deudores, inscripciones → inscripciones', async () => {
      render(<DashboardView />);
      const metrics = await screen.findByLabelText('Resumen del mes');
      expect(within(metrics).getByRole('link', { name: 'Deuda a cobrar' })).toHaveAttribute('href', '/reportes/deudas');
      expect(within(metrics).getByRole('link', { name: /^Inscripciones \d{4}$/ })).toHaveAttribute('href', '/inscripciones');
    });

    it('ingresos y egresos del mes llevan a la lista filtrada por tipo y mes', async () => {
      fetchMovimientosSince.mockResolvedValue({ movimientos: [], truncated: false });
      render(<DashboardView />);
      const metrics = await screen.findByLabelText('Resumen del mes');
      const ingresos = await within(metrics).findByRole('link', { name: /^Ingresos de / });
      expect(ingresos.getAttribute('href')).toMatch(/^\/movimientos\?tipo=ingreso&fechaInicio=\d{4}-\d{2}-01&fechaFin=\d{4}-\d{2}-\d{2}$/);
      const egresos = within(metrics).getByRole('link', { name: /^Egresos de / });
      expect(egresos.getAttribute('href')).toContain('tipo=egreso');
    });

    it('cada fondo de rama lleva a Cajas › Fondos de rama', async () => {
      render(<DashboardView />);
      const links = await screen.findAllByRole('link', { name: /Manada|Unidad/ });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) expect(link).toHaveAttribute('href', '/cajas?tab=rama');
    });

    it('cada deudor lleva a la ficha de su persona', async () => {
      fetchDashboardData.mockResolvedValue({ ...BASE_DATA, deudas: [DEUDOR] });
      render(<DashboardView />);
      const link = await screen.findByRole('link', { name: /Lucía Paz/ });
      expect(link).toHaveAttribute('href', '/personas/protagonistas/p1');
    });

    it('cada movimiento reciente abre su edición', async () => {
      const mov = movimientoSchema.parse(MOVIMIENTO_FIXTURE);
      fetchDashboardData.mockResolvedValue({ ...BASE_DATA, recientes: [mov] });
      render(<DashboardView />);
      expect(await screen.findByRole('link', { name: 'Garrafa' })).toHaveAttribute('href', `/movimientos/${mov.id}/editar`);
    });
  });

  describe('evolución por día, semana o mes', () => {
    it('ofrece Día, Semana y Mes, con Mes elegido por defecto', async () => {
      render(<DashboardView />);
      const group = await screen.findByRole('group', { name: 'Agrupar la evolución por' });
      expect(within(group).getByRole('button', { name: 'Mes' })).toHaveAttribute('aria-pressed', 'true');
      expect(within(group).getByRole('button', { name: 'Día' })).toHaveAttribute('aria-pressed', 'false');
      expect(within(group).getByRole('button', { name: 'Semana' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('la evolución es una fila propia, separada del resumen de tesorería', async () => {
      render(<DashboardView />);
      const evolucion = await screen.findByRole('heading', { name: 'Evolución' });
      const tesoreria = screen.getByRole('link', { name: 'Dinero del grupo' });
      const panel = evolucion.closest('section');
      expect(panel).not.toBeNull();
      expect(panel).not.toContainElement(tesoreria);
    });

    it('cambiar la granularidad mueve la selección', async () => {
      const user = userEvent.setup();
      render(<DashboardView />);
      const group = await screen.findByRole('group', { name: 'Agrupar la evolución por' });
      await user.click(within(group).getByRole('button', { name: 'Día' }));
      expect(within(group).getByRole('button', { name: 'Día' })).toHaveAttribute('aria-pressed', 'true');
      expect(within(group).getByRole('button', { name: 'Mes' })).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
