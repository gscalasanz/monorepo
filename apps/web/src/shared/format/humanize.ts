/** `snake_case`/`kebab-case` → texto legible (port de `humanize.pipe`). */
export type HumanizeMode = 'title' | 'sentence' | 'none';

const SEPARATORS = /[_-]/g;
const WORD_SEPARATOR = ' ';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const TRANSFORMS: Readonly<Record<HumanizeMode, (text: string) => string>> = {
  title: (text) =>
    text
      .toLowerCase()
      .split(WORD_SEPARATOR)
      .map(capitalize)
      .join(WORD_SEPARATOR),
  sentence: (text) => capitalize(text.toLowerCase()),
  none: (text) => text,
};

export function humanize(
  value: string | null | undefined,
  mode: HumanizeMode = 'title',
): string {
  if (!value) return '';
  return TRANSFORMS[mode](value.replace(SEPARATORS, WORD_SEPARATOR));
}
