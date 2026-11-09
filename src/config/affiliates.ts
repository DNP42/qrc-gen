/**
 * Single source of truth for all affiliate links. Every monetized link on the
 * site comes from here — never hard-code an affiliate URL in a component.
 */
import type { Locale } from '@/i18n/config';

/**
 * Placeholder Amazon Associates tag. Replace with the real tag before going
 * live; do NOT ship a fabricated tag.
 */
export const AMAZON_ASSOCIATE_TAG = 'YOUR_AMAZON_ASSOCIATE_TAG';

/** i18n key into `dict.affiliates.products`. */
export type AffiliateProductKey = 'qrStickerPaper';

export interface AffiliateProduct {
  key: AffiliateProductKey;
  asin: string;
  /** Marketplace host per site locale, with a fallback. */
  hosts: { default: string } & Partial<Record<Locale, string>>;
}

/**
 * Placeholder ASIN — swap for a real product when the associate tag is set.
 */
export const affiliateProducts: AffiliateProduct[] = [
  {
    key: 'qrStickerPaper',
    asin: 'B0PLACEHOLDER',
    hosts: { default: 'amazon.com', sl: 'amazon.de' },
  },
];

/** Build a localized, tag-attributed Amazon product URL. */
export function amazonUrl(product: AffiliateProduct, locale: Locale): string {
  const host = product.hosts[locale] ?? product.hosts.default;
  const params = new URLSearchParams({ tag: AMAZON_ASSOCIATE_TAG });
  return `https://${host}/dp/${product.asin}?${params.toString()}`;
}
