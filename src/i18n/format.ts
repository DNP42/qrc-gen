import type { Locale } from './config';

/**
 * Plural forms keyed by CLDR category. English uses `one`/`other`;
 * Slovenian also needs `two` and `few` (1 znak, 2 znaka, 3 znaki, 5 znakov).
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Replace `{name}` placeholders. Unknown placeholders are left as-is. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Pick the plural form for `count` and fill its `{n}` placeholder. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const category = new Intl.PluralRules(locale).select(count);
  return interpolate(forms[category] ?? forms.other, { n: count });
}
