import { KpiStrip } from '@/shared/components/charts';
import { LOCALE } from '@/shared/constants';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import type { PersonasStats as Stats } from '@/features/personas/helpers/list';

const numberFormatter = new Intl.NumberFormat(LOCALE);

/** Tira de 4 métricas (Protagonistas · Educadores · Personas Extras · Total Activos). */
export function PersonasStats({ stats }: { readonly stats: Stats }) {
  const items = [
    {
      id: 'protagonistas',
      label: C.STAT_PROTAGONISTAS,
      value: stats.protagonistas,
    },
    { id: 'educadores', label: C.STAT_EDUCADORES, value: stats.educadores },
    { id: 'externas', label: C.STAT_EXTERNAS, value: stats.externas },
    { id: 'activos', label: C.STAT_ACTIVOS, value: stats.activos },
  ];
  return (
    <KpiStrip
      ariaLabel={C.STATS_LABEL}
      items={items.map((item) => ({
        ...item,
        value: numberFormatter.format(item.value),
      }))}
    />
  );
}
