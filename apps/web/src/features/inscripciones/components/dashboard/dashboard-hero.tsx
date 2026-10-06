import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { ramaShares } from '@/features/inscripciones/helpers/consolidado';
import { RamaBarRow } from '@/features/inscripciones/components/dashboard/rama-bar-row';

/** "Total Inscripciones" + "Distribución por Rama" (barra por rama con %). */
export function DashboardHero({
  consolidado,
}: {
  readonly consolidado: InscripcionesConsolidado;
}) {
  const shares = ramaShares({
    porRama: consolidado.porRama,
    total: consolidado.total,
  });
  return (
    <section className="grid gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-6 md:p-[18px]">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-ink-muted">{C.TOTAL}</span>
        <span className="text-[32px] leading-10 font-semibold tracking-[-0.025em] text-ink tabular-nums">
          {consolidado.total}
        </span>
        <span className="text-sm text-ink-subtle">
          {consolidado.filtros.ano ?? C.ALL_YEARS}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink">{C.DISTRIBUTION}</h2>
        <ul className="grid gap-2.5">
          {shares.map((share) => (
            <RamaBarRow key={share.key} share={share} />
          ))}
        </ul>
      </div>
    </section>
  );
}
