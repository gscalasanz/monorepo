'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId } from 'react';

import { SegmentedTabs } from '@/shared/components/data';
import type { Evento } from '@/shared/domain';
import { EntregasTab } from '@/features/eventos/components/entregas-tab';
import { MovimientosTab } from '@/features/eventos/components/movimientos-tab';
import { ProductosTab } from '@/features/eventos/components/productos-tab';
import { VentasTab } from '@/features/eventos/components/ventas-tab';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  EVENTO_TAB,
  TAB_QUERY_PARAM,
  type EventoTab,
} from '@/features/eventos/constants/eventos';
import { resolveTab, tabsFor } from '@/features/eventos/helpers/evento-detail';
import type { EventoDetailData } from '@/features/eventos/hooks/use-evento-detail';

interface TabsProps {
  readonly evento: Evento;
  readonly data: EventoDetailData;
}

/** Tab activo en la URL (`?tab=`): se puede volver directo a "ventas" tras el lote. */
function useActiveTab(evento: Evento) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = resolveTab({
    tipo: evento.tipo,
    requested: searchParams.get(TAB_QUERY_PARAM),
  });
  const select = (tab: EventoTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(TAB_QUERY_PARAM, tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return { active, select };
}

function TabContent({
  tab,
  evento,
  data,
}: TabsProps & { readonly tab: EventoTab }) {
  switch (tab) {
    case EVENTO_TAB.PRODUCTOS:
      return (
        <ProductosTab
          evento={evento}
          productos={data.productos.data ?? []}
          onChanged={data.productos.reload}
        />
      );
    case EVENTO_TAB.VENTAS:
      return (
        <VentasTab
          evento={evento}
          ventas={data.ventas.query.data}
          search={data.ventas.search}
          onSearch={data.ventas.setSearch}
          onChanged={data.refreshVentas}
        />
      );
    case EVENTO_TAB.ENTREGAS:
      return (
        <EntregasTab
          evento={evento}
          data={data.entregas.query.data}
          search={data.entregas.search}
          onSearch={data.entregas.setSearch}
          onChanged={data.entregas.query.reload}
        />
      );
    default:
      return (
        <MovimientosTab
          evento={evento}
          movimientos={data.movimientos.data}
          personas={data.personas.data ?? []}
          onChanged={data.refreshMovimientos}
        />
      );
  }
}

/** Tabs del detalle (venta: 4 · grupo: solo Movimientos). */
export function EventoTabs({ evento, data }: TabsProps) {
  const { active, select } = useActiveTab(evento);
  const baseId = useId();
  const panelId = (tab: EventoTab) => `${baseId}-${tab}`;
  return (
    <section className="flex flex-col gap-4">
      <SegmentedTabs<EventoTab>
        items={tabsFor(evento.tipo)}
        value={active}
        onValueChange={select}
        ariaLabel={EVENTOS_COPY.detail.tabsAria}
        getPanelId={panelId}
        className="self-start"
      />
      <div
        role="tabpanel"
        id={panelId(active)}
        tabIndex={0}
        className="focus-visible:outline-none"
      >
        <TabContent tab={active} evento={evento} data={data} />
      </div>
    </section>
  );
}
