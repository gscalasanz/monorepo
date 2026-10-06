import type { ReactNode } from 'react';

import { AppShell, SessionGate } from '@/shared/layout';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <AppShell>{children}</AppShell>
    </SessionGate>
  );
}
