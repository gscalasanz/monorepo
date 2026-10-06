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

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  usePathname: () => '/campamentos',
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
      saldoCuentaPersonal: 0,
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
      saldoCuentaPersonal: 0,
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
});

describe('CampamentosListView', () => {
  it('muestra resumen y cards', async () => {
    api.fetchCampamentos.mockResolvedValue([CAMPAMENTO]);
    render(<CampamentosListView />);
    expect(
      await screen.findByRole('link', { name: 'Campamento de verano' }),
    ).toHaveAttribute('href', '/campamentos/cam-1');
    const resumen = screen.getByLabelText('Resumen de campamentos');
    expect(within(resumen).getByText('Finalizados')).toBeInTheDocument();
    expect(screen.getByText('Sierra de la Ventana')).toBeInTheDocument();
  });

  it('vacío: mensaje de Angular', async () => {
    api.fetchCampamentos.mockResolvedValue([]);
    render(<CampamentosListView />);
    expect(
      await screen.findByText('No hay campamentos registrados'),
    ).toBeInTheDocument();
  });

  it('elimina con confirmación y lo saca de la lista', async () => {
    api.fetchCampamentos.mockResolvedValue([CAMPAMENTO]);
    api.deleteCampamento.mockResolvedValue(undefined);
    render(<CampamentosListView />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Eliminar campamento' }),
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

  it('edición: precarga los datos', async () => {
    api.fetchCampamento.mockResolvedValue(CAMPAMENTO);
    render(<CampamentoFormView id="cam-1" />);
    expect(
      await screen.findByDisplayValue('Campamento de verano'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeEnabled();
  });
});

describe('CampamentoDetailView', () => {
  it('KPIs, participantes con estado y exento', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Campamento de verano',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Total a Recaudar')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Recaudación' }),
    ).toHaveAttribute('aria-valuenow', '33');
    expect(screen.getByText('Exento')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Registrar pago' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Eliminar pago' }),
    ).toBeInTheDocument();
    expect(api.fetchCampamentoDetalle.mock.calls[0]?.[0]).toEqual({
      id: 'cam-1',
      filtroMovimientos: 'todos',
    });
  });

  it('toggle de autorización recarga y avisa', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    api.updateAutorizacion.mockResolvedValue(undefined);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Autorización pendiente' }),
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

  it('tab Movimientos: filtro en el servidor', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('tab', { name: 'Movimientos' }),
    );
    expect(screen.getByText('Leña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gasto' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Gastos' }));
    await waitFor(() =>
      expect(api.fetchCampamentoDetalle).toHaveBeenLastCalledWith(
        { id: 'cam-1', filtroMovimientos: 'gastos' },
        expect.anything(),
      ),
    );
  });

  it('Eliminar del detalle borra de verdad y vuelve a la lista (desvío documentado)', async () => {
    api.fetchCampamentoDetalle.mockResolvedValue(DETALLE);
    api.deleteCampamento.mockResolvedValue(undefined);
    render(<CampamentoDetailView id="cam-1" />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Eliminar' }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/campamentos'));
    expect(api.deleteCampamento).toHaveBeenCalledWith('cam-1', {
      skipGlobalError: true,
    });
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
