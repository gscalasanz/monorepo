import { expect, test } from '@playwright/test';

import { e2eEnv } from './support/env';

test.describe('auth', () => {
  test('login con credenciales válidas vuelve a la ruta pedida', async ({ page }) => {
    const { email, password } = e2eEnv();
    await page.goto('/configuracion');
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel(/^Correo electrónico/).fill(email);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/configuracion$/);
  });

  test('credenciales inválidas muestran el error inline', async ({ page }) => {
    const { email } = e2eEnv();
    await page.goto('/login');
    await page.getByLabel(/^Correo electrónico/).fill(email);
    await page.getByLabel(/^Contraseña/).fill('incorrecta-123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByText('Credenciales inválidas. Verifique su email y contraseña.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('cerrar sesión vuelve al login', async ({ page, isMobile }) => {
    const { email, password } = e2eEnv();
    await page.goto('/login');
    await page.getByLabel(/^Correo electrónico/).fill(email);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    if (isMobile) await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
