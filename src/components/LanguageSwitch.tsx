'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { localeNames, locales } from '@/i18n/config';
import { useDict, useLocale } from '@/i18n/I18nProvider';

/**
 * EN | SL links. The URL is the language, so there is nothing to store;
 * switching loads the other page and resets the form.
 */
export function LanguageSwitch() {
  const t = useDict();
  const current = useLocale();

  return (
    <nav aria-label={t.header.language} className="flex items-center gap-1 font-mono text-sm">
      {locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && (
            <span aria-hidden="true" className="text-[var(--border-hot)]">
              {'|'}
            </span>
          )}
          <Link
            href={`/${locale}`}
            hrefLang={locale}
            lang={locale}
            title={localeNames[locale]}
            aria-current={locale === current ? 'page' : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center uppercase underline-offset-4 ${
              locale === current
                ? 'font-bold underline text-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {locale}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
