import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  PERSONA_TYPE,
  campamentoSchema,
  eventoSchema,
  movimientoSchema,
  personaDeudaSchema,
  type PersonaDeuda,
} from '@/shared/domain';
import { CAMPAMENTO_FIXTURE, EVENTO_FIXTURE, MOVIMIENTO_FIXTURE } from '@/shared/domain/testing/fixtures';
import { asLocalDate } from '@/shared/time';
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
  saldoCuentaPersonal: 0,
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
  campamentos: [],
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

  it('la franja de métricas incluye los próximos eventos y las inscripciones al día', async () => {
    render(<DashboardView />);
    const metrics = await screen.findByLabelText('Resumen del mes');
    expect(within(metrics).getByText('Próximos eventos')).toBeInTheDocument();
    expect(within(metrics).getByText(/^Inscripciones \d{4}$/)).toBeInTheDocument();
    expect(within(metrics).queryByText('Deuda a cobrar')).not.toBeInTheDocument();
  });

  it('los próximos eventos incluyen campamentos, ordenados por fecha y con su link', async () => {
    const evento = { ...eventoSchema.parse(EVENTO_FIXTURE), id: 'e1', nombre: 'Locro', fecha: asLocalDate('2099-06-10') };
    const campamento = {
      ...campamentoSchema.parse(CAMPAMENTO_FIXTURE),
      id: 'c1',
      nombre: 'Campamento de Inicio',
      fechaInicio: asLocalDate('2099-05-01'),
    };
    fetchDashboardData.mockResolvedValue({ ...BASE_DATA, eventos: [evento], campamentos: [campamento] });
    render(<DashboardView />);
    const metrics = await screen.findByLabelText('Resumen del mes');
    const rows = within(metrics).getAllByRole('link', { name: /Campamento de Inicio|Locro/ });
    expect(rows.map((r) => r.getAttribute('href'))).toEqual(['/campamentos/c1', '/eventos/e1']);
    expect(rows[0]).toHaveTextContent('Campamento');
  });

  it('si falla el historial, el resto de la pantalla sigue', async () => {
    fetchMovimientosSince.mockRejectedValue(new Error('boom'));
    render(<DashboardView />);
    expect(await screen.findByText('Dinero del grupo')).toBeInTheDocument();
    expect(screen.queryByText('Evolución')).not.toBeInTheDocument();
  });

  it('ya no muestra el gráfico de evolución', async () => {
    render(<DashboardView />);
    await screen.findByText('Dinero del grupo');
    expect(screen.queryByRole('heading', { name: 'Evolución' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Agrupar la evolución por' })).not.toBeInTheDocument();
  });

  it('la deuda a cobrar va debajo de los cobros pendientes y lleva al reporte de deudores', async () => {
    render(<DashboardView />);
    const saldos = await screen.findByLabelText('Saldos del grupo');
    const links = within(saldos).getAllByRole('link');
    const cobros = links.findIndex((l) => /Cobros Pendientes/.test(l.textContent ?? ''));
    expect(links[cobros + 1]).toHaveTextContent('Deuda a cobrar');
    expect(links[cobros + 1]).toHaveAttribute('href', '/reportes/deudas');
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

    it('las métricas navegan: inscripciones → inscripciones', async () => {
      render(<DashboardView />);
      const metrics = await screen.findByLabelText('Resumen del mes');
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
});
