import items from '@/config/affiliates.json';
import { useDict } from '@/i18n/I18nProvider';

interface AffiliateItem {
  name: string;
  url: string;
  image: string;
  note: string;
  enabled: boolean;
}

/**
 * Data-driven product slots. Edit src/config/affiliates.json; nothing renders
 * (and no disclosure shows) until at least one item has enabled: true.
 */
export function AffiliateBlock() {
  const t = useDict();
  const live = (items as AffiliateItem[]).filter((i) => i.enabled && i.url);

  if (live.length === 0) return null;

  return (
    <aside className="max-w-6xl w-full mx-auto px-6 pb-2">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 font-mono text-xs text-[var(--muted)]">
        <h3 className="uppercase tracking-[0.2em] mb-1">{t.affiliates.heading}</h3>
        <p className="mb-4">{t.affiliates.blurb}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {live.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 min-h-8 hover:border-[var(--hawk)] transition-colors"
              >
                {item.image && (
                  <img src={item.image} alt="" className="w-12 h-12 object-contain rounded bg-white" />
                )}
                <span>
                  <span className="block text-[var(--foreground)]">{item.name}</span>
                  <span className="block">{item.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">{t.affiliates.disclosure}</p>
      </div>
    </aside>
  );
}
