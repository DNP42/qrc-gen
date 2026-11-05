import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { BRAND_NAME, CONTACT_EMAIL, VAT_NOTE, buildPhoneHref } from '@/config/offers';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { interpolate } from '@/i18n/format';
import { I18nProvider } from '@/i18n/I18nProvider';

/**
 * Frame for the sales pages: the generator's header and footer, the page's
 * own h1 and lead, and a contact block with the VAT note at the end.
 */
export function OfferShell({
  lang,
  t,
  title,
  lead,
  children,
}: {
  lang: Locale;
  t: Dictionary;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  const phoneHref = buildPhoneHref();

  return (
    <I18nProvider locale={lang} dict={t}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-base text-[var(--muted-strong)] max-w-2xl">{lead}</p>
          </div>

          {children}

          <section
            aria-labelledby="contact-heading"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2"
          >
            <h2 id="contact-heading" className="text-lg font-semibold">
              {t.offers.contactHeading}
            </h2>
            <p className="text-sm text-[var(--muted-strong)]">
              {interpolate(t.offers.contactBody, { email: CONTACT_EMAIL })}
            </p>
            {phoneHref && (
              <a href={phoneHref} className="btn btn-ghost">
                {t.offers.cta.call}
              </a>
            )}
            <p className="font-mono text-xs text-[var(--muted-strong)]">
              {interpolate(t.offers.madeBy, { brand: BRAND_NAME })} {VAT_NOTE[lang]}
            </p>
          </section>
        </main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}
