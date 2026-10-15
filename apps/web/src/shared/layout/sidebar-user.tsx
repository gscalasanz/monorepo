'use client';

import { LogOut } from 'lucide-react';

import { logout, useSession } from '@/shared/auth';
import { PERSONA_TYPE_LABELS } from '@/shared/domain';
import { LAYOUT_COPY } from '@/shared/layout/copy';
import { SIDEBAR_ICON_BUTTON } from '@/shared/layout/sidebar-styles';
import { cn } from '@/shared/lib/utils';

const INITIALS_LENGTH = 2;

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_LENGTH)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** Usuario logueado + cerrar sesión (pie de la sidebar). */
export function SidebarUser({ collapsed }: { collapsed: boolean }) {
  const { user } = useSession();
  const name = user?.nombre ?? LAYOUT_COPY.DEFAULT_USER;
  return (
    <div className={cn('flex items-center gap-3 px-1', collapsed && 'flex-col')}>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-sidebar-ink/30 text-xs font-medium text-sidebar-ink"
      >
        {initialsOf(name)}
      </span>
      {!collapsed && (
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-sm font-medium text-sidebar-ink">{name}</span>
          <span className="truncate text-xs text-sidebar-ink/75">{user?.email ?? ''}</span>
          {user && (
            <span className="truncate text-xs text-sidebar-ink/75">
              {PERSONA_TYPE_LABELS[user.tipo]}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={logout}
        aria-label={LAYOUT_COPY.LOGOUT}
        title={LAYOUT_COPY.LOGOUT}
        className={cn('inline-flex size-11 shrink-0 items-center justify-center rounded-md md:size-9', SIDEBAR_ICON_BUTTON)}
      >
        <LogOut className="size-[18px]" aria-hidden />
      </button>
    </div>
  );
}
