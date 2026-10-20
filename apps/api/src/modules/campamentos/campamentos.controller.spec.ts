import { CampamentosController } from './campamentos.controller';
import { CampamentosService } from './campamentos.service';
import { EstadoPago, MedioPago } from '../../common/enums';

/**
 * Caracterización del parseo de `fecha` en POST /campamentos/:id/gastos: el body trae un
 * string y el controller lo convierte a Date antes de llamar al service.
 */
describe('CampamentosController.registrarGasto (fecha)', () => {
  const registrarGasto = jest
    .fn<Promise<object>, unknown[]>()
    .mockResolvedValue({});
  const controller = new CampamentosController({
    registrarGasto,
  } as unknown as CampamentosService);

  const llamarCon = (fecha?: string) =>
    controller.registrarGasto(
      'camp-uuid',
      5000,
      'Compra de alimentos',
      'resp-uuid',
      MedioPago.EFECTIVO,
      EstadoPago.PAGADO,
      'user-uuid',
      undefined,
      fecha,
    );
  /** Posición del argumento `fecha` en CampamentosService.registrarGasto. */
  const FECHA_ARG = 7;
  const fechaEnviada = (): unknown => registrarGasto.mock.calls[0]?.[FECHA_ARG];

  beforeEach(() => {
    registrarGasto.mockClear();
  });

  it('YYYY-MM-DD (lo que manda web: todayBsAs) llega como medianoche UTC', async () => {
    await llamarCon('2026-10-20');
    expect(fechaEnviada()).toEqual(new Date('2026-10-20T00:00:00.000Z'));
  });

  it('un ISO con offset llega como su instante UTC', async () => {
    await llamarCon('2026-12-31T23:30:00-03:00');
    expect(fechaEnviada()).toEqual(new Date('2027-01-01T02:30:00.000Z'));
  });

  it('sin fecha llega undefined (el service usa la fecha actual)', async () => {
    await llamarCon();
    expect(fechaEnviada()).toBeUndefined();
  });
});
