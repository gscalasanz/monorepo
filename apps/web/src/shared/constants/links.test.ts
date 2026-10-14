import { CAJAS_TAB, cajasHref, movimientoEditHref, movimientosHref, personaHref } from '@/shared/constants';

describe('cajasHref', () => {
  it('sin tab va a /cajas', () => {
    expect(cajasHref()).toBe('/cajas');
  });

  it('con tab agrega el query param que lee la pantalla', () => {
    expect(cajasHref(CAJAS_TAB.RAMA)).toBe('/cajas?tab=rama');
    expect(cajasHref(CAJAS_TAB.FONDO_SOLIDARIO)).toBe('/cajas?tab=fondo-solidario');
  });
});

describe('movimientosHref', () => {
  it('sin filtros va al listado', () => {
    expect(movimientosHref({})).toBe('/movimientos');
  });

  it('serializa solo los filtros presentes, con los nombres que lee la lista', () => {
    expect(movimientosHref({ tipo: 'egreso', estadoPago: 'pendiente_reembolso' })).toBe(
      '/movimientos?tipo=egreso&estadoPago=pendiente_reembolso',
    );
  });

  it('rango de fechas', () => {
    expect(movimientosHref({ tipo: 'ingreso', fechaInicio: '2026-10-01', fechaFin: '2026-10-31' })).toBe(
      '/movimientos?tipo=ingreso&fechaInicio=2026-10-01&fechaFin=2026-10-31',
    );
  });
});

describe('personaHref', () => {
  it('cada tipo de persona tiene su ficha', () => {
    expect(personaHref({ tipo: 'protagonista', id: 'p1' })).toBe('/personas/protagonistas/p1');
    expect(personaHref({ tipo: 'educador', id: 'e1' })).toBe('/personas/educadores/e1');
    expect(personaHref({ tipo: 'externo', id: 'x1' })).toBe('/personas/personas-externas/x1');
  });

  it('una agrupación no tiene ficha: va al listado', () => {
    expect(personaHref({ tipo: 'agrupacion', id: 'a1' })).toBe('/personas');
  });

  it('escapa el id', () => {
    expect(personaHref({ tipo: 'protagonista', id: 'a b' })).toBe('/personas/protagonistas/a%20b');
  });
});

describe('movimientoEditHref', () => {
  it('lleva al formulario de edición del movimiento', () => {
    expect(movimientoEditHref('m-1')).toBe('/movimientos/m-1/editar');
  });
});
