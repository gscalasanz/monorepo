import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

import { noNewDatePresets } from '../no-new-date.mjs';

const RULE_ID = 'no-restricted-syntax';
const SEVERITY = { warn: 1, error: 2 };

/** ESLint configurado solo con el parser de TS + el preset bajo prueba. */
function makeESLint(preset) {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      { files: ['**/*.ts', '**/*.tsx'], languageOptions: { parser: tseslint.parser } },
      ...preset,
    ],
  });
}

/** Mensajes de `no-restricted-syntax` para `code` linteado como `filePath`. */
async function lint({ preset, code, filePath }) {
  const results = await makeESLint(preset).lintText(code, { filePath });
  return results[0].messages.filter((m) => m.ruleId === RULE_ID);
}

const NEW_DATE = 'const x = new Date();\n';
const DATE_NOW = 'const x = Date.now();\n';

describe('preset web', () => {
  const preset = noNewDatePresets.web;

  test('`new Date()` en lógica de negocio es error', async () => {
    const messages = await lint({ preset, code: NEW_DATE, filePath: 'src/features/a/x.ts' });
    assert.equal(messages.length, 1);
    assert.equal(messages[0].severity, SEVERITY.error);
    assert.match(messages[0].message, /@\/shared\/time/);
  });

  test('`Date.now()` en lógica de negocio es error', async () => {
    const messages = await lint({ preset, code: DATE_NOW, filePath: 'src/features/a/x.tsx' });
    assert.equal(messages.length, 1);
  });

  test('`src/shared/time/**` está exento', async () => {
    const messages = await lint({ preset, code: NEW_DATE, filePath: 'src/shared/time/clock.ts' });
    assert.equal(messages.length, 0);
  });

  test('tests y type-tests están exentos', async () => {
    for (const filePath of ['src/x.test.tsx', 'e2e/x.spec.ts', 'src/x.type-test.ts']) {
      const messages = await lint({ preset, code: NEW_DATE, filePath });
      assert.equal(messages.length, 0, filePath);
    }
  });
});

describe('preset api', () => {
  const preset = noNewDatePresets.api;

  test('`new Date()` en lógica de negocio es error', async () => {
    const messages = await lint({ preset, code: NEW_DATE, filePath: 'src/modules/a/a.service.ts' });
    assert.equal(messages.length, 1);
    assert.equal(messages[0].severity, SEVERITY.error);
    assert.match(messages[0].message, /@scout\/shared\/time/);
  });

  test('`Date.now()` en lógica de negocio es error', async () => {
    const messages = await lint({ preset, code: DATE_NOW, filePath: 'src/modules/a/a.service.ts' });
    assert.equal(messages.length, 1);
  });

  test('migraciones generadas y specs están exentos', async () => {
    const exempt = [
      'src/database/migrations/1780000000000-X.ts',
      'src/modules/a/a.service.spec.ts',
      'test/a.e2e-spec.ts',
    ];
    for (const filePath of exempt) {
      const messages = await lint({ preset, code: NEW_DATE, filePath });
      assert.equal(messages.length, 0, filePath);
    }
  });
});

describe('preset packages', () => {
  const preset = noNewDatePresets.packages;

  test('`new Date()` fuera de `src/time/**` es error', async () => {
    const messages = await lint({ preset, code: NEW_DATE, filePath: 'src/enums/x.ts' });
    assert.equal(messages.length, 1);
    assert.equal(messages[0].severity, SEVERITY.error);
  });

  test('`src/time/**` está exento', async () => {
    const messages = await lint({ preset, code: NEW_DATE, filePath: 'src/time/clock.ts' });
    assert.equal(messages.length, 0);
  });
});

test('usar el módulo `time` no dispara la regla', async () => {
  const code = "import { nowInstant } from '@scout/shared/time';\nconst x = nowInstant();\n";
  const messages = await lint({ preset: noNewDatePresets.api, code, filePath: 'src/a.ts' });
  assert.equal(messages.length, 0);
});
