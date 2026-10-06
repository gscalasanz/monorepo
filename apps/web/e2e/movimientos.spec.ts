import { expect, test, type Locator, type Page } from '@playwright/test';

import { apiClientFor, apiLogin, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

const DESC_PREFIX = `${E2E_PREFIX}mov `;
const LIST_URL = '/movimientos?tipo=ingreso&concepto=ajuste_inicial';
const CLEANUP_LIMIT = 100;

interface MovimientoRow {
  readonly id: string;
  readonly descripcion: string | null;
}

/** Fila de la tabla (desktop) o ítem de la lista (mobile) que contiene el texto. */
function rowWith(page: Page, text: string, isMobile: boolean): Locator {
  return page
    .getByRole(isMobile ? 'listitem' : 'row')
    .filter({ hasText: text });
}

async function pickComboboxOption(
  page: Page,
  label: string,
  option?: RegExp,
): Promise<void> {
  await page.getByRole('combobox', { name: label }).click();
  const options = option
    ? page.getByRole('option', { name: option })
    : page.getByRole('option');
  await options.first().click();
}

test.describe('movimientos', () => {
  test.afterAll(async () => {
    const api = await apiClientFor(await apiLogin());
    const response = await api.get('movimientos', {
      params: { concepto: 'ajuste_inicial', limit: CLEANUP_LIMIT },
    });
    const body = (await response.json()) as { data: MovimientoRow[] };
    const leftovers = body.data.filter((m) =>
      m.descripcion?.startsWith(DESC_PREFIX),
    );
    for (const movimiento of leftovers)
      await api.delete(`movimientos/${movimiento.id}`);
    await api.dispose();
  });

  test('crear, editar y eliminar un movimiento', async ({ page, isMobile }) => {
    const descripcion = `${DESC_PREFIX}${uniqueSuffix()}`;
    await loginAsAdmin(page);

    // Crear
    await page.goto('/movimientos/nuevo');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nuevo Movimiento' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingreso' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByLabel(/^Monto/).fill('1');
    await page.getByRole('combobox', { name: /^Concepto/ }).click();
    await page.getByRole('option', { name: 'Ajuste Inicial' }).click();
    await pickComboboxOption(page, 'Caja', /^Caja del? Grupo/);
    await pickComboboxOption(page, 'Responsable');
    await page.getByRole('textbox', { name: /^Descripción/ }).fill(descripcion);
    await page.getByRole('button', { name: 'Crear Movimiento' }).click();
    await expect(page).toHaveURL(/\/movimientos$/);

    // Encontrarlo en la lista
    await page.goto(LIST_URL);
    const row = rowWith(page, descripcion, isMobile);
    await expect(row).toBeVisible();

    // Editar descripción y estado
    await row.getByRole('button', { name: 'Editar' }).click();
    await expect(page).toHaveURL(/\/movimientos\/[^/]+\/editar$/);
    await expect(page.getByText('Datos del Movimiento')).toBeVisible();
    const editado = `${descripcion} editado`;
    await page.getByRole('textbox', { name: /^Descripción/ }).fill(editado);
    await page.getByRole('radio', { name: /Pendiente de Reembolso/ }).click();
    await expect(
      page.getByRole('combobox', { name: /Persona a Reembolsar/ }),
    ).not.toHaveValue('');
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();
    await expect(page).toHaveURL(/\/movimientos$/);

    await page.goto(LIST_URL);
    const editedRow = rowWith(page, editado, isMobile);
    await expect(editedRow).toBeVisible();
    await expect(editedRow.getByText('Pendiente de Reembolso')).toBeVisible();

    // Eliminar
    await editedRow.getByRole('button', { name: 'Eliminar' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Eliminar' })
      .click();
    await expect(rowWith(page, editado, isMobile)).toHaveCount(0);
  });
});
