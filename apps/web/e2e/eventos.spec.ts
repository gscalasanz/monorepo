import { expect, test, type APIRequestContext } from '@playwright/test';

import { apiClientFor, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

const FECHA = '2026-05-25';

interface Created {
  readonly id: string;
}

/** Evento de venta (caja del grupo) con un producto con costo, armado por API. */
async function createEventoVenta(
  api: APIRequestContext,
  nombre: string,
): Promise<string> {
  const evento = await api.post('eventos', {
    data: {
      nombre,
      fecha: FECHA,
      tipo: 'venta',
      destinoGanancia: 'caja_grupo',
      modalidadVenta: 'unica',
    },
  });
  expect(evento.ok()).toBeTruthy();
  const { id } = (await evento.json()) as Created;
  const producto = await api.post(`eventos/${id}/productos`, {
    data: { nombre: `${E2E_PREFIX}Locro`, precioVenta: 1500, precioCosto: 500 },
  });
  expect(producto.ok()).toBeTruthy();
  return id;
}

/** Borra las ventas (cascada de movimientos) y después el evento. */
async function cleanupEvento(
  api: APIRequestContext,
  id: string,
): Promise<void> {
  const ventas = await api.get(`eventos/${id}/ventas`);
  if (ventas.ok()) {
    const lista = (await ventas.json()) as Created[];
    for (const venta of lista)
      await api.delete(`eventos/${id}/ventas/${venta.id}`);
  }
  await api.delete(`eventos/${id}`);
}

function idFromUrl(url: string): string {
  return /\/eventos\/([^/?]+)/.exec(url)?.[1] ?? '';
}

test.describe('eventos', () => {
  let api: APIRequestContext;
  const createdIds: string[] = [];

  test.beforeEach(async ({ page }) => {
    const tokens = await loginAsAdmin(page);
    api = await apiClientFor(tokens);
  });

  test.afterEach(async () => {
    for (const id of createdIds.splice(0)) await cleanupEvento(api, id);
    await api.dispose();
  });

  test('crea un evento de grupo desde el form y llega al detalle', async ({
    page,
  }) => {
    const nombre = `${E2E_PREFIX}Kermesse ${uniqueSuffix()}`;
    await page.goto('/eventos/crear');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nuevo Evento' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Crear Evento' }).click();
    await expect(
      page.getByText('El nombre es requerido (mínimo 3 caracteres)'),
    ).toBeVisible();

    await page.getByLabel(/^Nombre/).fill(nombre);
    await page.getByRole('combobox', { name: /Tipo de evento/ }).click();
    await page.getByRole('option', { name: 'Evento de Grupo' }).click();
    await page.getByLabel(/^Fecha/).fill(FECHA);
    await page.getByLabel(/Tipo de actividad grupal/).fill('Salida');
    await page.getByRole('button', { name: 'Crear Evento' }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    createdIds.push(idFromUrl(page.url()));
    await expect(page.getByRole('tab')).toHaveText(['Movimientos']);
    await expect(
      page.getByRole('button', { name: 'Registrar Ingreso' }),
    ).toBeVisible();
  });

  test('evento de venta: lista, productos y ventas en lote', async ({
    page,
  }) => {
    const nombre = `${E2E_PREFIX}Venta ${uniqueSuffix()}`;
    const id = await createEventoVenta(api, nombre);
    createdIds.push(id);

    await page.goto('/eventos');
    await page.getByRole('searchbox').first().fill(nombre);
    await expect(page.getByRole('link', { name: nombre })).toBeVisible();

    await page.goto(`/eventos/${id}`);
    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    await expect(page.getByText(/Movimientos pendientes/)).toBeVisible();
    await expect(page.getByText(`${E2E_PREFIX}Locro`)).toBeVisible();

    await page.goto(`/eventos/${id}/ventas/registrar`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Registrar Ventas en Lote' }),
    ).toBeVisible();
    await page
      .getByRole('combobox', { name: /Responsable de las ventas/ })
      .click();
    await page.getByRole('option', { name: 'Grupo Scout' }).click();
    await page.getByLabel(`Cantidad de ${E2E_PREFIX}Locro`).fill('2');
    await page.getByRole('button', { name: 'Registrar Ventas' }).click();

    await expect(page).toHaveURL(new RegExp(`/eventos/${id}\\?tab=ventas`));
    await expect(page.getByText('Ventas registradas')).toBeVisible();
    await expect(page.getByText('Grupo Scout')).toBeVisible();
  });
});
