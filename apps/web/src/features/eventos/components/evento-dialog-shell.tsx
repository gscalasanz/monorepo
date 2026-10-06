'use client';

import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/reui/dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export interface EventoDialogShellProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly icon?: ReactNode;
  /** Id del `<form>` hijo: el submit vive en el pie. */
  readonly formId: string;
  readonly submitLabel: string;
  readonly cancelLabel: string;
  readonly saving: boolean;
  readonly submitDisabled?: boolean;
  readonly error: string | null;
  readonly children: ReactNode;
}

/** Hoja a pantalla completa en mobile; modal centrado desde `md`. */
const CONTENT_CLASSES = cn(
  'flex flex-col gap-0 overflow-hidden bg-surface-raised p-0 text-ink',
  'max-md:inset-0 max-md:h-dvh max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none',
  'md:max-h-[calc(100dvh-4rem)] md:max-w-xl',
);

function DialogFooter(props: EventoDialogShellProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-5 md:pb-4">
      {props.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {props.error}
        </p>
      )}
      <div className="flex gap-2 md:justify-end [&>*]:flex-1 md:[&>*]:flex-none">
        <Button
          type="button"
          variant="secondary"
          disabled={props.saving}
          onClick={() => props.onOpenChange(false)}
        >
          {props.cancelLabel}
        </Button>
        <Button
          type="submit"
          form={props.formId}
          loading={props.saving}
          disabled={props.submitDisabled}
        >
          {props.submitLabel}
        </Button>
      </div>
    </div>
  );
}

/** Marco de los diálogos de producto y entrega (mismo patrón que los de finanzas). */
export function EventoDialogShell(props: EventoDialogShellProps) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => !props.saving && props.onOpenChange(open)}
    >
      <DialogContent showCloseButton={false} className={CONTENT_CLASSES}>
        <DialogHeader className="border-b border-border px-4 py-3 md:px-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-ink">
            {props.icon}
            {props.title}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5">
          {props.children}
        </div>
        <DialogFooter {...props} />
      </DialogContent>
    </Dialog>
  );
}
