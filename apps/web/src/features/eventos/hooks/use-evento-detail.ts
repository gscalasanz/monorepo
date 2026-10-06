'use client';

import { useCallback, useState } from 'react';

import type { Entrega, StockEntrega } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { fetchPersonasActivas } from '@/shared/queries';
import { useDebouncedValue } from '@/features/eventos/hooks/use-debounced-value';
import {
  fetchEvento,
  fetchEventoKpis,
  fetchEventoMovimientos,
} from '@/features/eventos/services/eventos-api';
import {
  fetchEntregas,
  fetchProductos,
  fetchStockEntregas,
  fetchVentas,
} from '@/features/eventos/services/ventas-api';

export interface EntregasData {
  readonly entregas: readonly Entrega[];
  readonly stock: readonly StockEntrega[];
}

/** Búsqueda por vendedor con debounce: la key de la consulta cambia al asentarse. */
function useVendedorSearch() {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search.trim());
  return { search, setSearch, debounced };
}

function useVentasQuery(id: string) {
  const search = useVendedorSearch();
  const query = useAsyncData({
    key: `evento:${id}:ventas:${search.debounced}`,
    load: (signal) =>
      fetchVentas({ eventoId: id, vendedor: search.debounced, signal }),
  });
  return { ...search, query };
}

function useEntregasQuery(id: string) {
  const search = useVendedorSearch();
  const query = useAsyncData<EntregasData>({
    key: `evento:${id}:entregas:${search.debounced}`,
    load: async (signal) => {
      const params = { eventoId: id, vendedor: search.debounced, signal };
      const [entregas, stock] = await Promise.all([
        fetchEntregas(params),
        fetchStockEntregas(params),
      ]);
      return { entregas, stock };
    },
  });
  return { ...search, query };
}

/** Lecturas sin búsqueda: evento, KPIs, productos, movimientos y personas activas. */
function useEventoQueries(id: string) {
  const evento = useAsyncData({
    key: `evento:${id}`,
    load: (signal) => fetchEvento(id, signal),
  });
  const kpis = useAsyncData({
    key: `evento:${id}:kpis`,
    load: (signal) => fetchEventoKpis(id, signal),
  });
  const productos = useAsyncData({
    key: `evento:${id}:productos`,
    load: (signal) => fetchProductos(id, signal),
  });
  const movimientos = useAsyncData({
    key: `evento:${id}:movimientos`,
    load: (signal) => fetchEventoMovimientos(id, signal),
  });
  const personas = useAsyncData({
    key: 'personas:activas',
    load: fetchPersonasActivas,
  });
  return { evento, kpis, productos, movimientos, personas };
}

/**
 * Datos del detalle (todo en paralelo, como Angular): evento, KPIs, productos,
 * ventas, movimientos, entregas + stock y personas activas para los selectores.
 */
export function useEventoDetail(id: string) {
  const { evento, kpis, productos, movimientos, personas } =
    useEventoQueries(id);
  const ventas = useVentasQuery(id);
  const entregas = useEntregasQuery(id);

  const reloadKpis = kpis.reload;
  const reloadMovimientos = movimientos.reload;
  const reloadVentas = ventas.query.reload;
  const reloadProductos = productos.reload;
  const reloadEntregas = entregas.query.reload;

  /** Tras un cambio de ventas: el lote puede arrastrar hermanas, movimientos y saldos. */
  const refreshVentas = useCallback(async (): Promise<void> => {
    await Promise.all([
      reloadVentas(),
      reloadMovimientos(),
      reloadKpis(),
      reloadProductos(),
      reloadEntregas(),
    ]);
  }, [
    reloadVentas,
    reloadMovimientos,
    reloadKpis,
    reloadProductos,
    reloadEntregas,
  ]);

  /** Tras ingresos/gastos/reembolsos: movimientos + KPIs. */
  const refreshMovimientos = useCallback(async (): Promise<void> => {
    await Promise.all([reloadMovimientos(), reloadKpis()]);
  }, [reloadMovimientos, reloadKpis]);

  return {
    evento,
    kpis,
    productos,
    movimientos,
    personas,
    ventas,
    entregas,
    refreshVentas,
    refreshMovimientos,
  };
}

export type EventoDetailData = ReturnType<typeof useEventoDetail>;
