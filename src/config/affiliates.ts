/**
 * Single source of truth for all affiliate links. Every monetized link on the
 * site comes from here — never hard-code an affiliate URL in a component.
 */
import type { Locale } from '@/i18n/config';

/**
 * Amazon Associates tracking IDs, one per marketplace. Each marketplace is a
 * separate Associates account, so a tag only earns on its own host.
 */
export const AMAZON_ASSOCIATE_TAGS: Record<string, string> = {
  'amazon.com': 'dnp0c-20',
  'amazon.de': 'roofonthesnow-21',
};

/** i18n key into `dict.affiliates.products`. */
export type AffiliateProductKey = 'qrStickerPaper';

export interface AffiliateProduct {
  key: AffiliateProductKey;
  asin: string;
  /** Marketplace host per site locale, with a fallback. */
  hosts: { default: string } & Partial<Record<Locale, string>>;
}

/** Marker for a product whose real ASIN is not chosen yet. */
export const PLACEHOLDER_ASIN = 'B0PLACEHOLDER';

/**
 * Placeholder ASIN — swap for a real product. Until then the block renders
 * nothing (see `isLive`), so no dead link ships.
 */
export const affiliateProducts: AffiliateProduct[] = [
  {
    key: 'qrStickerPaper',
    asin: PLACEHOLDER_ASIN,
    hosts: { default: 'amazon.com', sl: 'amazon.de' },
  },
];

function hostFor(product: AffiliateProduct, locale: Locale): string {
  return product.hosts[locale] ?? product.hosts.default;
}

/** True when the product has a real ASIN and a tag for its marketplace. */
export function isLive(product: AffiliateProduct, locale: Locale): boolean {
  return (
    product.asin !== PLACEHOLDER_ASIN &&
    Boolean(AMAZON_ASSOCIATE_TAGS[hostFor(product, locale)])
  );
}

/** Build a localized, tag-attributed Amazon product URL. */
export function amazonUrl(product: AffiliateProduct, locale: Locale): string {
  const host = hostFor(product, locale);
  const params = new URLSearchParams({ tag: AMAZON_ASSOCIATE_TAGS[host] });
  return `https://${host}/dp/${product.asin}?${params.toString()}`;
}
