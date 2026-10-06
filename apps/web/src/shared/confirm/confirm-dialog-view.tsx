'use client';

import { CircleAlert, CircleCheck, CircleHelp, Loader2, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/shared/components/reui/alert-dialog';
import { CONFIRM_COPY } from '@/shared/confirm/copy';
import type { ActiveConfirm } from '@/shared/confirm/confirm-store';
import { ConfirmDetails } from '@/shared/confirm/confirm-details';
import { ConfirmFooter } from '@/shared/confirm/confirm-footer';
import { useConfirmFlow, type ConfirmPhase } from '@/shared/confirm/use-confirm-flow';
import { cn } from '@/shared/lib/utils';

function PhaseIcon({ phase, destructive }: { phase: ConfirmPhase; destructive: boolean }) {
  if (phase === 'loading') return <Loader2 className="animate-spin text-brand" aria-hidden />;
  if (phase === 'success') return <CircleCheck className="text-success" aria-hidden />;
  if (phase === 'error') return <CircleAlert className="text-danger" aria-hidden />;
  if (destructive) return <Trash2 className="text-danger" aria-hidden />;
  return <CircleHelp className="text-brand" aria-hidden />;
}

interface Texts {
  readonly title: string;
  readonly message: string;
}

function textsFor(
  active: ActiveConfirm,
  { phase, error }: { phase: ConfirmPhase; error: string },
): Texts {
  const destructive = Boolean(active.destructive);
  const entity = active.entityName ?? CONFIRM_COPY.DEFAULT_ENTITY;
  if (phase === 'loading') {
    return { title: active.title, message: CONFIRM_COPY.loading(entity, destructive) };
  }
  if (phase === 'success') {
    return {
      title: CONFIRM_COPY.successTitle(destructive),
      message: CONFIRM_COPY.successMessage(entity, destructive),
    };
  }
  if (phase === 'error') return { title: active.title, message: error };
  return { title: active.title, message: active.message };
}

/** Diálogo de confirmación (simple o con acción async). */
export function ConfirmDialogView({ active }: { active: ActiveConfirm }) {
  const flow = useConfirmFlow(active);
  const destructive = Boolean(active.destructive);
  const texts = textsFor(active, flow);

  return (
    <AlertDialog open onOpenChange={(open) => !open && flow.onCancel()}>
      <AlertDialogContent className="bg-surface-raised shadow-lg sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className={cn(destructive ? 'bg-danger-soft' : 'bg-brand-soft')}>
            <PhaseIcon phase={flow.phase} destructive={destructive} />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-ink font-semibold">{texts.title}</AlertDialogTitle>
          <AlertDialogDescription
            className={cn('text-ink-muted', flow.phase === 'error' && 'text-danger')}
            aria-live="polite"
          >
            {texts.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {flow.phase === 'confirm' && <ConfirmDetails active={active} />}
        {flow.phase === 'error' && flow.hint && (
          <p className="text-ink-muted text-sm">{flow.hint}</p>
        )}
        {flow.phase !== 'success' && <ConfirmFooter active={active} flow={flow} />}
      </AlertDialogContent>
    </AlertDialog>
  );
}
