import Link from 'next/link';

import { Panel } from '@/shared/components/ui/panel';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { QUICK_ACTIONS } from '@/features/dashboard/constants/dashboard';

/** Accesos directos a los flujos más usados. */
export function QuickActionsPanel() {
  return (
    <Panel title={C.QUICK_ACTIONS}>
      <ul className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex min-h-[72px] flex-col items-start justify-between gap-2 rounded-lg border border-border bg-surface p-3 text-sm font-medium text-ink transition-colors hover:border-border-strong hover:bg-recessed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Icon className="size-[18px] text-brand" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
