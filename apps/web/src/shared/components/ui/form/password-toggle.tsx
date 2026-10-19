import { Eye, EyeOff } from 'lucide-react';

import { FORM_COPY } from '@/shared/components/ui/form/copy';

export interface PasswordToggleProps {
  readonly visible: boolean;
  /** Id del input que controla. */
  readonly controls: string;
  readonly disabled?: boolean;
  readonly onToggle: () => void;
}

/** Botón ojo de `PasswordField`: nombre accesible según el estado. */
export function PasswordToggle({
  visible,
  controls,
  disabled,
  onToggle,
}: PasswordToggleProps) {
  const Icon = visible ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={visible ? FORM_COPY.hidePassword : FORM_COPY.showPassword}
      aria-pressed={visible}
      aria-controls={controls}
      className="flex size-9 items-center justify-center rounded-sm text-ink-muted outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed md:size-7"
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
