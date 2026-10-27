import type { ContentType } from '@/components/ContentTabs';
import type { VCardInput, WifiEncryption } from '@/lib/formatters';
import type { CornerDotStyle, CornerSquareStyle, DotStyle } from '@/lib/qr';
import type { PluralForms } from '../format';

type Field = { label: string; placeholder: string };

const charCount: PluralForms = { one: '{n} char', other: '{n} chars' };

/**
 * English UI strings: the source of truth for the dictionary shape.
 * `sl.ts` is typed as `Dictionary`, so a missing or extra key fails the build.
 * Values that get encoded (Wi-Fi encryption, style ids) are keys here; only
 * their display labels are translated.
 */
export const en = {
  meta: {
    title: 'qrc-gen — QR codes from the void',
    description:
      'Free QR code generator. URLs, Wi-Fi, vCards. Optional logo or text in the middle. No accounts, no tracking, no bullshit.',
    ogDescription: 'Free QR code generator. No accounts, no tracking, no bullshit.',
  },
  header: {
    tagline: 'QR codes from the void',
    github: 'github →',
    language: 'Language',
  },
  hero: {
    title: 'Generate QR codes.',
    titleMuted: 'No accounts. No tracking. No bullshit.',
    intro:
      'Built for URLs, Wi-Fi networks, and contact cards. Drop in a logo or center text — error correction auto-bumps so it still scans. PNG and SVG out.',
  },
  cards: {
    content: 'Content',
    style: 'Style',
    preview: 'Preview',
    export: 'Export',
  },
  preview: {
    loading: 'booting matrix…',
  },
  footer: {
    builtBy: 'built in the void · open source · vibe by',
    poweredBy: 'powered by',
  },
  // Unknown URLs have no language, so global-not-found.tsx shows every
  // language's block one after the other.
  notFound: {
    heading: 'Signal lost.',
    body: 'No such page. We checked the void twice.',
    back: 'back to the generator →',
  },
  content: {
    tabs: {
      url: 'URL / Text',
      wifi: 'Wi-Fi',
      vcard: 'vCard',
    } satisfies Record<ContentType, string>,
    url: {
      label: 'URL or any text',
      placeholder: 'https://example.com or any string',
      encodedAs: 'Encoded as plain text.',
      charCount,
    },
    wifi: {
      ssid: 'Network name (SSID)',
      ssidPlaceholder: 'my-home-wifi',
      encryption: 'Encryption',
      encryptionOptions: {
        WPA: 'WPA / WPA2 / WPA3',
        WEP: 'WEP',
        nopass: 'None (open)',
      } satisfies Record<WifiEncryption, string>,
      hidden: 'Hidden network',
      yes: 'yes',
      no: 'no',
      password: 'Password',
    },
    vcard: {
      firstName: { label: 'First name', placeholder: 'Ada' },
      lastName: { label: 'Last name', placeholder: 'Lovelace' },
      organization: { label: 'Organization', placeholder: 'Analytical Engine Co.' },
      title: { label: 'Title', placeholder: 'Mathematician' },
      phone: { label: 'Phone', placeholder: '+1 555 0100' },
      email: { label: 'Email', placeholder: 'ada@example.com' },
      url: { label: 'Website', placeholder: 'https://example.com' },
    } satisfies Record<keyof VCardInput, Field>,
  },
  style: {
    preset: 'Color preset',
    foreground: 'Foreground',
    background: 'Background',
    dotStyle: 'Dot style',
    cornerSquares: 'Corner squares',
    cornerDots: 'Corner dots',
    padding: 'Padding',
    paddingHint: 'Quiet zone around the code. Starve it and phones give up.',
    paddingValue: '{n} px',
    overlay: 'Overlay (optional)',
    presets: {
      hawk: 'hawk',
      mono: 'mono',
      inverted: 'inverted',
      cyan: 'cyan',
      amber: 'amber',
      blood: 'blood',
    },
    dotStyles: {
      rounded: 'rounded',
      square: 'square',
      dots: 'dots',
      classy: 'classy',
      'classy-rounded': 'classy-rounded',
      'extra-rounded': 'extra-rounded',
    } satisfies Record<DotStyle, string>,
    cornerSquareStyles: {
      'extra-rounded': 'extra-rounded',
      square: 'square',
      dot: 'dot',
    } satisfies Record<CornerSquareStyle, string>,
    cornerDotStyles: {
      dot: 'dot',
      square: 'square',
    } satisfies Record<CornerDotStyle, string>,
    overlayKinds: {
      none: 'none',
      image: 'image',
      text: 'text',
    },
    chooseImage: 'Choose image…',
    overlayPreviewAlt: 'overlay preview',
    clear: 'clear',
    textPlaceholder: 'hi (max 6 chars)',
    textHint: 'Drawn over the QR center. Error correction auto-bumps to H.',
    noneHint: 'Plain QR. Densest encoding, scans fastest.',
  },
  download: {
    filename: 'Filename',
    png: 'Download PNG',
    svg: 'Download SVG',
    // ASCII only: the download sanitizer replaces anything else with '-'.
    defaultNames: {
      url: 'qrcode',
      wifi: 'wifi-qr',
      vcard: 'vcard-qr',
    } satisfies Record<ContentType, string>,
  },
};

export type Dictionary = typeof en;
