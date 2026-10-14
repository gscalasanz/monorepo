import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  campamentoDetalleSchema,
  campamentoSchema,
  type CampamentoDetalle,
} from '@/shared/domain';
import { CAMPAMENTO_FIXTURE } from '@/shared/domain/testing/fixtures';
import {
  CampamentoDetailView,
  CampamentoFormView,
  CampamentosListView,
} from '@/features/campamentos';
import { PagoDialog } from '@/features/campamentos/components/pago-dialog';

const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), search: '' }));
const push = nav.push;
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push, replace: nav.replace }),
  usePathname: () => '/campamentos/cam-1',
  useSearchParams: () => new URLSearchParams(nav.search),
}));

const api = {
  fetchCampamentos: vi.fn(),
  fetchCampamento: vi.fn(),
  fetchCampamentoDetalle: vi.fn(),
  createCampamento: vi.fn(),
  updateCampamento: vi.fn(),
  deleteCampamento: vi.fn(),
  updateAutorizacion: vi.fn(),
  quitarBonificacion: vi.fn(),
};
vi.mock('@/features/campamentos/services/campamentos-api', () => ({
  fetchCampamentos: (...a: unknown[]) => api.fetchCampamentos(...a),
  fetchCampamento: (...a: unknown[]) => api.fetchCampamento(...a),
  fetchCampamentoDetalle: (...a: unknown[]) => api.fetchCampamentoDetalle(...a),
  createCampamento: (...a: unknown[]) => api.createCampamento(...a),
  updateCampamento: (...a: unknown[]) => api.updateCampamento(...a),
  deleteCampamento: (...a: unknown[]) => api.deleteCampamento(...a),
  updateAutorizacion: (...a: unknown[]) => api.updateAutorizacion(...a),
  quitarBonificacion: (...a: unknown[]) => api.quitarBonificacion(...a),
  removeParticipante: vi.fn(),
  eliminarPago: vi.fn(),
  marcarReembolsoPagado: vi.fn(),
  addParticipante: vi.fn(),
  bonificarParticipante: vi.fn(),
  registrarPago: vi.fn(),
  registrarGasto: vi.fn(),
}));

/** Confirm que ejecuta la acción y confirma (el diálogo real se prueba en shared). */
const runDelete = vi.fn(
  async (_entity: string, config: { action: () => Promise<unknown> }) => {
    await config.action();
    return { confirmed: true };
  },
);
vi.mock('@/shared/confirm', () => ({
  confirmDialog: {
    runDelete: (entity: string, config: { action: () => Promise<unknown> }) =>
      runDelete(entity, config),
    run: vi.fn(),
  },
}));

vi.mock('@/shared/queries', () => ({
  fetchPersonasActivas: vi.fn().mockResolvedValue([]),
  fetchSaldoPersonal: vi.fn().mockResolvedValue(0),
}));

const notifySuccess = vi.fn();
vi.mock('@/shared/notifications', () => ({
  notify: { success: (m: string) => notifySuccess(m), error: vi.fn() },
}));

const CAMPAMENTO = campamentoSchema.parse({
  ...CAMPAMENTO_FIXTURE,
  descripcion: 'Sierra de la Ventana',
});
const TS = '2026-03-13T15:00:00.000Z';

