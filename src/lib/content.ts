/**
 * What the user typed on the Content card, for all three tabs at once.
 *
 * The payload strings come from formatters.ts (unchanged); this file only
 * keeps the form state together so it can be saved and restored.
 */
import {
  encodeUrl,
  encodeVCard,
  encodeWifi,
  type UrlInput,
  type VCardInput,
  type WifiInput,
} from '@/lib/formatters';
import { DEFAULT_CONFIG } from '@/lib/qr';

export type ContentType = 'url' | 'wifi' | 'vcard';

export const CONTENT_TYPES: ContentType[] = ['url', 'wifi', 'vcard'];

export interface ContentState {
  type: ContentType;
  url: UrlInput;
  wifi: WifiInput;
  vcard: VCardInput;
}

export const DEFAULT_CONTENT: ContentState = {
  type: 'url',
  url: { text: DEFAULT_CONFIG.data },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  vcard: { firstName: '', lastName: '', organization: '', title: '', phone: '', email: '', url: '' },
};

/** The string the QR encodes for the active tab. */
export function encodeContent(content: ContentState): string {
  switch (content.type) {
    case 'wifi':
      return encodeWifi(content.wifi);
    case 'vcard':
      return encodeVCard(content.vcard);
    case 'url':
      return encodeUrl(content.url);
  }
}
