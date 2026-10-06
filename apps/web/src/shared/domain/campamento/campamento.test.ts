import {
  ESTADO_PAGO_CAMPAMENTO,
  ESTADO_PAGO_CAMPAMENTO_LABELS,
  campamentoDetalleSchema,
  campamentoSchema,
  campamentosSchema,
  eliminarPagoCampamentoResultSchema,
  pagosPorParticipanteSchema,
  resultadoPagoCampamentoSchema,
  resumenFinancieroCampamentoSchema,
} from '@/shared/domain';
import {
  CAMPAMENTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';

const TIMESTAMP = '2026-03-13T15:00:00.000Z';

describe('enums de campamento', () => {
  it('exento tiene label', () => {
    expect(ESTADO_PAGO_CAMPAMENTO_LABELS[ESTADO_PAGO_CAMPAMENTO.EXENTO]).toBe(
      'Exento',
    );
  });
});

describe('campamentoSchema (entidad cruda)', () => {
  it('decimales string → number, fechas date → LocalDate', () => {
    const campamento = campamentoSchema.parse(CAMPAMENTO_FIXTURE);
    expect(campamento.costoPorPersona).toBe(45000);
    expect(campamento.fechaInicio).toBe('2026-01-15');
    expect(campamento.participantes).toBeUndefined();
  });

  it('POST devuelve fechas ISO de medianoche y números', () => {
    const campamento = campamentoSchema.parse({
      ...CAMPAMENTO_FIXTURE,
      fechaInicio: '2026-01-15T00:00:00.000Z',
      costoPorPersona: 45000,
    });
    expect(campamento.fechaInicio).toBe('2026-01-15');
    expect(campamento.costoPorPersona).toBe(45000);
  });

  it('lista con participantes y su persona', () => {
    const [campamento] = campamentosSchema.parse([
      {
        ...CAMPAMENTO_FIXTURE,
        participantes: [
          {
            id: 'cp-1',
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
            deletedAt: null,
            campamentoId: 'cam-1',
            personaId: 'per-1',
            autorizacionEntregada: false,
            montoAsignado: '45000.00',
            montoBonificado: '0.00',
            persona: PROTAGONISTA_FIXTURE,
          },
        ],
      },
    ]);
    expect(campamento?.participantes?.[0]?.montoAsignado).toBe(45000);
    expect(campamento?.participantes?.[0]?.persona?.nombre).toBe('Juan');
  });
});

describe('DTOs calculados de campamento', () => {
  it('detalle consolidado', () => {
    const detalle = campamentoDetalleSchema.parse({
      campamento: {
        id: 'cam-1',
        nombre: 'Verano',
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
          autorizacionEntregada: true,
          fechaInscripcion: TIMESTAMP,
          pagos: [
            {
              movimientoId: 'm',
              fecha: TIMESTAMP,
              monto: 15000,
              medioPago: 'efectivo',
              tipo: 'ingreso',
              concepto: 'campamento_pago',
            },
          ],
        },
      ],
      movimientos: [
        {
          id: 'm',
          fecha: TIMESTAMP,
          tipo: 'ingreso',
          concepto: 'campamento_pago',
          monto: 15000,
          descripcion: null,
          medioPago: 'efectivo',
          estadoPago: 'pagado',
          responsableId: 'per-1',
          responsableNombre: 'Juan',
        },
      ],
      kpis: {
        totalARecaudar: 45000,
        totalRecaudado: 15000,
        totalBonificado: 0,
        totalGastado: 0,
        totalPendienteReembolso: 0,
        balance: 15000,
        deudaTotal: 30000,
        cantidadParticipantes: 1,
        participantesPagadosCompleto: 0,
        participantesPagadosParcial: 1,
        participantesPendientes: 0,
        participantesExentos: 0,
      },
    });
    expect(detalle.participantes[0]?.estadoPago).toBe('parcial');
    expect(detalle.kpis.deudaTotal).toBe(30000);
  });

  it('resultado de pago, resumen financiero, pagos por participante y eliminación', () => {
    expect(
      resultadoPagoCampamentoSchema.parse({
        movimientoIngreso: {
          id: 'm',
          monto: 10,
          concepto: 'campamento_pago',
          medioPago: 'mixto',
        },
        desglose: { montoSaldoPersonal: 5, montoFisico: 5, total: 10 },
      }).movimientoEgresoPersonal,
    ).toBeUndefined();
    expect(
      resumenFinancieroCampamentoSchema.parse({
        totalEsperado: 1,
        totalRecaudado: 1,
        totalGastado: 0,
        totalPendienteReembolso: 0,
        saldo: 1,
        participantes: 1,
      }).saldo,
    ).toBe(1);
    expect(
      pagosPorParticipanteSchema.parse([
        {
          participanteId: 'p',
          participanteNombre: 'Juan',
          montoAsignado: 1,
          montoBonificado: 0,
          totalPagado: 1,
          saldoPendiente: 0,
          pagos: [{ fecha: TIMESTAMP, monto: 1, medioPago: 'efectivo' }],
        },
      ]),
    ).toHaveLength(1);
    expect(
      eliminarPagoCampamentoResultSchema.parse({
        movimientosEliminados: ['m'],
        montoRevertido: 10,
      }).montoRevertido,
    ).toBe(10);
  });
});
