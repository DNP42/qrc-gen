'use client';

import { useDict } from '@/i18n/I18nProvider';

/** Footer shared by the generator and the sales pages. */
export function SiteFooter() {
  const t = useDict();

  return (
    <footer className="border-t border-[var(--border)] mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-mono text-xs text-[var(--muted-strong)] flex flex-wrap gap-4 justify-between">
        <span>
          {t.footer.builtBy}{' '}
          <span className="text-[var(--hawk)]">SpectreHawk</span>
        </span>
        <span>
          {t.footer.poweredBy}{' '}
          <a
            href="https://github.com/kozakdenys/qr-code-styling"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--hawk)] transition-colors"
          >
            qr-code-styling
          </a>
        </span>
      </div>
    </footer>
  );
}
