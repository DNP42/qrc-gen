import type { Metadata } from 'next';
import { locales, ogLocales, type Locale } from '@/i18n/config';

/**
 * Metadata for a page below /[lang]: canonical, hreflang alternates and Open
 * Graph, in the same shape as the root layout. metadataBase comes from the
 * layout. Only `/` redirects by language, so x-default points to the
 * Slovenian page, the main audience of the sales pages.
 */
export function buildSubpageMetadata(options: {
  lang: Locale;
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const { lang, slug, title, description } = options;
  const pathFor = (locale: Locale) => `/${locale}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pathFor(lang),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pathFor(l)])),
        'x-default': pathFor('sl'),
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: pathFor(lang),
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
  };
}
