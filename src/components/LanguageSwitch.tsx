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
    <nav aria-label={t.header.language} className="flex items-center gap-1.5 font-mono text-xs">
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
            className={`uppercase tracking-wider transition-colors ${
              locale === current
                ? 'text-[var(--hawk)]'
                : 'text-[var(--muted)] hover:text-white'
            }`}
          >
            {locale}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
