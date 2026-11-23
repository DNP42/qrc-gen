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
    title: 'qrc-gen — Free QR Code Generator',
    description:
      'Free QR code generator. URLs, Wi-Fi, vCards. Optional logo or text overlay. No accounts. No tracking.',
    ogDescription: 'Free QR code generator. No accounts. No tracking.',
  },
  header: {
    tagline: 'Free QR code generator',
    github: 'github →',
    language: 'Language',
  },
  hero: {
    title: 'Generate QR codes.',
    titleMuted: 'No accounts. No tracking. No data collected.',
    intro:
      'Built for URLs, Wi-Fi networks, and contact cards. Add a logo or center text. Error correction adjusts automatically so the code still scans. PNG and SVG output.',
  },
  cards: {
    content: 'Content',
    style: 'Style',
    preview: 'Preview',
    export: 'Export',
  },
  preview: {
    loading: 'Generating…',
  },
  footer: {
    builtBy: 'Open source · built by',
    poweredBy: 'powered by',
    home: 'donotpanic.space',
    source: 'source →',
    kofi: 'Free forever. Support the project',
  },
  // Unknown URLs have no language, so global-not-found.tsx shows every
  // language's block one after the other.
  notFound: {
    heading: 'Page not found.',
    body: 'The page you requested does not exist.',
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
    paddingHint: 'Quiet zone around the code. Too small and some scanners will fail.',
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
    textPlaceholder: 'text (max 6 chars)',
    textHint: 'Drawn over the QR center. Error correction auto-bumps to H.',
    gradient: 'Gradient',
    gradientOn: 'use gradient',
    gradientFrom: 'From',
    gradientTo: 'To',
    gradientTypes: { linear: 'linear', radial: 'radial' },
    gradientHint: 'Keep both colors clearly darker or lighter than the background, or the code will not scan.',
    imageMargin: 'Logo margin',
    noneHint: 'Plain QR. Densest encoding, scans fastest.',
  },
  caption: {
    title: 'Caption (optional)',
    text: 'Caption text',
    placeholder: 'e.g. Kraljičina pesem',
    hint: 'Drawn around the code, not encoded. Keep it short; long text is cut with an ellipsis.',
    style: 'Label style',
    styles: { none: 'none', text: 'plain text', bar: 'bar' },
    position: 'Position',
    positions: { above: 'above', below: 'below' },
    align: 'Alignment',
    aligns: { left: 'left', center: 'center', right: 'right' },
    font: 'Font',
    fontSize: 'Font size',
    fontSizeValue: '{n} px',
    barColor: 'Bar color',
    textColor: 'Text color',
    resetColors: 'use QR colors',
  },
  affiliates: {
    heading: 'Take it offline',
    blurb: 'Gear for printing and displaying QR codes.',
    disclosure: 'As an Amazon Associate we earn from qualifying purchases.',
  },
  moreFrom: {
    heading: 'More from DoNotPanic',
    links: {
      hub: { label: 'Web + DNS setup', note: 'Paid setup for your site and domain.' },
      links: { label: 'Links', note: 'All DoNotPanic projects in one place.' },
      dj: { label: 'DJ', note: 'Music and mixes.' },
      qttt: { label: 'Quantum tic-tac-toe', note: 'A game to play.' },
    },
  },
  download: {
    filename: 'Filename',
    png: 'Download PNG',
    svg: 'Download SVG',
    captionError: 'Could not build the captioned file. Try again.',
    // ASCII only: the download sanitizer replaces anything else with '-'.
    defaultNames: {
      url: 'qrcode',
      wifi: 'wifi-qr',
      vcard: 'vcard-qr',
    } satisfies Record<ContentType, string>,
  },
};

export type Dictionary = typeof en;
