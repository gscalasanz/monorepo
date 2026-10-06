import { Check, Minus } from 'lucide-react';

import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import { AUTH_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  AUTORIZACIONES,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';
import { authSummary } from '@/features/inscripciones/helpers/detail';
import { AuthStatus } from '@/features/inscripciones/components/detail/auth-status';

/** Autorizaciones de Scout Argentina: estado general + grilla de las 5. */
export function AutorizacionesCard({
  values,
}: {
  readonly values: Autorizaciones;
}) {
  return (
    <Panel title={C.SECTION_TITLE}>
      <div className="grid gap-4">
        <AuthStatus summary={authSummary(values)} />
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AUTORIZACIONES.map((item) => {
            const ok = values[item.key];
            const Icon = ok ? Check : Minus;
            return (
              <li
                key={item.key}
                className="flex items-center gap-2 rounded-md bg-recessed px-2.5 py-2 text-[13px] text-ink"
              >
                <Icon
                  aria-hidden
                  className={cn(
                    'size-4 shrink-0',
                    ok ? 'text-success' : 'text-ink-subtle',
                  )}
                />
                {item.short}
                <span className="sr-only">{`: ${ok ? C.PRESENTED : C.MISSING}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}
