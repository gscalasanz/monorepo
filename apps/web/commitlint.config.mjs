/**
 * commitlint — enforcement de Conventional Commits (commit-msg hook).
 *
 * type-enum fijado a los tipos del contrato (principios-ingenieria.md §Git y
 * git-workflow.md): solo estos 8, nada de build/style/revert. Mantiene el
 * historial alineado con el changelog y las convenciones del repo.
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'ci'],
    ],
  },
};

export default config;
