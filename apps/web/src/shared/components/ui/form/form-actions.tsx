'use client';

import type { ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { cn } from '@/shared/lib/utils';

export interface FormActionsProps {
  readonly onCancel?: () => void;
  /** Si se pasa, el botón es `type="button"`; si no, hace submit del `<form>`. */
  readonly onSave?: () => void;
  readonly saveLabel?: string;
  readonly cancelLabel?: string;
  readonly saving?: boolean;
  readonly saveDisabled?: boolean;
  /** Id del `<form>` cuando la barra queda fuera de él. */
  readonly form?: string;
  /** Acciones extra a la izquierda (p. ej. "Eliminar"). */
  readonly extra?: ReactNode;
  readonly className?: string;
}

/**
 * Pie de formulario Cancelar / Guardar. Es `sticky` abajo (en mobile a todo el ancho y
 * por encima del bottom-nav, DESIGN.md: lo reemplaza): se pega al borde mientras el
 * formulario es más alto que la pantalla y, al llegar al final, queda en el flujo de la
 * página, así que nunca depende del alto del viewport. Desde `md` va alineado a la derecha.
 */
export function FormActions({
  onCancel,
  onSave,
  saveLabel = FORM_COPY.save,
  cancelLabel = FORM_COPY.cancel,
  saving = false,
  saveDisabled = false,
  form,
  extra,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-40 -mx-4 flex items-center gap-2 border-t border-border bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
        'md:z-10 md:mx-0 md:justify-end md:bg-canvas md:px-0 md:pt-4 md:pb-4',
        className,
      )}
    >
      {extra && <div className="mr-auto flex gap-2">{extra}</div>}
      <div className="flex flex-1 gap-2 md:flex-none md:justify-end [&>*]:flex-1 md:[&>*]:flex-none">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type={onSave ? 'button' : 'submit'}
          form={form}
          onClick={onSave}
          loading={saving}
          disabled={saveDisabled}
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
