import type { Metadata } from 'next';
import Link from 'next/link';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { SiteFooter } from '@/components/SiteFooter';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { I18nProvider } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';

export type LegalKind = 'privacy' | 'imprint' | 'terms';

/** Bump when a legal text changes in substance. */
export const LEGAL_UPDATED = '2026-11-27';

/** One legal document, rendered from the dictionary in the page's language. */
export async function LegalPage({ lang, kind }: { lang: Locale; kind: LegalKind }) {
  const dict = await getDictionary(lang);
  const page = dict.legal.pages[kind];

  return (
    <I18nProvider locale={lang} dict={dict}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-[var(--border)]">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <Link
              href={`/${lang}`}
              className="font-mono text-xs text-[var(--hawk)] hover:underline min-h-10 inline-flex items-center"
            >
              {dict.legal.back}
            </Link>
            <LanguageSwitch path={`/${kind}`} />
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
          <p className="mt-2 font-mono text-xs text-[var(--muted)]">
            {interpolate(dict.legal.updated, { date: LEGAL_UPDATED })}
          </p>
          <p className="mt-6 text-[var(--foreground)]">{page.intro}</p>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-[var(--muted)] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </main>

        <SiteFooter />
      </div>
    </I18nProvider>
  );
}

/** Page title and hreflang alternates for one legal document. */
export async function legalMetadata(lang: Locale, kind: LegalKind): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: `${dict.legal.pages[kind].title} — qrc-gen`,
    alternates: {
      canonical: `/${lang}/${kind}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${kind}`])),
    },
  };
}
