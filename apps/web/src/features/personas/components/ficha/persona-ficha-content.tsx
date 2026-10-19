import { PERSONA_TYPE } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { DocumentacionPanel } from '@/features/personas/components/ficha/documentacion-panel';
import { ObligacionesPanel } from '@/features/personas/components/ficha/obligaciones-panel';
import { MovimientosPanel } from '@/features/personas/components/ficha/movimientos-panel';
import { PersonaIdentityCard } from '@/features/personas/components/ficha/persona-identity-card';
import { PersonaMoneySummary } from '@/features/personas/components/ficha/persona-money-summary';

export interface PersonaFichaContentProps {
  readonly dashboard: PersonaDashboard;
  readonly onTransfer: () => void;
}

/** Layout de la ficha: identidad · dinero · obligaciones + documentación · actividad. */
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
          docs && 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
        )}
      >
        <ObligacionesPanel
          inscripciones={dashboard.inscripciones}
          campamentos={dashboard.campamentos}
        />
        {docs ? (
          <DocumentacionPanel
            documentacion={docs}
            rama={persona.rama}
            editHref={PERSONA_ROUTES.edit({
              tipo: persona.tipo,
              id: persona.id,
            })}
          />
        ) : null}
      </div>
      <MovimientosPanel movimientos={dashboard.ultimosMovimientos} />
    </>
  );
}
