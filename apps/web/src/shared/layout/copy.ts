/** Copy del AppShell. */
export const LAYOUT_COPY = {
  APP_NAME: 'Scout Finance',
  APP_SUBTITLE: 'Sistema de Gestión',
  LOGO_ALT: 'Grupo Scout Calasanz',
  NAV_LABEL: 'Navegación principal',
  MOBILE_NAV_LABEL: 'Navegación rápida',
  COLLAPSE: 'Colapsar menú',
  EXPAND: 'Expandir menú',
  OPEN_MENU: 'Abrir menú de navegación',
  LOGOUT: 'Cerrar sesión',
  NEW_MOVIMIENTO: 'Nuevo movimiento',
  THEME_TO_DARK: 'Cambiar a tema oscuro',
  THEME_TO_LIGHT: 'Cambiar a tema claro',
  DEFAULT_USER: 'Usuario',
  CHECKING_SESSION: 'Verificando sesión…',
  BACK: 'Volver',
} as const;

/** Etiquetas del menú y título/subtítulo por sección (port de `menuItems` + `data.page`). */
export const NAV_COPY = {
  LABELS: {
    DASHBOARD: 'Dashboard',
    MOVIMIENTOS: 'Movimientos',
    CAJAS: 'Cajas',
    PERSONAS: 'Personas',
    INSCRIPCIONES: 'Inscripciones',
    CAMPAMENTOS: 'Campamentos',
    EVENTOS: 'Eventos',
    CONFIGURACION: 'Configuración',
  },
  MOBILE_LABELS: {
    HOME: 'Inicio',
    PERSONAS: 'Personas',
  },
  GROUP_ACTIVIDADES: 'Actividades',
  PAGES: {
    DASHBOARD: {
      title: 'Dashboard',
    },
    PERSONAS: {
      title: 'Personas',
    },
    CAJAS: {
      title: 'Cajas',
    },
    MOVIMIENTOS: {
      title: 'Movimientos',
    },
    INSCRIPCIONES: {
      title: 'Inscripciones',
    },
    EVENTOS: { title: 'Eventos' },
    CAMPAMENTOS: {
      title: 'Campamentos',
    },
    REPORTES: { title: 'Reportes' },
    CONFIGURACION: {
      title: 'Configuración',
    },
  },
} as const;

export const LOGO_SRC = '/images/logo.png';
