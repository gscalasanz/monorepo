'use client';

import { Download, Loader2, type LucideIcon } from 'lucide-react';

import { CONFIG_COPY as C } from '@/features/configuracion/constants/copy';

interface DownloadActionProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle: string;
  readonly downloading: boolean;
  readonly onClick: () => void;
}

/** Fila de descarga (ícono · título + subtítulo · ⤓): descarga al tocar. */
export function DownloadAction({
  icon: Icon,
  title,
  subtitle,
  downloading,
  onClick,
}: DownloadActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={downloading}
      aria-busy={downloading || undefined}
      className="group flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-recessed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-70 md:px-[18px]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        {downloading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <Icon className="size-5" aria-hidden />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-ink">
          {downloading ? C.DOWNLOADING : title}
        </span>
        <span className="text-[13px] text-ink-muted">{subtitle}</span>
      </span>
      <Download
        aria-hidden
        className="size-4 shrink-0 text-ink-subtle group-hover:text-ink"
      />
    </button>
  );
}
