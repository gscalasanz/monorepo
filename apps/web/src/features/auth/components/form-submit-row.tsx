import { Button } from '@/shared/components/ui/button';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';

interface FormSubmitRowProps {
  readonly label: string;
  readonly saving: boolean;
}

/** Botón de guardar al pie de cada columna de "Seguridad": siempre a la derecha y con el mismo ancho. */
export function FormSubmitRow({ label, saving }: FormSubmitRowProps) {
  return (
    <div className="mt-auto flex justify-end pt-2">
      <Button type="submit" className="w-full sm:w-44" loading={saving}>
        {saving ? C.SAVING : label}
      </Button>
    </div>
  );
}
