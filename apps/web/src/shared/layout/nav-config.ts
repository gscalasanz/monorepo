/**
 * Navegación del AppShell (port de `SidebarComponent.menuItems` y de los
 * `data.page` de `app.routes.ts`). Reportes sigue oculto, como en Angular.
 */
import {
  ArrowLeftRight,
  CalendarDays,
  ClipboardCheck,
  LayoutGrid,
  Settings,
  Tent,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { APP_ROUTES } from '@/shared/constants';

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface NavGroup {
  /** `null` = grupo principal sin título. */
  readonly title: string | null;
  readonly items: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    title: null,
    items: [
      { label: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: LayoutGrid },
      { label: 'Movimientos', href: APP_ROUTES.MOVIMIENTOS, icon: ArrowLeftRight },
      { label: 'Gestión Financiera', href: APP_ROUTES.CAJAS, icon: Wallet },
      { label: 'Gestión de Personas', href: APP_ROUTES.PERSONAS, icon: Users },
    ],
  },
  {
    title: 'Actividades',
    items: [
      { label: 'Inscripciones', href: APP_ROUTES.INSCRIPCIONES, icon: ClipboardCheck },
      { label: 'Campamentos', href: APP_ROUTES.CAMPAMENTOS, icon: Tent },
      { label: 'Eventos', href: APP_ROUTES.EVENTOS, icon: CalendarDays },
    ],
  },
];

export const NAV_FOOTER_ITEM: NavItem = {
  label: 'Configuración',
  href: APP_ROUTES.CONFIGURACION,
  icon: Settings,
};

/** Destinos del bottom-nav mobile (el "+" central va a nuevo movimiento). */
export const MOBILE_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', href: APP_ROUTES.DASHBOARD, icon: LayoutGrid },
  { label: 'Movimientos', href: APP_ROUTES.MOVIMIENTOS, icon: ArrowLeftRight },
  { label: 'Personas', href: APP_ROUTES.PERSONAS, icon: Users },
  { label: 'Eventos', href: APP_ROUTES.EVENTOS, icon: CalendarDays },
];

export const NEW_MOVIMIENTO_HREF = `${APP_ROUTES.MOVIMIENTOS}/nuevo`;

export interface PageMeta {
  readonly title: string;
  readonly subtitle: string;
}

/** Título/subtítulo por sección (prefijo de ruta), igual que Angular. */
export const PAGE_META: Readonly<Record<string, PageMeta>> = {
  [APP_ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    subtitle: 'Bienvenido al Sistema de Gestión Financiera Scout',
  },
  [APP_ROUTES.PERSONAS]: {
    title: 'Gestión de Personas',
    subtitle: 'Administra protagonistas, educadores y personas externas',
  },
  [APP_ROUTES.CAJAS]: {
    title: 'Gestión Financiera',
    subtitle: 'Administra cajas, fondos de rama y cuentas personales',
  },
  [APP_ROUTES.MOVIMIENTOS]: {
    title: 'Movimientos',
    subtitle: 'Visualiza y gestiona los movimientos financieros',
  },
  [APP_ROUTES.INSCRIPCIONES]: {
    title: 'Inscripciones',
    subtitle: 'Gestión de inscripciones Scout Argentina y de grupo',
  },
  [APP_ROUTES.EVENTOS]: { title: 'Eventos', subtitle: 'Organiza los eventos del grupo' },
  [APP_ROUTES.CAMPAMENTOS]: {
    title: 'Campamentos',
    subtitle: 'Planifica y gestiona los campamentos del grupo',
  },
  [APP_ROUTES.REPORTES]: { title: 'Reportes', subtitle: 'Genera y visualiza reportes del grupo' },
  [APP_ROUTES.CONFIGURACION]: {
    title: 'Configuración',
    subtitle: 'Configura los parámetros del sistema',
  },
};

/** ¿`pathname` está dentro de la sección `href`? */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function pageMetaFor(pathname: string): PageMeta | null {
  const key = Object.keys(PAGE_META).find((href) => isActivePath(pathname, href));
  return key ? (PAGE_META[key] ?? null) : null;
}

/** Rutas de formulario: en mobile el bottom-nav cede lugar a la barra de acciones. */
const FORM_ROUTE_SUFFIXES = ['/nuevo', '/crear', '/editar', '/pago', '/registrar'] as const;

export function isFormRoute(pathname: string): boolean {
  return FORM_ROUTE_SUFFIXES.some((suffix) => pathname.endsWith(suffix));
}
