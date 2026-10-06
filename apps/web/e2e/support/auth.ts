import { request, type APIRequestContext, type Page } from '@playwright/test';

import { e2eEnv } from './env';

interface Tokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/** Login contra el backend local; devuelve los tokens. */
export async function apiLogin(): Promise<Tokens> {
  const { apiUrl, email, password } = e2eEnv();
  const ctx = await request.newContext();
  const response = await ctx.post(`${apiUrl}/auth/login`, { data: { email, password } });
  if (!response.ok()) throw new Error(`Login e2e falló: ${response.status()}`);
  const body = (await response.json()) as Tokens;
  await ctx.dispose();
  return { accessToken: body.accessToken, refreshToken: body.refreshToken };
}

/** Siembra la sesión en localStorage antes de que cargue la app (mismas claves que Angular). */
export async function loginAsAdmin(page: Page): Promise<Tokens> {
  const tokens = await apiLogin();
  await page.addInitScript((t: Tokens) => {
    window.localStorage.setItem('accessToken', t.accessToken);
    window.localStorage.setItem('refreshToken', t.refreshToken);
  }, tokens);
  return tokens;
}

/** Cliente HTTP autenticado contra la API local (setup y limpieza de datos E2E). */
export async function apiClientFor(tokens: Tokens): Promise<APIRequestContext> {
  const { apiUrl } = e2eEnv();
  return request.newContext({
    baseURL: `${apiUrl}/`,
    extraHTTPHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
  });
}
