import { ReporteGrupoStrategy } from './reporte-grupo.strategy';
import { REPORTE_VARIANTE } from '../reporte.constants';
import { Evento } from '../../entities/evento.entity';
import { EventosService } from '../../eventos.service';

describe('ReporteGrupoStrategy', () => {
  const kpis = {
    gananciaVentas: 10000,
    totalGastado: 3000,
    totalPendienteReembolso: 500,
  };

  function build() {
    const eventosService = {
      getKpisEvento: jest.fn().mockResolvedValue(kpis),
      findMovimientosByEvento: jest.fn().mockResolvedValue([]),
    } as unknown as EventosService;
    const strategy = new ReporteGrupoStrategy(eventosService);
    return { strategy, eventosService };
  }

  const evento = {
    id: 'ev1',
    nombre: 'Kermesse',
    fecha: '2026-12-31',
    estaCerrado: true,
  } as unknown as Evento;

  describe('clock (characterization)', () => {
    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
      jest.setSystemTime(new Date('2026-12-31T23:30:00-03:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('stamps generadoEn with the current instant in UTC ISO', async () => {
      const { strategy } = build();

      const r = await strategy.build(evento);

      expect(r.variante).toBe(REPORTE_VARIANTE.GRUPO);
      expect(r.generadoEn).toBe('2027-01-01T02:30:00.000Z');
    });
  });
});
