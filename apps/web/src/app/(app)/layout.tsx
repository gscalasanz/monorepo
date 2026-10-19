import { Suspense, type ReactNode } from 'react';

import { AppShell, SessionGate } from '@/shared/layout';
import { NavigationTracker } from '@/shared/navigation';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <Suspense fallback={null}>
        <NavigationTracker />
      </Suspense>
      <AppShell>{children}</AppShell>
    </SessionGate>
  );
}
