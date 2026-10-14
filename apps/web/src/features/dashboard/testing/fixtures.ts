/** Fixtures del dashboard (solo tests). */
import { consolidadoSaldosSchema, type ConsolidadoSaldos } from '@/shared/domain';

export const CONSOLIDADO: ConsolidadoSaldos = consolidadoSaldosSchema.parse({
  fecha: '2026-10-06T12:00:00.000Z',
  resumen: { totalGeneral: 1420, totalDisponible: 1330, totalPorCobrar: 900 },
  cajaGrupo: { id: 'g', saldo: 1000 },
  fondosRama: {
    total: 300,
    detalle: [
      { tipo: 'rama_unidad', id: 'u', nombre: 'Unidad', saldo: 200 },
      { tipo: 'rama_manada', id: 'm', nombre: 'Manada', saldo: 100 },
    ],
  },
  cuentasPersonales: { total: 50, cantidad: 2 },
  fondoSolidario: { id: 'fs', saldo: 70, bonificacionesOtorgadas: 0 },
  reembolsosPendientes: { total: 20, cantidad: 1 },
  cobrosPendientes: { total: 30, cantidad: 1 },
  deudasTotales: {
    total: 900,
    inscripciones: { total: 400, cantidad: 4 },
    campamentos: { total: 500, cantidad: 5 },
  },
});
