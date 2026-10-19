'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { useRequireSession, useSessionBootstrap } from '@/shared/auth';
import { LAYOUT_COPY } from '@/shared/layout/copy';

/**
 * Monta la sesión una vez (`useSessionBootstrap`) y aplica el guard
 * (`useRequireSession`): hasta que el guard permite, muestra un loader.
 */
export function SessionGate({ children }: { children: ReactNode }) {
  useSessionBootstrap();
  const { status } = useRequireSession();
  if (status !== 'allowed') {
    return (
      <div role="status" className="flex min-h-dvh items-center justify-center bg-canvas text-ink-muted">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="sr-only">{LAYOUT_COPY.CHECKING_SESSION}</span>
      </div>
    );
  }
  return <>{children}</>;
}
