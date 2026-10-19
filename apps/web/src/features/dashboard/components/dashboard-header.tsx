'use client';

import { useMemo } from 'react';

import { ActionsMenu } from '@/shared/components/data';
import { useSession } from '@/shared/auth';
import { PageHeader } from '@/shared/layout';
import { DATE_FORMATS, formatDate, formatInBsAs, nowInstant, todayBsAs } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { QUICK_ACTIONS } from '@/features/dashboard/constants/dashboard';
import { firstNameOf, greetingFor } from '@/features/dashboard/helpers/greeting';

const HOUR_PATTERN = 'H';
const MENU_ITEMS = QUICK_ACTIONS.map((action) => ({ ...action, key: action.href }));

function useTitle(): string {
  const { user } = useSession();
  const greeting = useMemo(() => greetingFor(Number(formatInBsAs(nowInstant(), HOUR_PATTERN))), []);
  const name = firstNameOf(user?.nombre);
  return name ? `${greeting}, ${name}` : greeting;
}

/** "Buen día, {nombre}" + estado de las cajas; un único menú "Acciones" con "Nuevo movimiento" primero. */
export function DashboardHeader({ lastMovimientoAt }: { readonly lastMovimientoAt: string | undefined }) {
  const title = useTitle();
  const status = C.STATUS_AT(formatDate(todayBsAs(), DATE_FORMATS.dateLong));
  const last = lastMovimientoAt ? ` ${C.LAST_MOVIMIENTO(formatDate(lastMovimientoAt))}` : '';
  return (
    <PageHeader
      title={title}
      subtitle={`${status}${last}`}
      actions={<ActionsMenu variant="primary" label={C.QUICK_ACTIONS} items={MENU_ITEMS} className="flex-1 justify-center md:flex-none" />}
    />
  );
}
