import type { Locale } from '@/i18n/config';

/**
 * Everything the owner may need to change on the sales pages lives here:
 * prices, contact details and the VAT note. The copy around these values is
 * in the i18n dictionaries; the numbers are not, so they change in one place.
 *
 * Prices are whole euros. Stripe is not live, so every order button is a
 * mailto: link to CONTACT_EMAIL.
 */

export const BRAND_NAME = 'Ekipa DNP';

export const CONTACT_EMAIL = 'donotpanic.space@gmail.com';

/**
 * Phone number for the "Call us" button, in international format
 * (e.g. '+386 40 123 456'). While it is null the button stays hidden.
 * TODO owner: set the phone number.
 */
export const CONTACT_PHONE: string | null = null;

// TODO owner: confirm VAT status (are you a VAT payer? then say "DDV je vključen" or add it).
export const VAT_NOTE: Record<Locale, string> = {
  sl: 'Cene so brez DDV.',
  en: 'Prices exclude VAT.',
};

// TODO owner: confirm final prices.
export const PRICES = {
  wifiPoster: { setupEur: 29 },
  vizitka: { setupEur: 29, yearlyEur: 12 },
  website: { setupEur: 390, monthlyEur: 19 },
  hospitalityPack: { setupEur: 490, monthlyEur: 29 },
  autopilot: { monthlyEur: 149, videosPerMonth: 8 },
} as const;

/** "29 €" in both languages: the audience is Slovenian, so the € goes after. */
export function formatEur(amountEur: number): string {
  return `${amountEur} €`;
}

/** A mailto: link to CONTACT_EMAIL with the subject and body filled in. */
export function buildOrderMailto(subject: string, body: string): string {
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${CONTACT_EMAIL}?${query}`;
}

/** A tel: link with spaces and dashes removed, or null while no phone is set. */
export function buildPhoneHref(): string | null {
  if (!CONTACT_PHONE) return null;
  return `tel:${CONTACT_PHONE.replace(/[\s-]/g, '')}`;
}
