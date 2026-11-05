import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildProductMailto, type ProductKey } from '@/components/offers/OrderActions';
import { OfferShell } from '@/components/offers/OfferShell';
import { PriceTag } from '@/components/offers/PriceTag';
import { BRAND_NAME, PRICES, formatEur } from '@/config/offers';
import { hasLocale, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { interpolate } from '@/i18n/format';
import { getDictionary } from '@/i18n/get-dictionary';
import { buildSubpageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/cenik'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return buildSubpageMetadata({
    lang,
    slug: 'cenik',
    title: interpolate(t.pricing.meta.title, { brand: BRAND_NAME }),
    description: t.pricing.meta.description,
  });
}

interface PriceCard {
  product: ProductKey;
  mainPrice: string;
  priceDetail?: string;
  /** An internal page, or null to order by e-mail. */
  pagePath: string | null;
  isRecommended?: boolean;
}

function buildPriceCards(t: Dictionary, lang: Locale): PriceCard[] {
  const price = t.offers.price;
  return [
    {
      product: 'wifiPoster',
      mainPrice: formatEur(PRICES.wifiPoster.setupEur),
      priceDetail: price.orFreeAfterCall,
      pagePath: null,
    },
    {
      product: 'vizitka',
      mainPrice: formatEur(PRICES.vizitka.setupEur),
      priceDetail: interpolate(price.plusPerYear, { price: formatEur(PRICES.vizitka.yearlyEur) }),
      pagePath: `/${lang}/vizitka`,
    },
    {
      product: 'website',
      mainPrice: formatEur(PRICES.website.setupEur),
      priceDetail: interpolate(price.plusPerMonthMaintenance, {
        price: formatEur(PRICES.website.monthlyEur),
      }),
      pagePath: null,
    },
    {
      product: 'hospitalityPack',
      mainPrice: formatEur(PRICES.hospitalityPack.setupEur),
      priceDetail: interpolate(price.plusPerMonth, {
        price: formatEur(PRICES.hospitalityPack.monthlyEur),
      }),
      pagePath: null,
      isRecommended: true,
    },
    {
      product: 'autopilot',
      mainPrice: interpolate(price.perMonth, { price: formatEur(PRICES.autopilot.monthlyEur) }),
      pagePath: `/${lang}/autopilot`,
    },
  ];
}

export default async function PricingPage({ params }: PageProps<'/[lang]/cenik'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const page = t.pricing;

  return (
    <OfferShell lang={lang} t={t} title={page.title} lead={page.lead}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {buildPriceCards(t, lang).map((card) => (
          <li
            key={card.product}
            className={`relative flex flex-col gap-4 rounded-xl border bg-[var(--surface)] p-5 ${
              card.isRecommended
                ? 'border-[var(--hawk)] shadow-[0_0_28px_rgba(57,255,122,0.16)]'
                : 'border-[var(--border)]'
            }`}
          >
            {card.isRecommended && (
              <p className="self-start rounded-full bg-[var(--hawk)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-black">
                {t.offers.recommended}
              </p>
            )}
            <h2 className="text-lg font-semibold">{t.offers.products[card.product]}</h2>
            <p className="text-sm text-[var(--muted-strong)]">{page.summaries[card.product]}</p>
            {card.product === 'hospitalityPack' && (
              <ul className="space-y-1 text-sm">
                {page.packIncludes.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--hawk)]">
                      {'›'}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto space-y-4">
              <PriceTag main={card.mainPrice} detail={card.priceDetail} />
              {card.pagePath ? (
                <Link href={card.pagePath} className="btn btn-ghost w-full">
                  {t.offers.cta.details}
                </Link>
              ) : (
                <a href={buildProductMailto(t, card.product)} className="btn btn-primary w-full">
                  {t.offers.cta.order}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </OfferShell>
  );
}
