import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OfferShell } from '@/components/offers/OfferShell';
import { OrderActions } from '@/components/offers/OrderActions';
import { PriceTag } from '@/components/offers/PriceTag';
import { VizitkaMock } from '@/components/offers/VizitkaMock';
import { BRAND_NAME, PRICES, formatEur } from '@/config/offers';
import { hasLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/format';
import { getDictionary } from '@/i18n/get-dictionary';
import { buildSubpageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/vizitka'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return buildSubpageMetadata({
    lang,
    slug: 'vizitka',
    title: interpolate(t.vizitka.meta.title, { brand: BRAND_NAME }),
    description: t.vizitka.meta.description,
  });
}

export default async function VizitkaPage({ params }: PageProps<'/[lang]/vizitka'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const page = t.vizitka;
  const price = PRICES.vizitka;

  return (
    <OfferShell lang={lang} t={t} title={page.title} lead={page.lead}>
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="space-y-10">
          <section aria-labelledby="includes-heading" className="space-y-3">
            <h2 id="includes-heading" className="text-xl font-semibold">
              {page.includesHeading}
            </h2>
            <ul className="space-y-2">
              {page.includes.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="text-[var(--hawk)]">
                    {'›'}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="qr-heading" className="space-y-3">
            <h2 id="qr-heading" className="text-xl font-semibold">
              {page.qrHeading}
            </h2>
            {page.qrBody.map((line) => (
              <p key={line} className="text-[var(--muted-strong)]">
                {line}
              </p>
            ))}
          </section>

          <section
            aria-labelledby="price-heading"
            className="rounded-xl border border-[var(--hawk-dim)] bg-[var(--surface)] p-5 space-y-4"
          >
            <h2 id="price-heading" className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted-strong)]">
              {t.offers.priceHeading}
            </h2>
            <PriceTag
              main={formatEur(price.setupEur)}
              detail={interpolate(t.offers.price.plusPerYear, { price: formatEur(price.yearlyEur) })}
            />
            <p className="text-sm">{page.freeInPack}</p>
            <OrderActions t={t} product="vizitka" />
          </section>
        </div>

        <VizitkaMock t={page.mock} />
      </div>
    </OfferShell>
  );
}
