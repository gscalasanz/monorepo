import Image from 'next/image';

import { LAYOUT_COPY, LOGO_SRC } from '@/shared/layout/copy';

const LOGO_SIZE_PX = 36;

/** Escudo + nombre del sistema (cabecera de la sidebar). */
export function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <Image
        src={LOGO_SRC}
        alt={LOGO_ALT_TEXT}
        width={LOGO_SIZE_PX}
        height={LOGO_SIZE_PX}
        className="size-9 shrink-0 rounded-md bg-surface object-contain p-0.5"
        priority
      />
      {!collapsed && (
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[15px] font-semibold text-sidebar-ink">
            {LAYOUT_COPY.APP_NAME}
          </span>
          <span className="truncate text-xs text-sidebar-ink/75">{LAYOUT_COPY.APP_SUBTITLE}</span>
        </div>
      )}
    </div>
  );
}

const LOGO_ALT_TEXT = LAYOUT_COPY.LOGO_ALT;
