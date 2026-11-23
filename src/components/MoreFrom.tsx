import { useDict } from '@/i18n/I18nProvider';

const LINKS = [
  { key: 'hub', href: 'https://donotpanic.space/hub.html' },
  { key: 'links', href: 'https://donotpanic.space/links.html' },
  { key: 'dj', href: 'https://donotpanic.space/dj/' },
  { key: 'qttt', href: 'https://qttt.donotpanic.space' },
] as const;

export function MoreFrom() {
  const t = useDict().moreFrom;
  return (
    <section className="max-w-6xl w-full mx-auto px-6 pb-2" aria-labelledby="more-from">
      <h3 id="more-from" className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
        {t.heading}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LINKS.map((l) => (
          <li key={l.key}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-xs text-[var(--muted)] hover:border-[var(--hawk)] transition-colors"
            >
              <span className="block text-sm text-[var(--hawk)]">{t.links[l.key].label}</span>
              <span className="block mt-1">{t.links[l.key].note}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
