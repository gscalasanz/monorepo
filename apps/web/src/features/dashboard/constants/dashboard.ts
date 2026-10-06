import { CalendarPlus, ReceiptText, TriangleAlert, UserPlus, type LucideIcon } from 'lucide-react';

import { APP_ROUTES } from '@/shared/constants';

/** Cantidades máximas de las listas (paridad: 3 eventos, 5 movimientos). */
export const UPCOMING_EVENTS_LIMIT = 3;
export const RECENT_MOVIMIENTOS_LIMIT = 5;

export interface QuickAction {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export const QUICK_ACTIONS: readonly QuickAction[] = [
  { label: 'Registrar Inscripción', href: `${APP_ROUTES.INSCRIPCIONES}/crear`, icon: UserPlus },
  { label: 'Crear Evento', href: `${APP_ROUTES.EVENTOS}/crear`, icon: CalendarPlus },
  { label: 'Registrar Gasto', href: `${APP_ROUTES.MOVIMIENTOS}/nuevo`, icon: ReceiptText },
  { label: 'Deudores', href: `${APP_ROUTES.REPORTES}/deudas`, icon: TriangleAlert },
];
