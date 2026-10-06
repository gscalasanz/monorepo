/** Copy del feature auth (paridad con `LoginComponent` y la card "Mi Perfil"). */
export const AUTH_FEATURE_COPY = {
  HERO_TITLE: 'Scout Finanzas',
  HERO_TAGLINE: 'Sistema de Gestión Financiera',
  HERO_DESCRIPTION:
    'Administra las finanzas de tu grupo scout de manera simple y transparente. Gestiona inscripciones, campamentos, eventos y movimientos en un solo lugar.',
  HERO_FEATURES: [
    'Control de cajas y fondos por rama',
    'Seguimiento de inscripciones Scout Argentina',
    'Gestión de pagos y movimientos',
    'Reportes financieros detallados',
  ],
  FOOTER: ['Scouts de Argentina', 'Grupo Scout Santa Fe'],
  FORM_TITLE: 'Iniciar Sesión',
  FORM_SUBTITLE: 'Ingresa tus credenciales para continuar',
  EMAIL_LABEL: 'Correo electrónico',
  EMAIL_PLACEHOLDER: 'tu@email.com',
  PASSWORD_LABEL: 'Contraseña',
  PASSWORD_PLACEHOLDER: '••••••••',
  SUBMIT: 'Ingresar',
  SUBMITTING: 'Ingresando...',
  INVALID_CREDENTIALS: 'Credenciales inválidas. Verifique su email y contraseña.',
  LOGIN_FALLBACK: 'Error al iniciar sesión. Por favor, intente nuevamente.',
  // Validación
  EMAIL_REQUIRED: 'El correo es requerido',
  EMAIL_INVALID: 'Ingresa un correo válido',
  PASSWORD_REQUIRED: 'La contraseña es requerida',
  PASSWORD_MIN: 'Mínimo 6 caracteres',
  // Mi Perfil
  PROFILE_TITLE: 'Mi Perfil',
  PROFILE_NAME: 'Nombre',
  PROFILE_TYPE: 'Tipo',
  CHANGE_EMAIL_TITLE: 'Cambiar email',
  NEW_EMAIL_LABEL: 'Nuevo email',
  NEW_EMAIL_PLACEHOLDER: 'nuevo@email.com',
  CURRENT_PASSWORD_LABEL: 'Contraseña actual',
  SAVE_EMAIL: 'Guardar email',
  EMAIL_UPDATED: 'Email actualizado exitosamente',
  EMAIL_UPDATE_ERROR: 'Error al actualizar el email',
  CHANGE_PASSWORD_TITLE: 'Cambiar contraseña',
  NEW_PASSWORD_LABEL: 'Nueva contraseña',
  CONFIRM_PASSWORD_LABEL: 'Confirmar nueva contraseña',
  SAVE_PASSWORD: 'Cambiar contraseña',
  PASSWORD_UPDATED: 'Contraseña actualizada. Por favor inicia sesión nuevamente.',
  PASSWORD_UPDATE_ERROR: 'Error al actualizar la contraseña',
  REQUIRED_F: 'Requerida',
  MIN_8: 'Mínimo 8 caracteres',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  SAVING: 'Guardando...',
} as const;

/** Mínimos de longitud de contraseña (login: 6; perfil: 8, como Angular). */
export const PASSWORD_MIN_LOGIN = 6;
export const PASSWORD_MIN_PROFILE = 8;
