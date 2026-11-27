import { CircleAlert } from 'lucide-react';

/** Error inline de un form/diálogo (ícono + texto, `role="alert"`). */
export function FormError({ message }: { readonly message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
