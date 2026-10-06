import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from '@playwright/test';

import { apiClientFor, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

interface PersonaRow {
  readonly id: string;
  readonly nombre: string;
}

const suffix = uniqueSuffix();
const nombre = `${E2E_PREFIX}Protagonista ${suffix}`;
const nombreEditado = `${E2E_PREFIX}Protagonista ${suffix} Editado`;

let tokens: Awaited<ReturnType<typeof loginAsAdmin>> | null = null;

/** Busca en el listado (tab Manada por defecto) y devuelve el menú de acciones de la persona. */
async function openRowActions(page: Page, target: string): Promise<void> {
  await page.getByPlaceholder('Buscar por nombre...').fill(target);
  await expect(
    page.getByRole('link', { name: target, exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: `Acciones para ${target}`, exact: true })
    .click();
}

async function confirmInDialog(page: Page, button: string): Promise<void> {
  const dialog = page.getByRole('alertdialog');
  await dialog.getByRole('button', { name: button, exact: true }).click();
  await expect(dialog).toBeHidden();
}

test.describe('personas', () => {
  test.afterAll(async () => {
    if (!tokens) return;
    const api: APIRequestContext = await apiClientFor(tokens);
    const response = await api.get('personas');
    const personas = response.ok()
      ? ((await response.json()) as PersonaRow[])
      : [];
    const leftovers = personas.filter(
      (p) => p.nombre.startsWith(E2E_PREFIX) && p.nombre.includes(suffix),
    );
    for (const persona of leftovers) await api.delete(`personas/${persona.id}`);
    await api.dispose();
  });

  test('alta, edición, deshabilitar/rehabilitar, ficha y baja de un protagonista', async ({
    page,
  }) => {
    tokens = await loginAsAdmin(page);

    // Alta desde el formulario
    await page.goto('/personas/protagonistas/crear');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nuevo Protagonista' }),
    ).toBeVisible();
    await page.getByLabel('Nombre').fill(nombre);
    await page.getByRole('combobox', { name: 'Rama' }).click();
    await page.getByRole('option', { name: 'Manada' }).click();
    await page.getByRole('checkbox', { name: 'DNI', exact: true }).check();
    await page.getByRole('button', { name: 'Crear Protagonista' }).click();
    await expect(
      page.getByText('Protagonista creado exitosamente'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/personas$/);

    // Aparece en la tab de su rama (Manada es la tab inicial)
    await expect(page.getByRole('tab', { name: 'Manada' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Edición del nombre
    await openRowActions(page, nombre);
    await page.getByRole('menuitem', { name: 'Editar' }).click();
    await expect(page).toHaveURL(/\/personas\/protagonistas\/[^/]+\/editar$/);
    await expect(page.getByLabel('Nombre')).toHaveValue(nombre);
    await page.getByLabel('Nombre').fill(nombreEditado);
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();
    await expect(
      page.getByText('Persona actualizada exitosamente'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/personas$/);

    // Deshabilitar: deja de verse salvo con "Mostrar deshabilitados"
    await openRowActions(page, nombreEditado);
    await page.getByRole('menuitem', { name: 'Deshabilitar' }).click();
    await confirmInDialog(page, 'Deshabilitar');
    await expect(page.getByText('Persona deshabilitada')).toBeVisible();
    await expect(
      page.getByRole('link', { name: nombreEditado, exact: true }),
    ).toBeHidden();
    await page.getByRole('switch', { name: 'Mostrar deshabilitados' }).click();
    await expect(
      page.getByRole('link', { name: nombreEditado, exact: true }),
    ).toBeVisible();

    // Rehabilitar
    await page
      .getByRole('button', {
        name: `Acciones para ${nombreEditado}`,
        exact: true,
      })
      .click();
    await page.getByRole('menuitem', { name: 'Rehabilitar' }).click();
    await confirmInDialog(page, 'Rehabilitar');
    await expect(page.getByText('Persona rehabilitada')).toBeVisible();

    // Ficha
    await page.getByRole('link', { name: nombreEditado, exact: true }).click();
    await expect(page).toHaveURL(/\/personas\/protagonistas\/[^/]+$/);
    await expect(
      page.getByRole('heading', { level: 1, name: nombreEditado }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Saldo cuenta personal' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Documentación' }),
    ).toBeVisible();

    // Baja desde el listado
    await page.goto('/personas');
    await openRowActions(page, nombreEditado);
    await page.getByRole('menuitem', { name: 'Eliminar' }).click();
    await confirmInDialog(page, 'Eliminar');
    await expect(
      page.getByText('Persona eliminada exitosamente'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: nombreEditado, exact: true }),
    ).toBeHidden();
  });
});
