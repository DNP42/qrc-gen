'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { useDict, useLocale } from '@/i18n/I18nProvider';

/**
 * Header shared by the generator and the sales pages. The wordmark is the
 * page's h1 only on the generator; the sales pages own their h1.
 */
export function SiteHeader({ isHome = false }: { isHome?: boolean }) {
  const t = useDict();
  const lang = useLocale();
  const pathname = usePathname();

  const navLinks = [
    { href: `/${lang}`, label: t.nav.generator },
    { href: `/${lang}/vizitka`, label: t.nav.vizitka },
    { href: `/${lang}/autopilot`, label: t.nav.autopilot },
    { href: `/${lang}/cenik`, label: t.nav.pricing },
  ];

  const wordmarkClass = 'font-mono text-lg text-[var(--hawk)] hawk-glow scanline';

  return (
    <header className="border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div>
          {isHome ? (
            <h1 className={wordmarkClass}>qrc-gen</h1>
          ) : (
            <Link href={`/${lang}`} aria-label={t.nav.home} className={`${wordmarkClass} block`}>
              qrc-gen
            </Link>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-strong)] mt-1">
            {t.header.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <nav aria-label={t.nav.label}>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
              {navLinks.map(({ href, label }) => {
                const isCurrent = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`transition-colors ${
                        isCurrent
                          ? 'text-[var(--hawk)]'
                          : 'text-[var(--muted-strong)] hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <LanguageSwitch />
          <a
            href="https://github.com/hrco/qrc-gen"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--muted-strong)] hover:text-[var(--hawk)] transition-colors"
          >
            {t.header.github}
          </a>
        </div>
      </div>
    </header>
  );
}
