import type { ReactNode } from 'react';

import { ThemeToggle } from '@/shared/layout';

/** Layout público (reporte de evento): sin AppShell ni guard de sesión. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <div className="mx-auto flex w-full max-w-6xl justify-end px-4 pt-3 md:px-8">
        <ThemeToggle className="text-ink-muted hover:bg-recessed hover:text-ink" />
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 pt-1 pb-10 md:px-8">
        {children}
      </main>
    </div>
  );
}
