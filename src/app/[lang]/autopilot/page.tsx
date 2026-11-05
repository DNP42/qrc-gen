import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OfferShell } from '@/components/offers/OfferShell';
import { OrderActions } from '@/components/offers/OrderActions';
import { PriceTag } from '@/components/offers/PriceTag';
import { BRAND_NAME, PRICES, formatEur } from '@/config/offers';
import { hasLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/format';
import { getDictionary } from '@/i18n/get-dictionary';
import { buildSubpageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/autopilot'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return buildSubpageMetadata({
    lang,
    slug: 'autopilot',
    title: interpolate(t.autopilot.meta.title, { brand: BRAND_NAME }),
    description: t.autopilot.meta.description,
  });
}

export default async function AutopilotPage({ params }: PageProps<'/[lang]/autopilot'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const page = t.autopilot;
  const price = PRICES.autopilot;

  return (
    <OfferShell lang={lang} t={t} title={page.title} lead={page.lead}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
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
                <span>{interpolate(line, { n: price.videosPerMonth })}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--muted-strong)]">{page.honest}</p>
        </section>

        <section
          aria-labelledby="price-heading"
          className="rounded-xl border border-[var(--hawk-dim)] bg-[var(--surface)] p-5 space-y-4"
        >
          <h2 id="price-heading" className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted-strong)]">
            {t.offers.priceHeading}
          </h2>
          <PriceTag
            main={interpolate(t.offers.price.perMonth, { price: formatEur(price.monthlyEur) })}
            detail={page.cancelAnyMonth}
          />
          <OrderActions t={t} product="autopilot" />
        </section>
      </div>

      <section aria-labelledby="how-heading" className="space-y-4">
        <h2 id="how-heading" className="text-xl font-semibold">
          {page.howHeading}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {page.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2"
            >
              <span aria-hidden="true" className="font-mono text-sm text-[var(--hawk)]">
                {`0${index + 1}`}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-[var(--muted-strong)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq-heading" className="space-y-4">
        <h2 id="faq-heading" className="text-xl font-semibold">
          {page.faqHeading}
        </h2>
        <div className="space-y-4">
          {page.faq.map(({ question, answer }) => (
            <div key={question}>
              <h3 className="font-semibold">{question}</h3>
              <p className="text-[var(--muted-strong)]">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </OfferShell>
  );
}
