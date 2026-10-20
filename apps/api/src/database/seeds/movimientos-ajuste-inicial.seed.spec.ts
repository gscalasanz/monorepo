import { DataSource } from 'typeorm';

import { Caja } from '../../modules/cajas/entities/caja.entity';
import { seedMovimientosAjusteInicial } from './movimientos-ajuste-inicial.seed';

/**
 * Caracterización de la fecha del seed de ajuste inicial, con repositorios falsos (nunca
 * toca una base). Solo se verifica el instante con el que se crean los movimientos.
 */
describe('seedMovimientosAjusteInicial (fecha)', () => {
  it('crea los ajustes con fecha 13/03/2026 18:00 de BsAs (21:00 UTC)', async () => {
    const create = jest.fn((data: { fecha: Date }) => data);
    const movimientoRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create,
      save: jest.fn().mockResolvedValue(undefined),
    };
    const cajaRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 'caja' }),
    };
    const dataSource = {
      getRepository: (entity: unknown) =>
        entity === Caja ? cajaRepository : movimientoRepository,
    } as unknown as DataSource;
    jest.spyOn(console, 'log').mockImplementation(() => undefined);

    await seedMovimientosAjusteInicial(dataSource);

    expect(create).toHaveBeenCalled();
    for (const [data] of create.mock.calls) {
      expect(data.fecha.toISOString()).toBe('2026-03-13T21:00:00.000Z');
    }
  });
});
