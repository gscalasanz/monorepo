import { PERSONA_TYPE } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { CampamentosPanel } from '@/features/personas/components/ficha/campamentos-panel';
import { DocumentacionPanel } from '@/features/personas/components/ficha/documentacion-panel';
import { InscripcionesPanel } from '@/features/personas/components/ficha/inscripciones-panel';
import { MovimientosPanel } from '@/features/personas/components/ficha/movimientos-panel';
import { PersonaIdentityCard } from '@/features/personas/components/ficha/persona-identity-card';
import { PersonaMoneySummary } from '@/features/personas/components/ficha/persona-money-summary';

export interface PersonaFichaContentProps {
  readonly dashboard: PersonaDashboard;
  readonly onTransfer: () => void;
}

/** Layout de la ficha: identidad · dinero · obligaciones + documentación · movimientos. */
export function PersonaFichaContent({
  dashboard,
  onTransfer,
}: PersonaFichaContentProps) {
  const { persona, documentacionPersonal } = dashboard;
  const docs =
    persona.tipo === PERSONA_TYPE.PROTAGONISTA ? documentacionPersonal : null;
  return (
    <>
      <PersonaIdentityCard
        persona={persona}
        canTransfer={dashboard.cuentaPersonal.saldo > 0}
        onTransfer={onTransfer}
      />
      <PersonaMoneySummary dashboard={dashboard} />
      <div
        className={cn(
          'grid items-start gap-4 md:gap-6',
          docs
            ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
            : 'lg:grid-cols-2',
        )}
      >
        <div
          className={cn(
            'grid min-w-0 gap-4 md:gap-6',
            !docs && 'lg:col-span-2 lg:grid-cols-2',
          )}
        >
          <InscripcionesPanel inscripciones={dashboard.inscripciones} />
          <CampamentosPanel campamentos={dashboard.campamentos} />
        </div>
        {docs ? (
          <DocumentacionPanel documentacion={docs} rama={persona.rama} />
        ) : null}
      </div>
      <MovimientosPanel movimientos={dashboard.ultimosMovimientos} />
    </>
  );
}
