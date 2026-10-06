import {
  DESTINO_GANANCIA_LABELS,
  ESTADO_COBRO_VENTA_LABELS,
  MODALIDAD_VENTA_LABELS,
  TIPO_EVENTO_LABELS,
  calculateEventProfit,
  calculateProfitBySeller,
  cobrarVentaResultSchema,
  deleteVentaResultSchema,
  entregaSchema,
  eventoDetalleSchema,
  eventoKpisSchema,
  eventoSchema,
  productosConVentasSchema,
  resumenVentasSchema,
  stockEntregaSchema,
  ventaSchema,
} from '@/shared/domain';
import {
  EVENTO_FIXTURE,
  PRODUCTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
  VENTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';

const TIMESTAMP = '2026-03-13T15:00:00.000Z';
const KPIS = {
  totalRecaudado: 1000,
  gananciaVentas: 400,
  totalRecuperado: 600,
  totalGastado: 200,
  totalPendienteReembolso: 50,
  balance: 800,
};

describe('labels de evento', () => {
  it('cubren todos los valores', () => {
    expect(TIPO_EVENTO_LABELS.venta).toBe('Evento de Venta');
    expect(DESTINO_GANANCIA_LABELS.caja_grupo).toBe('Caja de Grupo');
    expect(MODALIDAD_VENTA_LABELS.mixta).toBe('Mixta (destino por venta)');
    expect(ESTADO_COBRO_VENTA_LABELS.pendiente).toBe('A cobrar');
  });
});

describe('eventoSchema', () => {
  it('evento con productos: decimales string → number, precioCosto null', () => {
    const evento = eventoSchema.parse(EVENTO_FIXTURE);
    expect(evento.fecha).toBe('2026-05-25');
    expect(evento.productos?.[0]?.precioVenta).toBe(1200);
    expect(evento.productos?.[0]?.precioCosto).toBeNull();
  });

  it('detalle con resumenFinanciero (incluye totalRecuperado)', () => {
    const evento = eventoDetalleSchema.parse({ ...EVENTO_FIXTURE, resumenFinanciero: KPIS });
    expect(evento.resumenFinanciero.totalRecuperado).toBe(600);
  });

  it('kpis', () => {
    expect(eventoKpisSchema.parse(KPIS).balance).toBe(800);
  });
});

describe('productos y ventas', () => {
  it('productos con cantidadVendida', () => {
    const [producto] = productosConVentasSchema.parse([{ ...PRODUCTO_FIXTURE, cantidadVendida: 3 }]);
    expect(producto?.cantidadVendida).toBe(3);
  });

  it('venta con producto y vendedor', () => {
    const venta = ventaSchema.parse({
      ...VENTA_FIXTURE,
      producto: PRODUCTO_FIXTURE,
      vendedor: PROTAGONISTA_FIXTURE,
    });
    expect(venta.vendedor?.nombre).toBe('Juan');
    expect(venta.movimientoRecuperoId).toBeNull();
  });

  it('respuestas de borrar y cobrar venta', () => {
    expect(
      deleteVentaResultSchema.parse({ ventaId: 'v', movimientoIdEliminado: null, hermanasEliminadas: 2 })
        .hermanasEliminadas,
    ).toBe(2);
    expect(
      cobrarVentaResultSchema.parse({ ventaId: 'v', hermanasCobradas: 1, movimientosActualizados: ['m'] })
        .movimientosActualizados,
    ).toEqual(['m']);
  });

  it('resumen de ventas', () => {
    const resumen = resumenVentasSchema.parse({
      productos: [{ nombre: 'Pastelitos', precioCosto: 0, precioVenta: 1200, cantidadVendida: 1, ganancia: 1200 }],
      ventasPorVendedor: [
        {
          vendedorId: 'per-1',
          vendedorNombre: 'Juan',
          cantidadTotal: 1,
          gananciaTotal: 1200,
          desglose: [{ productoId: 'prod-1', nombreProducto: 'Pastelitos', cantidad: 1, ganancia: 1200 }],
        },
      ],
      gananciaTotal: 1200,
    });
    expect(resumen.ventasPorVendedor[0]?.desglose).toHaveLength(1);
  });
});

describe('entregas', () => {
  it('entrega y stock disponible', () => {
    const entrega = entregaSchema.parse({
      id: 'e',
      eventoId: 'evt-1',
      vendedorId: 'per-1',
      vendedorNombre: 'Juan',
      fecha: null,
      notas: null,
      createdAt: TIMESTAMP,
      lineas: [{ id: 'l', productoId: 'prod-1', productoNombre: 'Pastelitos', cantidad: 2 }],
    });
    expect(entrega.lineas[0]?.cantidad).toBe(2);
    expect(
      stockEntregaSchema.parse({
        productoId: 'prod-1',
        productoNombre: 'Pastelitos',
        vendedorId: 'per-1',
        vendedorNombre: 'Juan',
        cantidadVendida: 3,
        cantidadEntregada: 2,
        cantidadDisponible: 1,
      }).cantidadDisponible,
    ).toBe(1);
  });
});

describe('ganancia de ventas (port de SaldoCalculatorService)', () => {
  const productos = [
    { id: 'a', precioVenta: 100, precioCosto: 60 },
    { id: 'b', precioVenta: 50, precioCosto: null },
  ];
  const ventas = [
    { productoId: 'a', vendedorId: 'p1', cantidad: 2 },
    { productoId: 'b', vendedorId: 'p1', cantidad: 1 },
    { productoId: 'a', vendedorId: 'p2', cantidad: 1 },
    { productoId: 'x', vendedorId: 'p2', cantidad: 9 },
  ];

  it('ganancia total: (precioVenta − costo) × cantidad, costo null = 0, ignora productos ausentes', () => {
    expect(calculateEventProfit({ ventas, productos })).toBe(80 + 50 + 40);
  });

  it('ganancia por vendedor', () => {
    expect(calculateProfitBySeller({ ventas, productos })).toEqual(
      new Map([
        ['p1', 130],
        ['p2', 40],
      ]),
    );
  });
});
