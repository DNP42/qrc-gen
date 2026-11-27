'use client';

import Link from 'next/link';
import { useDict, useLocale } from '@/i18n/I18nProvider';

const linkClass = 'hover:text-[var(--hawk)] transition-colors';

/** Footer shared by the generator and the legal pages. */
export function SiteFooter() {
  const t = useDict();
  const locale = useLocale();

  return (
    <footer className="border-t border-[var(--border)] mt-10">
      <div className="max-w-6xl mx-auto px-6 py-6 font-mono text-xs text-[var(--muted)] flex flex-wrap gap-4 justify-between">
        <span>
          {t.footer.builtBy} <span className="text-[var(--hawk)]">SpectreHawk</span>
        </span>
        <span>
          {t.footer.poweredBy}{' '}
          <a
            href="https://github.com/kozakdenys/qr-code-styling"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            qr-code-styling
          </a>
        </span>
        <a href="https://donotpanic.space" target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t.footer.home}
        </a>
        <a
          href="https://github.com/DNP42/qrc-gen"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {t.footer.source}
        </a>
        <nav aria-label={t.legal.navLabel} className="flex flex-wrap gap-4">
          <Link href={`/${locale}/privacy`} className={linkClass}>
            {t.legal.nav.privacy}
          </Link>
          <Link href={`/${locale}/imprint`} className={linkClass}>
            {t.legal.nav.imprint}
          </Link>
          <Link href={`/${locale}/terms`} className={linkClass}>
            {t.legal.nav.terms}
          </Link>
        </nav>
        <a
          href="https://ko-fi.com/smokrates"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[var(--hawk)] text-[var(--hawk)] px-3 py-1 hover:bg-[var(--hawk)] hover:text-black transition-colors"
        >
          {t.footer.kofi}
        </a>
      </div>
    </footer>
  );
}
