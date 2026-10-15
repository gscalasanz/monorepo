/** Config de e2e: solo backend LOCAL (nunca producción). */
const LOCAL_API = /^http:\/\/localhost:\d+\/api\/v1$/;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env.local para correr los e2e`);
  return value;
}

export function e2eEnv(): { apiUrl: string; email: string; password: string } {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001/api/v1';
  if (!LOCAL_API.test(apiUrl)) {
    throw new Error(`Los e2e solo corren contra el backend local (recibido: ${apiUrl})`);
  }
  return { apiUrl, email: required('E2E_EMAIL'), password: required('E2E_PASSWORD') };
}

/** Prefijo obligatorio de todo dato que crean los e2e (para limpiarlo). */
export const E2E_PREFIX = 'E2E ';

/** Sufijo único para nombres de datos de prueba. */
export function uniqueSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}
