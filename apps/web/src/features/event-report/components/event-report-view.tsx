'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { pathSegment } from '@/shared/api';
import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { APP_ROUTES } from '@/shared/constants';
import { ReportBody } from '@/features/event-report/components/report-body';
import { ReportUnavailable } from '@/features/event-report/components/report-unavailable';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { useEventReport, type EventReportState } from '@/features/event-report/hooks/use-event-report';

function BackToEvent({ eventoId }: { readonly eventoId: string }) {
  return (
    <Link
      href={`${APP_ROUTES.EVENTOS}/${pathSegment(eventoId)}`}
      className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:min-h-0"
    >
      <ArrowLeft aria-hidden className="size-4" />
      {EVENT_REPORT_COPY.backToEvent}
    </Link>
  );
}

function ReportState({ state, onRetry }: { readonly state: EventReportState; readonly onRetry: () => void }) {
  switch (state.status) {
    case 'loading':
      return <LoadingState label={EVENT_REPORT_COPY.loading} />;
    case 'unavailable':
      return <ReportUnavailable />;
    case 'error':
      return (
        <div className="rounded-xl border border-border bg-surface shadow-xs">
          <ErrorState message={EVENT_REPORT_COPY.loadError} onRetry={onRetry} />
        </div>
      );
    case 'ok':
      return <ReportBody reporte={state.reporte} />;
  }
}

/**
 * Reporte de evento (`/eventos/:id/reporte`), accesible sin login. Con sesión
 * usa el endpoint autenticado y ofrece volver al evento; anónimo, el público.
 */
export function EventReportView({ eventoId }: { readonly eventoId: string }) {
  const { state, withSession, reload } = useEventReport(eventoId);
  return (
    <div className="grid gap-3">
      {withSession ? <BackToEvent eventoId={eventoId} /> : null}
      <ReportState state={state} onRetry={() => void reload()} />
    </div>
  );
}
