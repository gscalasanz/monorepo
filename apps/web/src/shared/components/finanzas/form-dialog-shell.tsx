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

import { FINANZAS_COPY } from './copy';

export interface FormDialogShellProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly icon?: ReactNode;
  /** Id del `<form>` hijo: el botón de submit vive en el pie, fuera del form. */
  readonly formId: string;
  readonly submitLabel: string;
  readonly savingLabel?: string;
  readonly saving: boolean;
  readonly error: string | null;
  readonly children: ReactNode;
}

/** Hoja a pantalla completa en mobile; modal centrado desde `md`. */
const CONTENT_CLASSES = cn(
  'flex flex-col gap-0 overflow-hidden bg-surface-raised p-0 text-ink',
  'max-md:inset-0 max-md:h-dvh max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none',
  'md:max-h-[calc(100dvh-4rem)] md:max-w-xl',
);

/** Marco común de los diálogos de gasto/ingreso: título, cuerpo con scroll y pie. */
export function FormDialogShell(props: FormDialogShellProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
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
        <FormDialogFooter {...props} />
      </DialogContent>
    </Dialog>
  );
}

function FormDialogFooter({
  onOpenChange,
  formId,
  submitLabel,
  savingLabel,
  saving,
  error,
}: FormDialogShellProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-5 md:pb-4">
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
      <div className="flex gap-2 md:justify-end [&>*]:flex-1 md:[&>*]:flex-none">
        <Button
          type="button"
          variant="secondary"
          disabled={saving}
          onClick={() => onOpenChange(false)}
        >
          {FINANZAS_COPY.form.cancelar}
        </Button>
        <Button type="submit" form={formId} loading={saving}>
          {saving && savingLabel ? savingLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
}
