import { BRAND_NAME, buildOrderMailto, buildPhoneHref } from '@/config/offers';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { interpolate } from '@/i18n/format';

export type ProductKey = keyof Dictionary['offers']['products'];

/** The order e-mail link for one product, subject and body prefilled. */
export function buildProductMailto(t: Dictionary, product: ProductKey): string {
  const values = { product: t.offers.products[product], brand: BRAND_NAME };
  return buildOrderMailto(
    interpolate(t.offers.mail.orderSubject, values),
    interpolate(t.offers.mail.orderBody, values),
  );
}

/**
 * "Order by e-mail", plus "Call us" once CONTACT_PHONE is set in
 * src/config/offers.ts. Stripe is not live, so ordering is an e-mail.
 */
export function OrderActions({ t, product }: { t: Dictionary; product: ProductKey }) {
  const phoneHref = buildPhoneHref();

  return (
    <div className="flex flex-wrap gap-3">
      <a href={buildProductMailto(t, product)} className="btn btn-primary">
        {t.offers.cta.order}
      </a>
      {phoneHref && (
        <a href={phoneHref} className="btn btn-ghost">
          {t.offers.cta.call}
        </a>
      )}
    </div>
  );
}
