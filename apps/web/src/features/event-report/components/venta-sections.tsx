import { DetalleVendedorSection } from '@/features/event-report/components/sections/detalle-vendedor-section';
import { GananciaSection } from '@/features/event-report/components/sections/ganancia-section';
import { HorariosSection } from '@/features/event-report/components/sections/horarios-section';
import { PorTipoSection } from '@/features/event-report/components/sections/por-tipo-section';
import { ProductosSection } from '@/features/event-report/components/sections/productos-section';
import { RamaSection } from '@/features/event-report/components/sections/rama-section';
import { RankingSection } from '@/features/event-report/components/sections/ranking-section';
import { StockSection } from '@/features/event-report/components/sections/stock-section';
import { hasGananciaPorPersona } from '@/features/event-report/helpers/derived';
import type { ReporteVenta } from '@/features/event-report/models/report';

/** Bloques de eventos de venta (+ ganancia por persona en cuentas personales / mixto). */
export function VentaSections({ reporte }: { readonly reporte: ReporteVenta }) {
  return (
    <>
      <ProductosSection productos={reporte.productos} />
      <PorTipoSection porTipo={reporte.porTipoPersona} />
      <RankingSection vendedores={reporte.vendedores} />
      <DetalleVendedorSection vendedores={reporte.vendedores} />
      <StockSection stock={reporte.stock} />
      <HorariosSection horarios={reporte.horariosEntrega} />
      <RamaSection porRama={reporte.porRama} />
      {hasGananciaPorPersona(reporte) ? (
        <GananciaSection ganancias={reporte.gananciaPorPersona} />
      ) : null}
    </>
  );
}