const DETALLE: CampamentoDetalle = campamentoDetalleSchema.parse({
  campamento: {
    id: 'cam-1',
    nombre: 'Campamento de verano',
    fechaInicio: '2026-01-15',
    fechaFin: '2026-01-20',
    costoPorPersona: 45000,
    costoEducadores: 0,
    cuotasBase: 3,
    descripcion: null,
  },
  participantes: [
    {
      id: 'per-1',
      nombre: 'Juan',
      tipo: 'protagonista',
      rama: 'Manada',
      montoAsignado: 45000,
      montoBonificado: 0,
      totalPagado: 15000,
      saldoPendiente: 30000,
      estadoPago: 'parcial',
      autorizacionEntregada: false,
      fechaInscripcion: TS,
      pagos: [
        {
          movimientoId: 'm',
          fecha: TS,
          monto: 15000,
          medioPago: 'efectivo',
          tipo: 'ingreso',
          concepto: 'campamento_pago',
        },
      ],
    },
    {
      id: 'per-2',
      nombre: 'Lucía',
      tipo: 'educador',
      rama: null,
      montoAsignado: 0,
      montoBonificado: 0,
      totalPagado: 0,
      saldoPendiente: 0,
      estadoPago: 'exento',
      autorizacionEntregada: true,
      fechaInscripcion: TS,
      pagos: [],
    },
  ],
  movimientos: [
    {
      id: 'g1',
      fecha: TS,
      tipo: 'egreso',
      concepto: 'campamento_gasto',
      monto: 5000,
      descripcion: 'Leña',
      medioPago: 'efectivo',
      estadoPago: 'pendiente_reembolso',
      responsableId: 'per-2',
      responsableNombre: 'Lucía',
    },
  ],
  kpis: {
    totalARecaudar: 45000,
    totalRecaudado: 15000,
    totalBonificado: 0,
    totalGastado: 5000,
    totalPendienteReembolso: 5000,
    balance: 10000,
    deudaTotal: 30000,
    cantidadParticipantes: 2,
    participantesPagadosCompleto: 0,
    participantesPagadosParcial: 1,
    participantesPendientes: 0,
    participantesExentos: 1,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  nav.search = '';
});

describe('CampamentosListView', () => {
  it('tabla con link al detalle, chevron, descripción y resumen con hints', async () => {
    api.fetchCampamentos.mockResolvedValue([CAMPAMENTO]);
    render(<CampamentosListView />);
    const tabla = await screen.findByRole('region', {
      name: 'Lista de campamentos',
    });
    expect(
      within(tabla).getByRole('link', { name: 'Campamento de verano' }),
    ).toHaveAttribute('href', '/campamentos/cam-1');
    expect(
      within(tabla).getByRole('link', {
        name: 'Abrir campamento Campamento de verano',
      }),
    ).toHaveAttribute('href', '/campamentos/cam-1');
    expect(within(tabla).getByText('Sierra de la Ventana')).toBeInTheDocument();
    const resumen = screen.getByLabelText('Resumen de campamentos');
    expect(within(resumen).getByText('Finalizados')).toBeInTheDocument();
    expect(
      within(resumen).getByRole('button', {
        name: 'Qué significa Finalizados',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Crear Campamento' }),
    ).toHaveAttribute('href', '/campamentos/crear');
  });

  it('vacío: mensaje de Angular', async () => {
    api.fetchCampamentos.mockResolvedValue([]);
    render(<CampamentosListView />);
    expect(
      await screen.findByText('No hay campamentos registrados'),
    ).toBeInTheDocument();
  });

  it('⋯ de la fila: Editar navega a la edición', async () => {
    api.fetchCampamentos.mockResolvedValue([CAMPAMENTO]);
    render(<CampamentosListView />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Acciones para Campamento de verano',
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Editar' }),
    );
    expect(push).toHaveBeenCalledWith('/campamentos/cam-1/editar');
  });

  it('⋯ de la fila: Eliminar confirma y lo saca de la lista', async () => {
    api.fetchCampamentos.mockResolvedValue([CAMPAMENTO]);
    api.deleteCampamento.mockResolvedValue(undefined);
    render(<CampamentosListView />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Acciones para Campamento de verano',
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Eliminar' }),
    );
    expect(runDelete).toHaveBeenCalledWith('campamento', expect.anything());
    expect(api.deleteCampamento).toHaveBeenCalledWith('cam-1', {
      skipGlobalError: true,
    });
    await waitFor(() =>
      expect(
        screen.queryByRole('link', { name: 'Campamento de verano' }),
      ).toBeNull(),
    );
    expect(notifySuccess).toHaveBeenCalledWith(
      'Campamento eliminado exitosamente',
    );
  });
});

describe('CampamentoFormView', () => {
  it('alta: el submit queda deshabilitado hasta que el form es válido', async () => {
    api.createCampamento.mockResolvedValue({ ...CAMPAMENTO, id: 'nuevo' });
    render(<CampamentoFormView />);
    const submit = screen.getByRole('button', { name: 'Crear Campamento' });
    expect(submit).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText(/Nombre del Campamento/),
      'Verano',
    );
    await userEvent.type(
      screen.getByLabelText(/Fecha de Inicio/),
      '2026-01-15',
    );
    await userEvent.type(screen.getByLabelText(/Fecha de Fin/), '2026-01-20');
    await userEvent.type(screen.getByLabelText(/Costo por Persona/), '45000');
    await waitFor(() => expect(submit).toBeEnabled());
    await userEvent.click(submit);
    await waitFor(() => expect(api.createCampamento).toHaveBeenCalled());
    expect(api.createCampamento.mock.calls[0]?.[0]).toMatchObject({
      nombre: 'Verano',
      fechaInicio: '2026-01-15',
      fechaFin: '2026-01-20',
      costoPorPersona: 45000,
      costoEducadores: 0,
      cuotasBase: 1,
    });
    expect(notifySuccess).toHaveBeenCalledWith(
      'Campamento creado exitosamente',
    );
    expect(push).toHaveBeenCalledWith('/campamentos/nuevo');
  });

  it('dos tarjetas: datos del campamento y costos', async () => {
    render(<CampamentoFormView />);
    const datos = screen.getByRole('region', { name: 'Datos del campamento' });
    expect(
      within(datos).getByLabelText(/Nombre del Campamento/),
    ).toBeInTheDocument();
    expect(within(datos).getByLabelText(/Fecha de Inicio/)).toBeInTheDocument();
    expect(within(datos).getByLabelText(/Descripción/)).toBeInTheDocument();
    const costos = screen.getByRole('region', { name: 'Costos' });
    expect(
      within(costos).getByLabelText(/Costo por Persona/),
    ).toBeInTheDocument();
    expect(
      within(costos).getByLabelText(/Cantidad de Cuotas/),
    ).toBeInTheDocument();
    expect(
      within(costos).getByLabelText(/Aporte de Educadores/),
    ).toBeInTheDocument();
  });

  it('edición: precarga los datos', async () => {
    api.fetchCampamento.mockResolvedValue(CAMPAMENTO);
    render(<CampamentoFormView id="cam-1" />);
    expect(
      await screen.findByDisplayValue('Campamento de verano'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeEnabled();
  });
});

async function openActionsFor(nombre: string) {
  await userEvent.click(
    await screen.findByRole('button', { name: `Acciones para ${nombre}` }),
  );
}

describe('CampamentoDetailView', () => {
  it('encabezado, un solo panel de KPIs con hints y barra de recaudación', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Campamento de verano',
      }),
    ).toBeInTheDocument();
    const kpis = screen.getByLabelText('Resumen Financiero');
    for (const label of [
      'Costo por persona',
      'Cuotas sugeridas',
      'Participantes',
      'Total a Recaudar',
      'Balance',
    ]) {
      expect(
        within(kpis).getByRole('button', { name: `Qué significa ${label}` }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole('progressbar', { name: 'Recaudación' }),
    ).toHaveAttribute('aria-valuenow', '33');
    expect(api.fetchCampamentoDetalle.mock.calls[0]?.[0]).toEqual({
      id: 'cam-1',
      filtroMovimientos: 'todos',
    });
  });

  it('pestañas con contador', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    expect(
      await screen.findByRole('tab', { name: /Participantes.*2/ }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('tab', { name: /Movimientos.*1/ }),
    ).toBeInTheDocument();
  });

  it('participantes en tabla: link a la ficha, estado y autorización', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    const tabla = await screen.findByRole('region', {
      name: 'Participantes del campamento',
    });
    expect(within(tabla).getByRole('link', { name: 'Juan' })).toHaveAttribute(
      'href',
      '/personas/protagonistas/per-1',
    );
    const juan = within(tabla).getByRole('row', { name: /Juan/ });
    expect(within(juan).getByText('Pendiente')).toBeInTheDocument();
    expect(within(juan).getByText('pendiente')).toBeInTheDocument();
    const lucia = within(tabla).getByRole('row', { name: /Lucía/ });
    expect(within(lucia).getByText('Exento')).toBeInTheDocument();
    expect(within(lucia).getByText('Entregada')).toBeInTheDocument();
  });

  it('mobile: la fila muestra la autorización solo si falta', async () => {
    const spy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    const lista = await screen.findByRole('list', {
      name: 'Participantes del campamento',
    });
    expect(within(lista).getAllByText('Pendiente')).toHaveLength(1);
    expect(within(lista).queryByText('Entregada')).not.toBeInTheDocument();
    spy.mockRestore();
  });

  it('⋯ del participante: acciones según su estado', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await openActionsFor('Juan');
    const items = (await screen.findAllByRole('menuitem')).map(
      (i) => i.textContent,
    );
    expect(items).toEqual([
      'Registrar pago',
      'Bonificar',
      'Marcar autorización entregada',
      'Quitar participante',
    ]);
  });

  it('⋯ del exento: sin pago ni bonificación', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await openActionsFor('Lucía');
    const items = (await screen.findAllByRole('menuitem')).map(
      (i) => i.textContent,
    );
    expect(items).toEqual([
      'Marcar autorización pendiente',
      'Quitar participante',
    ]);
  });

  it('marcar autorización recarga y avisa', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    api.updateAutorizacion.mockResolvedValue(undefined);
    render(<CampamentoDetailView id="cam-1" />);
    await openActionsFor('Juan');
    await userEvent.click(
      await screen.findByRole('menuitem', {
        name: 'Marcar autorización entregada',
      }),
    );
    expect(api.updateAutorizacion).toHaveBeenCalledWith(
      { campamentoId: 'cam-1', personaId: 'per-1' },
      true,
    );
    await waitFor(() =>
      expect(notifySuccess).toHaveBeenCalledWith(
        'Autorización actualizada exitosamente',
      ),
    );
    expect(api.fetchCampamentoDetalle).toHaveBeenCalledTimes(2);
  });

  it('la fila se expande y muestra los pagos con su eliminar', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    expect(screen.queryByRole('button', { name: 'Eliminar pago' })).toBeNull();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Ver pagos de Juan' }),
    );
    const historial = screen.getByRole('list', { name: 'Historial de pagos' });
    expect(
      within(historial).getByRole('button', { name: 'Eliminar pago' }),
    ).toBeInTheDocument();
  });

  it('tab Movimientos: tabla compartida y filtro en el servidor', async () => {
    nav.search = 'tab=movimientos';
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    expect(
      await screen.findByRole('region', { name: 'Movimientos del campamento' }),
    ).toHaveTextContent('Leña');
    expect(
      screen.getByRole('button', { name: 'Registrar gasto' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Gastos' }));
    await waitFor(() =>
      expect(api.fetchCampamentoDetalle).toHaveBeenLastCalledWith(
        { id: 'cam-1', filtroMovimientos: 'gastos' },
        expect.anything(),
      ),
    );
  });

  it('cambiar de pestaña actualiza la URL', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('tab', { name: /Movimientos/ }),
    );
    expect(nav.replace).toHaveBeenCalledWith(
      '/campamentos/cam-1?tab=movimientos',
      {
        scroll: false,
      },
    );
  });

  it('⋯ del encabezado: Editar navega a la edición', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Más acciones del campamento',
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Editar campamento' }),
    );
    expect(push).toHaveBeenCalledWith('/campamentos/cam-1/editar');
  });

  it('⋯ del encabezado: Eliminar borra y vuelve a la lista', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    api.deleteCampamento.mockResolvedValue(undefined);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Más acciones del campamento',
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Eliminar campamento' }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/campamentos'));
    expect(api.deleteCampamento).toHaveBeenCalledWith('cam-1', {
      skipGlobalError: true,
    });
  });

  it('acción principal: Agregar participante abre el diálogo', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Agregar participante' }),
    );
    expect(
      await screen.findByRole('dialog', { name: 'Agregar Participante' }),
    ).toBeInTheDocument();
  });
});

describe('PagoDialog', () => {
  it('"Solo Efectivo" completa lo pendiente y envía el DTO', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const participante = DETALLE.participantes[0];
    if (!participante) throw new Error('fixture');
    render(
      <PagoDialog
        participante={participante}
        saldoCuentaPersonal={0}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );
    const submit = screen.getByRole('button', { name: 'Registrar Pago' });
    expect(submit).toBeDisabled();
    await userEvent.click(
      screen.getByRole('button', { name: /Solo Efectivo/ }),
    );
    await userEvent.click(submit);
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        personaId: 'per-1',
        dto: { montoPagado: 30000, medioPago: 'efectivo' },
      }),
    );
  });
});
