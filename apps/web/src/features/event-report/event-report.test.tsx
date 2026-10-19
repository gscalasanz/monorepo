import { render, screen } from '@testing-library/react';
import { cloneElement, isValidElement, type ReactNode } from 'react';

import { ApiError } from '@/shared/api';
import { EventReportView } from '@/features/event-report';
import {
  REPORTE_GRUPO,
  REPORTE_MIXTO,
  REPORTE_PERSONALES,
  REPORTE_VENTA,
} from '@/features/event-report/testing/fixtures';

const mocks = vi.hoisted(() => ({
  fetchReporte: vi.fn(),
  fetchReportePublico: vi.fn(),
}));
vi.mock('@/features/event-report/services/event-report-api', () => mocks);

// jsdom no mide layout: el ResponsiveContainer recibe un tamaño fijo.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  const FIXED = { width: 400, height: 240 };
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { readonly children: ReactNode }) =>
      isValidElement<typeof FIXED>(children)
        ? cloneElement(children, FIXED)
        : null,
  };
});

const httpError = (status: number) =>
  new ApiError({ kind: 'http', status, method: 'GET', url: '/x' });

function withSession() {
  window.localStorage.setItem('accessToken', 'access');
  window.localStorage.setItem('refreshToken', 'refresh');
}

describe('<EventReportView>', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
  });

  it('con sesión: endpoint autenticado, "Volver al evento" y secciones de venta', async () => {
    withSession();
    mocks.fetchReporte.mockResolvedValue(REPORTE_VENTA);
    render(<EventReportView eventoId="evt-1" />);

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Venta de pastelitos',
      }),
    ).toBeInTheDocument();
    expect(mocks.fetchReporte).toHaveBeenCalledWith(
      expect.objectContaining({ eventoId: 'evt-1' }),
    );
    expect(mocks.fetchReportePublico).not.toHaveBeenCalled();
    expect(
      screen.getByRole('link', { name: 'Volver al evento' }),
    ).toHaveAttribute('href', '/eventos/evt-1');
    for (const title of [
      'Indicadores clave',
      'Resultado económico',
      'Productos',
      'Recaudación por tipo de persona',
      'Ranking de vendedores',
      'Detalle por vendedor',
      'Vendido vs. entregado',
      'Horarios de entrega',
      'Participación por rama',
      'Pendiente de pago',
      'Egresos del evento',
      'Integridad de datos',
    ]) {
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: new RegExp(`^${title}`),
        }),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole('heading', { name: /Ganancia por persona/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('TOTAL EGRESOS')).toBeInTheDocument();
    expect(screen.getByText('TOTAL PENDIENTE')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Quedan 2 unidades vendidas sin retirar (10% del total).',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('ALERTA')).toBeInTheDocument();
  });

  it('anónimo con reporte público: endpoint público, sin "Volver al evento"', async () => {
    mocks.fetchReportePublico.mockResolvedValue(REPORTE_GRUPO);
    render(<EventReportView eventoId="evt-1" />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Peña anual' }),
    ).toBeInTheDocument();
    expect(mocks.fetchReportePublico).toHaveBeenCalledWith(
      expect.objectContaining({ eventoId: 'evt-1' }),
    );
    expect(mocks.fetchReporte).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('link', { name: 'Volver al evento' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^Ingresos del evento/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('Entradas')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /^Productos/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /^Pendiente de pago/ }),
    ).not.toBeInTheDocument();
  });

  it('anónimo y reporte no público (404): "Reporte no disponible" + link a login', async () => {
    mocks.fetchReportePublico.mockRejectedValue(httpError(404));
    render(<EventReportView eventoId="evt-1" />);

    expect(
      await screen.findByRole('heading', { name: 'Reporte no disponible' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Iniciar sesión' }),
    ).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('otro error: mensaje de error de carga', async () => {
    mocks.fetchReportePublico.mockRejectedValue(httpError(500));
    render(<EventReportView eventoId="evt-1" />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo cargar el reporte del evento.',
    );
  });

  it('cuentas personales y mixto muestran "Ganancia por persona"', async () => {
    withSession();
    mocks.fetchReporte.mockResolvedValueOnce(REPORTE_PERSONALES);
    const { unmount } = render(<EventReportView eventoId="evt-1" />);
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /^Ganancia por persona/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Costo recuperado por el grupo'),
    ).toBeInTheDocument();
    unmount();

    mocks.fetchReporte.mockResolvedValueOnce(REPORTE_MIXTO);
    render(<EventReportView eventoId="evt-2" />);
    expect(await screen.findByText('Neto caja del grupo')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bloque pendiente de implementar para eventos con destino “cuentas personales”.',
      ),
    ).toBeInTheDocument();
  });
});
