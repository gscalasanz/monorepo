#!/usr/bin/env bash
# PostToolUse hook — formatea el archivo recién editado con Prettier.
# Usa el Prettier del paquete del archivo (apps/* o packages/*): la raíz no lo declara.
# DEFENSIVO: si falta toolchain, termina sin hacer nada. No bloquea nunca: siempre exit 0.
set -euo pipefail

payload="$(cat)"
# file_path sin depender de jq.
file_path="$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"

[ -z "$file_path" ] && exit 0
[ -f "$file_path" ] || exit 0

case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css|*.scss|*.md|*.yml|*.yaml) ;;
  *) exit 0 ;;
esac

# Nunca tocar archivos de entorno.
case "$(basename "$file_path")" in
  .env*) exit 0 ;;
esac

command -v pnpm >/dev/null 2>&1 || exit 0

# Paquete más cercano (directorio con package.json) que tenga node_modules.
dir="$(cd "$(dirname "$file_path")" && pwd)"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
while [ "$dir" != "/" ] && [ "${dir#"$root"}" != "$dir" ]; do
  if [ -f "$dir/package.json" ] && [ -d "$dir/node_modules" ]; then
    if pnpm --dir "$dir" exec prettier --version >/dev/null 2>&1; then
      pnpm --dir "$dir" exec prettier --write --log-level warn "$file_path" >/dev/null 2>&1 || true
    fi
    exit 0
  fi
  dir="$(dirname "$dir")"
done

exit 0
