import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@/shared/constants';

/** Angular no tiene esta ruta (NotFound); acá vuelve al listado. */
export default function ProtagonistasRedirectPage() {
  redirect(APP_ROUTES.PERSONAS);
}
