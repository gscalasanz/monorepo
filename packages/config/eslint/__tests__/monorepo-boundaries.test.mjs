import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

import { apiPreset, packagesPreset, webPreset } from '../monorepo-boundaries.mjs';

const RULE_ID = 'no-restricted-imports';

function makeESLint(preset) {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser, sourceType: 'module' } },
      preset,
    ],
  });
}

async function lint(preset, code) {
  const results = await makeESLint(preset).lintText(code, { filePath: 'src/x.ts' });
  return results[0].messages.filter((m) => m.ruleId === RULE_ID);
}

test('web no puede importar de api (@scout/api)', async () => {
  assert.equal((await lint(webPreset, "import { x } from '@scout/api';\n")).length, 1);
});

test('web no puede importar de api por ruta relativa', async () => {
  assert.equal((await lint(webPreset, "import { x } from '../../../apps/api/src/x';\n")).length, 1);
});

test('web sí puede importar de shared (@scout/shared)', async () => {
  assert.equal((await lint(webPreset, "import { x } from '@scout/shared/enums';\n")).length, 0);
});

test('api no puede importar de web (@scout/web)', async () => {
  assert.equal((await lint(apiPreset, "import { x } from '@scout/web';\n")).length, 1);
});

test('api no puede importar de web por ruta relativa', async () => {
  assert.equal((await lint(apiPreset, "import { x } from '../../apps/web/src/x';\n")).length, 1);
});

test('api sí puede importar de shared (@scout/shared)', async () => {
  assert.equal((await lint(apiPreset, "import { x } from '@scout/shared';\n")).length, 0);
});

test('packages no puede importar de apps (@scout/web, @scout/api)', async () => {
  assert.equal((await lint(packagesPreset, "import { x } from '@scout/web';\n")).length, 1);
  assert.equal((await lint(packagesPreset, "import { x } from '@scout/api';\n")).length, 1);
});

test('packages no puede importar de apps por ruta relativa', async () => {
  assert.equal((await lint(packagesPreset, "import { x } from '../../apps/api/foo';\n")).length, 1);
});
