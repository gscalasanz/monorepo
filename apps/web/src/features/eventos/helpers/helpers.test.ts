import {
  DESTINO_GANANCIA,
  ESTADO_COBRO_VENTA,
  MODALIDAD_VENTA,
  TIPO_EVENTO,
  eventoSchema,
  personaSchema,
  productoSchema,
  type Entrega,
  type StockEntrega,
} from '@/shared/domain';
import {
  AGRUPACION_FIXTURE,
  EVENTO_FIXTURE,
  PRODUCTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
  VENTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { asInstant } from '@/shared/time';
import {
  aggregateProductoKpis,
  buildVendedorRows,
  canSubmitEntrega,
  entregaItems,
  productosDisponibles,
  vendedorOptions,
} from '@/features/eventos/helpers/entregas';
import {
  gananciaUnitaria,
  kpiConfigsFor,
  productosSinCosto,
  puedeHabilitarMovimientos,
  resolveTab,
  tabsFor,
} from '@/features/eventos/helpers/evento-detail';
import {
  eventoFormSchema,
  draftFromEvento,
  toEventoDto,
  INITIAL_EVENTO_DRAFT,
} from '@/features/eventos/helpers/evento-form';
import {
  eventoStats,
  filterEventos,
} from '@/features/eventos/helpers/evento-list';
import {
  productoFormSchema,
  toCreateProductoDto,
  toUpdateProductoDto,
} from '@/features/eventos/helpers/producto-form';
import { groupVentasByLote } from '@/features/eventos/helpers/venta-groups';
import {
  INITIAL_VENTAS_LOTE_DRAFT,
  buildVentasLoteDto,
  destinoEfectivo,
  isAgrupacionConDestinoPersonal,
  totalGeneral,
  vendedoresDisponibles,
} from '@/features/eventos/helpers/ventas-lote';
import { ventaListadoSchema } from '@/features/eventos/models/eventos';

const evento = eventoSchema.parse(EVENTO_FIXTURE);
const grupo = {
  ...evento,
  id: 'evt-2',
  nombre: 'Kermesse',
  tipo: TIPO_EVENTO.GRUPO,
};
const producto = productoSchema.parse({
  ...PRODUCTO_FIXTURE,
  precioCosto: '200.00',
});
const protagonista = personaSchema.parse(PROTAGONISTA_FIXTURE);
const agrupacion = personaSchema.parse(AGRUPACION_FIXTURE);

function venta(overrides: Record<string, unknown> = {}) {
  return ventaListadoSchema.parse({
    ...VENTA_FIXTURE,
    cantidad: 2,
    producto: { ...PRODUCTO_FIXTURE, precioCosto: '200.00' },
    vendedor: { id: 'per-1', nombre: 'Juan' },
    ...overrides,
  });
}

const stockRow = (overrides: Partial<StockEntrega>): StockEntrega => ({
  productoId: 'p1',
  productoNombre: 'Locro',
  vendedorId: 'v1',
  vendedorNombre: 'Zoe',
  cantidadVendida: 10,
  cantidadEntregada: 3,
  cantidadDisponible: 7,
  ...overrides,
});

describe('lista de eventos', () => {
  it('filtra por tipo y por nombre (sin mayúsculas)', () => {
    const eventos = [evento, grupo];
    expect(
      filterEventos({ eventos, values: { tipo: 'grupo' } }).map((e) => e.id),
    ).toEqual(['evt-2']);
    expect(
      filterEventos({ eventos, values: { busqueda: 'PASTEL' } }).map(
        (e) => e.id,
      ),
    ).toEqual(['evt-1']);
    expect(filterEventos({ eventos, values: {} })).toHaveLength(2);
  });

  it('stats sobre la lista completa', () => {
    expect(eventoStats([evento, grupo, grupo])).toEqual({
      total: 3,
      venta: 1,
      grupo: 2,
    });
  });
});

describe('detalle de evento', () => {
  it('tabs por tipo y tab inicial (grupo arranca en movimientos)', () => {
    expect(tabsFor(TIPO_EVENTO.VENTA).map((t) => t.value)).toEqual([
      'productos',
      'ventas',
      'entregas',
      'movimientos',
    ]);
    expect(resolveTab({ tipo: TIPO_EVENTO.VENTA, requested: 'ventas' })).toBe(
      'ventas',
    );
    expect(resolveTab({ tipo: TIPO_EVENTO.VENTA, requested: null })).toBe(
      'productos',
    );
    expect(resolveTab({ tipo: TIPO_EVENTO.GRUPO, requested: 'ventas' })).toBe(
      'movimientos',
    );
  });

  it('KPI de costo recuperado solo en venta con destino cuentas personales', () => {
    expect(kpiConfigsFor(evento).map((k) => k.id)).toContain('totalRecuperado');
    expect(
      kpiConfigsFor({
        ...evento,
        destinoGanancia: DESTINO_GANANCIA.CAJA_GRUPO,
      }),
    ).toHaveLength(5);
    expect(kpiConfigsFor(grupo)).toHaveLength(5);
  });

  it('habilitar movimientos: venta abierta sin habilitar; productos sin costo; ganancia unitaria', () => {
    expect(puedeHabilitarMovimientos(evento)).toBe(false);
    expect(
      puedeHabilitarMovimientos({ ...evento, movimientosHabilitados: false }),
    ).toBe(true);
    expect(
      puedeHabilitarMovimientos({
        ...evento,
        movimientosHabilitados: false,
        estaCerrado: true,
      }),
    ).toBe(false);
    const sinCosto = productoSchema.parse(PRODUCTO_FIXTURE);
    expect(productosSinCosto([producto, sinCosto])).toEqual([sinCosto]);
    expect(gananciaUnitaria(producto)).toBe(1000);
    expect(gananciaUnitaria(sinCosto)).toBeNull();
  });
});

describe('ventas agrupadas por lote', () => {
  it('agrupa por movimientoId con ganancia (no recaudación) y "a cobrar" si alguna está pendiente', () => {
    const groups = groupVentasByLote([
      venta({ id: 'a' }),
      venta({ id: 'b', estadoCobro: ESTADO_COBRO_VENTA.PENDIENTE }),
      venta({ id: 'c', movimientoId: null, vendedor: null }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      primaryVentaId: 'a',
      totalUnidades: 4,
      gananciaTotal: 4000,
      isSingleton: false,
      aCobrar: true,
    });
    expect(groups[1]).toMatchObject({
      key: 'solo:c',
      vendedorNombre: 'Sin vendedor',
      isSingleton: true,
    });
  });
});

describe('entregas', () => {
  const stock = [
    stockRow({}),
    stockRow({
      vendedorId: 'v2',
      vendedorNombre: 'Ana',
      cantidadEntregada: 10,
      cantidadDisponible: 0,
    }),
    stockRow({
      productoId: 'p2',
      productoNombre: 'Empanadas',
      cantidadVendida: 2,
      cantidadEntregada: 0,
      cantidadDisponible: 2,
    }),
  ];
  const entrega = (id: string, createdAt: string): Entrega => ({
    id,
    eventoId: 'e',
    vendedorId: 'v1',
    vendedorNombre: 'Zoe',
    fecha: null,
    notas: null,
    createdAt: asInstant(createdAt),
    lineas: [],
  });

  it('KPIs por producto suman todos los vendedores', () => {
    expect(aggregateProductoKpis(stock)).toEqual([
      {
        productoId: 'p2',
        productoNombre: 'Empanadas',
        cantidadVendida: 2,
        cantidadEntregada: 0,
      },
      {
        productoId: 'p1',
        productoNombre: 'Locro',
        cantidadVendida: 20,
        cantidadEntregada: 13,
      },
    ]);
  });

  it('filas por vendedor ordenadas, historial reciente primero y stock pendiente', () => {
    const rows = buildVendedorRows({
      stock,
      entregas: [
        entrega('old', '2026-01-01T10:00:00.000Z'),
        entrega('new', '2026-01-02T10:00:00.000Z'),
      ],
    });
    expect(rows.map((r) => r.vendedorNombre)).toEqual(['Ana', 'Zoe']);
    expect(rows[0]?.tieneStockDisponible).toBe(false);
    expect(rows[1]?.entregas.map((e) => e.id)).toEqual(['new', 'old']);
    expect(vendedorOptions(stock).map((o) => o.label)).toEqual(['Ana', 'Zoe']);
  });

  it('productos disponibles, validación de cantidades e items', () => {
    const productos = productosDisponibles({ stock, vendedorId: 'v1' });
    expect(productos.map((p) => p.productoId)).toEqual(['p2', 'p1']);
    expect(productosDisponibles({ stock, vendedorId: null })).toEqual([]);
    expect(canSubmitEntrega({ productos, cantidades: {} })).toBe(false);
    expect(canSubmitEntrega({ productos, cantidades: { p1: 8 } })).toBe(false);
    expect(canSubmitEntrega({ productos, cantidades: { p1: 7 } })).toBe(true);
    expect(entregaItems({ productos, cantidades: { p1: 7, p2: 0 } })).toEqual([
      { productoId: 'p1', cantidad: 7 },
    ]);
  });
});

describe('form de evento', () => {
  const valid = {
    ...INITIAL_EVENTO_DRAFT,
    nombre: 'Venta',
    tipo: TIPO_EVENTO.VENTA,
    fecha: '2026-05-25',
  };

  it('valida nombre, tipo y fecha con el copy de Angular', () => {
    const result = eventoFormSchema.safeParse({
      ...INITIAL_EVENTO_DRAFT,
      nombre: 'ab',
    });
    expect(result.success).toBe(false);
    const messages = result.success
      ? []
      : result.error.issues.map((i) => i.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'El nombre es requerido (mínimo 3 caracteres)',
        'El tipo es requerido',
        'La fecha es requerida',
      ]),
    );
  });

  it('venta: manda destino y modalidad; mixta fuerza caja_grupo', () => {
    const mixta = eventoFormSchema.parse({
      ...valid,
      modalidadVenta: MODALIDAD_VENTA.MIXTA,
      destinoGanancia: DESTINO_GANANCIA.CUENTAS_PERSONALES,
      tipoEvento: 'ignorado',
    });
    expect(toEventoDto(mixta)).toEqual({
      nombre: 'Venta',
      tipo: 'venta',
      fecha: '2026-05-25',
      destinoGanancia: 'caja_grupo',
      modalidadVenta: 'mixta',
    });
  });

  it('grupo: solo tipoEvento; vacíos se omiten', () => {
    const values = eventoFormSchema.parse({
      ...valid,
      tipo: TIPO_EVENTO.GRUPO,
      tipoEvento: ' Salida ',
      descripcion: ' ',
    });
    expect(toEventoDto(values)).toEqual({
      nombre: 'Venta',
      tipo: 'grupo',
      fecha: '2026-05-25',
      tipoEvento: 'Salida',
    });
  });

  it('draft desde un evento existente', () => {
    expect(draftFromEvento(evento)).toMatchObject({
      nombre: evento.nombre,
      destinoGanancia: 'cuentas_personales',
    });
  });
});

