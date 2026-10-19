import { render, screen } from '@testing-library/react';
import { Wallet } from 'lucide-react';
import { cloneElement, isValidElement, type ReactNode } from 'react';

import {
  BarChartCard,
  DistributionBar,
  DonutChart,
  KpiStrip,
  Sparkline,
  StatCard,
  type KpiItem,
} from '@/shared/components/charts';

// jsdom no mide layout: el ResponsiveContainer recibe un tamaño fijo.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  const FIXED = { width: 400, height: 240 };
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { readonly children: ReactNode }) =>
      isValidElement<typeof FIXED>(children) ? cloneElement(children, FIXED) : null,
  };
});

const KPIS: readonly KpiItem[] = [
  { id: 'in', label: 'Ingresos del mes', value: '$ 1.040.200', delta: { direction: 'up', value: '12 %', comparison: 'vs. agosto', tone: 'positive' }, sparkline: [1, 3, 2, 5] },
  { id: 'out', label: 'Egresos del mes', value: '$ 727.800', delta: { direction: 'up', value: '4 %', tone: 'neutral' } },
  { id: 'debt', label: 'Deuda total', value: '$ 96.000', delta: { direction: 'down', value: '8 %', tone: 'positive' } },
];

describe('<KpiStrip>', () => {
  it('una sola lista de métricas con label + valor', () => {
    render(<KpiStrip items={KPIS} ariaLabel="Resumen del mes" />);
    const strip = screen.getByLabelText('Resumen del mes');
    expect(strip.tagName).toBe('DL');
    expect(strip).toHaveClass('md:grid-cols-3', 'gap-px', 'bg-border');
    expect(screen.getByText('Ingresos del mes')).toBeInTheDocument();
    expect(screen.getByText('$ 727.800')).toBeInTheDocument();
  });

  it('el color del delta sigue al significado y la dirección también va en texto', () => {
    render(<KpiStrip items={KPIS} />);
    const positive = screen.getByText('12 %').closest('p');
    expect(positive).toHaveClass('text-money-in');
    expect(positive).toHaveTextContent('Sube');
    expect(positive).toHaveTextContent('vs. agosto');
    expect(screen.getByText('4 %').closest('p')).toHaveClass('text-ink-muted');
    expect(screen.getByText('8 %').closest('p')).toHaveTextContent('Baja');
  });

  it('dibuja la sparkline 96×32 decorativa', () => {
    const { container } = render(<KpiStrip items={KPIS} />);
    const svg = container.querySelector('svg[width="96"][height="32"]');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('navegación en métricas', () => {
  it('KpiStrip: una métrica con href es un link con el nombre de la métrica; sin href no lo es', () => {
    render(
      <KpiStrip
        items={[
          { id: 'a', label: 'Deuda a cobrar', value: '1', href: '/reportes/deudas' },
          { id: 'b', label: 'Otra', value: '2' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Deuda a cobrar' })).toHaveAttribute('href', '/reportes/deudas');
    expect(screen.queryByRole('link', { name: 'Otra' })).not.toBeInTheDocument();
  });

  it('DistributionBar: los tramos con href hacen links en la leyenda (con monto en el nombre)', () => {
    render(
      <DistributionBar
        format={String}
        segments={[
          { label: 'Caja de Grupo', value: 10, href: '/cajas?tab=grupo' },
          { label: 'Fondos de Rama', value: 5, href: '/cajas?tab=rama' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: /Caja de Grupo/ })).toHaveAttribute('href', '/cajas?tab=grupo');
    expect(screen.getByRole('link', { name: /Fondos de Rama/ })).toHaveAttribute('href', '/cajas?tab=rama');
  });

  it('DistributionBar sin href mantiene la leyenda como texto', () => {
    render(<DistributionBar segments={[{ label: 'A', value: 1 }]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('<KpiStrip> footer', () => {
  it('renderiza el contenido extra de la celda (p. ej. barra apilada)', () => {
    render(
      <KpiStrip
        items={[{ id: 'a', label: 'Inscripciones', value: '112', footer: <p>de 148 al día</p> }]}
      />,
    );
    expect(screen.getByText('de 148 al día')).toBeInTheDocument();
  });
});

describe('gráficos accesibles (role="img" + conclusión)', () => {
  it('BarChartCard', () => {
    render(
      <BarChartCard
        title="Ingresos y egresos"
        ariaLabel="Septiembre fue el mes con más ingresos"
        data={[{ label: 'ago', values: { in: 10, out: 5 } }, { label: 'sep', values: { in: 20, out: 7 } }]}
        series={[{ key: 'in', label: 'Ingresos' }, { key: 'out', label: 'Egresos' }]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Ingresos y egresos' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Septiembre fue el mes con más ingresos' })).toBeInTheDocument();
    expect(screen.getByText('Egresos')).toBeInTheDocument();
  });

  it('DonutChart con total y leyenda con montos', () => {
    render(<DonutChart ariaLabel="La comida fue el mayor gasto" data={[{ label: 'Comida', value: 3000 }, { label: 'Transporte', value: 1000 }]} />);
    expect(screen.getByRole('img', { name: 'La comida fue el mayor gasto' })).toHaveTextContent('$ 4.000');
    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('$ 1.000')).toBeInTheDocument();
  });

  it('DistributionBar describe las partes por defecto', () => {
    render(<DistributionBar segments={[{ label: 'Grupo', value: 500 }, { label: 'Manada', value: 0 }]} />);
    expect(screen.getByRole('img', { name: /Grupo \$\s500, Manada \$\s0/u })).toBeInTheDocument();
  });

  it('Sparkline con aria-label es una imagen; con <2 puntos no se dibuja', () => {
    const { container, rerender } = render(<Sparkline values={[1, 2, 3]} ariaLabel="Tendencia en alza" />);
    expect(screen.getByRole('img', { name: 'Tendencia en alza' })).toBeInTheDocument();
    rerender(<Sparkline values={[1]} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('<StatCard>', () => {
  it('formatea número o moneda', () => {
    const { rerender } = render(<StatCard icon={Wallet} title="Personas" value={1234} />);
    expect(screen.getByText('1.234')).toBeInTheDocument();
    rerender(<StatCard icon={Wallet} title="Saldo" value={1234} format="currency" variant="success" />);
    expect(screen.getByText('$ 1.234')).toBeInTheDocument();
  });
});
