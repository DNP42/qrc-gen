'use client';

import {
  affiliateProducts,
  amazonUrl,
} from '@/config/affiliates';
import { useDict, useLocale } from '@/i18n/I18nProvider';

/**
 * Single, unobtrusive affiliate card. The only monetized element on the site —
 * all copy comes from the i18n dictionaries, all links from affiliates.ts.
 */
export function AffiliateBlock() {
  const t = useDict();
  const locale = useLocale();
  const product = affiliateProducts[0];

  return (
    <aside className="max-w-6xl w-full mx-auto px-6 pb-2">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 font-mono text-xs text-[var(--muted)] flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="uppercase tracking-[0.2em]">{t.affiliates.heading}</span>
        <span>{t.affiliates.blurb}</span>
        <a
          href={amazonUrl(product, locale)}
          target="_blank"
          rel="sponsored noopener"
          className="text-[var(--muted)] hover:text-[var(--hawk)] transition-colors"
        >
          {t.affiliates.products[product.key]}
        </a>
        <span className="text-[10px]">{t.affiliates.disclosure}</span>
      </div>
    </aside>
  );
}