describe('form de producto', () => {
  it('requeridos y positivos', () => {
    const result = productoFormSchema.safeParse({
      nombre: 'a',
      precioCosto: -1,
      precioVenta: null,
    });
    const messages = result.success
      ? []
      : result.error.issues.map((i) => i.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'Mínimo 2 caracteres',
        'Debe ser un número positivo',
        'El precio de venta es requerido',
      ]),
    );
    expect(
      productoFormSchema.safeParse({
        nombre: 'Locro',
        precioCosto: null,
        precioVenta: 100,
      }).success,
    ).toBe(true);
  });

  it('DTOs: costo opcional; precios congelados → solo nombre', () => {
    const draft = { nombre: ' Locro ', precioCosto: null, precioVenta: 100 };
    expect(toCreateProductoDto(draft)).toEqual({
      nombre: 'Locro',
      precioVenta: 100,
    });
    expect(
      toUpdateProductoDto({
        draft: { ...draft, precioCosto: 40 },
        preciosBloqueados: false,
      }),
    ).toEqual({
      nombre: 'Locro',
      precioVenta: 100,
      precioCosto: 40,
    });
    expect(toUpdateProductoDto({ draft, preciosBloqueados: true })).toEqual({
      nombre: 'Locro',
    });
  });
});

describe('ventas en lote', () => {
  const mixto = { ...evento, modalidadVenta: MODALIDAD_VENTA.MIXTA };

  it('destino efectivo y vendedores disponibles (sin agrupaciones con cuentas personales)', () => {
    expect(
      destinoEfectivo({ evento, destinoElegido: DESTINO_GANANCIA.CAJA_GRUPO }),
    ).toBe('cuentas_personales');
    expect(
      destinoEfectivo({
        evento: mixto,
        destinoElegido: DESTINO_GANANCIA.CAJA_GRUPO,
      }),
    ).toBe('caja_grupo');
    const personas = [protagonista, agrupacion];
    expect(
      vendedoresDisponibles({
        personas,
        destino: DESTINO_GANANCIA.CUENTAS_PERSONALES,
      }),
    ).toEqual([protagonista]);
    expect(
      vendedoresDisponibles({ personas, destino: DESTINO_GANANCIA.CAJA_GRUPO }),
    ).toHaveLength(2);
    expect(
      isAgrupacionConDestinoPersonal({
        vendedor: agrupacion,
        destino: DESTINO_GANANCIA.CUENTAS_PERSONALES,
      }),
    ).toBe(true);
    expect(
      isAgrupacionConDestinoPersonal({
        vendedor: agrupacion,
        destino: DESTINO_GANANCIA.CAJA_GRUPO,
      }),
    ).toBe(false);
  });

  it('DTO: solo cantidades > 0, estado de cobro y destino solo en mixta', () => {
    const draft = {
      ...INITIAL_VENTAS_LOTE_DRAFT,
      vendedorId: 'per-1',
      quedaACobrar: true,
      entregaInmediata: true,
      cantidades: { 'prod-1': 3, otro: 0 },
    };
    const productos = [{ id: 'prod-1' }, { id: 'otro' }];
    expect(buildVentasLoteDto({ draft, productos, mixto: false })).toEqual({
      vendedorId: 'per-1',
      medioPago: 'efectivo',
      items: [{ productoId: 'prod-1', cantidad: 3 }],
      entregaInmediata: true,
      estadoCobro: 'pendiente',
    });
    expect(
      buildVentasLoteDto({ draft, productos, mixto: true })?.destinoGanancia,
    ).toBe('caja_grupo');
    expect(
      buildVentasLoteDto({
        draft: { ...draft, cantidades: {} },
        productos,
        mixto: false,
      }),
    ).toBeNull();
    expect(
      buildVentasLoteDto({
        draft: { ...draft, vendedorId: null },
        productos,
        mixto: false,
      }),
    ).toBeNull();
  });

  it('total general a precio de venta', () => {
    expect(
      totalGeneral({ productos: [producto], cantidades: { 'prod-1': 2 } }),
    ).toBe(2400);
  });
});
