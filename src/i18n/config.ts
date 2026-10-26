/**
 * Supported UI languages. Each one is a statically generated route
 * (`/en`, `/sl`); `/` redirects by browser language (see next.config.ts).
 * `sl` is the ISO 639-1 code for Slovenian (`si` is Sinhala).
 */
export const locales = ['en', 'sl'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Language names in their own language, for the switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sl: 'Slovenščina',
};

/** Open Graph locale tags (`og:locale`). */
export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  sl: 'sl_SI',
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
