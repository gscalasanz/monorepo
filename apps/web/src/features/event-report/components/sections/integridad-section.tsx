import {
  AlertTriangle,
  CheckCircle2,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react';

import { REPORTE_SEVERIDAD, type ReporteSeveridad } from '@/shared/domain';
import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReporteIntegridadFlag } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.integridad;

interface SeverityStyle {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly className: string;
}

/** Severidad con ícono + texto (nunca solo color). */
const SEVERITY: Readonly<Record<ReporteSeveridad, SeverityStyle>> = {
  [REPORTE_SEVERIDAD.ALTA]: {
    label: COPY.alta,
    icon: OctagonAlert,
    className: 'bg-danger-soft text-danger',
  },
  [REPORTE_SEVERIDAD.MEDIA]: {
    label: COPY.media,
    icon: AlertTriangle,
    className: 'bg-warning-soft text-warning',
  },
  [REPORTE_SEVERIDAD.OK]: {
    label: COPY.ok,
    icon: CheckCircle2,
    className: 'bg-success-soft text-success',
  },
};

function FlagItem({ flag }: { readonly flag: ReporteIntegridadFlag }) {
  const { label, icon: Icon, className } = SEVERITY[flag.severidad];
  return (
    <li className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <span
        className={cn(
          'inline-flex h-[22px] shrink-0 items-center gap-1 rounded-sm px-1.5 text-xs font-semibold',
          className,
        )}
      >
        <Icon aria-hidden className="size-3.5" />
        {label}
      </span>
      <span className="text-[13px] text-ink">{flag.mensaje}</span>
    </li>
  );
}

/** "Integridad de datos": alertas del backend por severidad. */
export function IntegridadSection({
  flags,
}: {
  readonly flags: readonly ReporteIntegridadFlag[];
}) {
  return (
    <Panel title={COPY.title}>
      <ul className="grid gap-3">
        {flags.map((flag, index) => (
          <FlagItem key={`${flag.severidad}-${index}`} flag={flag} />
        ))}
      </ul>
    </Panel>
  );
}
