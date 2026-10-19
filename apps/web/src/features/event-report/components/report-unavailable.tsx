import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

import { APP_ROUTES } from '@/shared/constants';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';

const COPY = EVENT_REPORT_COPY.unavailable;

/** Anónimo + reporte no público (404): candado + "Iniciar sesión". Sin toast global. */
export function ReportUnavailable() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <section
        aria-labelledby="report-unavailable-title"
        className="grid w-full max-w-[26rem] justify-items-center gap-2 rounded-xl border border-border bg-surface p-8 text-center shadow-xs sm:p-10"
      >
        <span
          aria-hidden
          className="mb-3 grid size-16 place-items-center rounded-full bg-recessed text-ink-subtle"
        >
          <Lock className="size-7" />
        </span>
        <h1
          id="report-unavailable-title"
          className="text-lg font-semibold text-ink"
        >
          {COPY.title}
        </h1>
        <p className="max-w-[22rem] text-sm leading-relaxed text-ink-muted">
          {COPY.hint}
        </p>
        <Link
          href={APP_ROUTES.LOGIN}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-recessed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <LogIn aria-hidden className="size-[18px]" />
          {COPY.login}
        </Link>
      </section>
    </div>
  );
}
