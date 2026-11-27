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
    design: 'Design',
    title: 'Title',
    caption: 'Caption',
    logo: 'Logo / center',
    preview: 'Preview',
    export: 'Export',
    empty: 'empty',
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
  legal: {
    back: '← back to the generator',
    navLabel: 'Legal',
    nav: { privacy: 'Privacy', imprint: 'Imprint', terms: 'Terms' },
    updated: 'Last updated: {date}',
    pages: {
      privacy: {
        title: 'Privacy policy',
        intro:
          'qrc-gen is a free tool. It does not ask you to sign in, and it does not collect your data. This page explains what happens anyway.',
        sections: [
          {
            heading: 'What stays in your browser',
            body: [
              'Everything you type (links, Wi-Fi details, contact details, titles, captions, logos) is turned into a QR code inside your browser. It is never sent to a server.',
              'The fonts used for titles and captions are served from this site, not from a third party.',
            ],
          },
          {
            heading: 'Cookies and storage',
            body: [
              'This site sets no cookies and uses no analytics, advertising or tracking tools. For that reason it shows no cookie banner.',
              'If you press Save on a code, your browser keeps that design on your device (local storage). It is never sent to the operator or anyone else. You can delete it in the app, or by clearing this site\'s data in your browser. Storage you ask for yourself does not need consent. Wi-Fi passwords are never saved.',
            ],
          },
          {
            heading: 'Hosting',
            body: [
              'This site is hosted on Vercel. When you open a page, Vercel\'s servers process technical data such as your IP address, browser type and the time of the request, to deliver the site and keep it secure. The operator uses this data only to run and secure the site. Legal basis: legitimate interest in running a secure website (Art. 6(1)(f) GDPR).',
            ],
          },
          {
            heading: 'Links to other sites',
            body: [
              'The site links to GitHub, Ko-fi and other pages of DoNotPanic and, where shown, to Amazon. Following a link leaves this site, and the privacy policy of that site applies. Affiliate links are marked, and the operator may earn a commission on qualifying purchases.',
            ],
          },
          {
            heading: 'Your rights',
            body: [
              'Under the GDPR you may ask for access to, correction or deletion of personal data held about you, and you may object to its processing. This site does not collect personal data itself, so there is usually nothing to hand over. You can still write to the contact address in the imprint. You may also complain to your national data protection authority.',
            ],
          },
          {
            heading: 'Changes',
            body: [
              'If this changes, for example if analytics were added, this page is updated first and the date above changes.',
            ],
          },
        ],
      },
      imprint: {
        title: 'Imprint',
        intro: 'Information about who runs this site.',
        sections: [
          {
            heading: 'Operator',
            body: [
              'Name: [operator name, to be completed by the owner]',
              'Address: [postal address, to be completed by the owner]',
              'Status: [for example sole trader or company, to be completed by the owner]',
            ],
          },
          { heading: 'Contact', body: ['Email: [contact email, to be completed by the owner]'] },
          { heading: 'Tax', body: ['VAT ID: [if applicable, to be completed by the owner]'] },
          { heading: 'Hosting', body: ['Vercel Inc., USA.'] },
        ],
      },
      terms: {
        title: 'Terms of use',
        intro: 'qrc-gen is free to use. By using it you agree to these terms.',
        sections: [
          {
            heading: 'The service',
            body: [
              'qrc-gen creates QR codes in your browser. It is provided as is, without warranty of any kind, and may change or stop at any time.',
            ],
          },
          {
            heading: 'Your content',
            body: [
              'You decide what a code contains. You are responsible for it, for having the right to use any logo or text you add, and for what the code links to. Do not use the tool for unlawful, deceptive or harmful content, including links to malware or phishing.',
            ],
          },
          {
            heading: 'Check before you print',
            body: [
              'Always scan a code with more than one device before you print or publish it. Colors, logos, padding and rounded corners can make a code harder to read. The operator is not responsible for printed codes that do not scan.',
            ],
          },
          {
            heading: 'Liability',
            body: [
              'To the extent allowed by law, the operator is not liable for damages arising from the use of the tool or from codes made with it. Nothing in these terms limits liability that cannot be limited by law.',
            ],
          },
          {
            heading: 'Third-party software and links',
            body: [
              'The QR drawing uses the open-source library qr-code-styling. The caption fonts are open fonts under the SIL Open Font License. Links to other sites are not under the operator\'s control.',
            ],
          },
          {
            heading: 'Affiliate links',
            body: ['Some links may be affiliate links. As an Amazon Associate we earn from qualifying purchases.'],
          },
          {
            heading: 'Governing law',
            body: ['These terms are governed by the law of [country of the operator, to be completed by the owner].'],
          },
        ],
      },
    },
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
  controls: {
    decrease: 'Decrease {label}',
    increase: 'Increase {label}',
    unit: 'px',
  },
  title: {
    label: 'Title (above the code)',
    placeholder: 'e.g. Café Luna',
  },
  caption: {
    label: 'Caption (below the code)',
    placeholder: 'e.g. Scan for the menu\nOpen daily 8–22',
  },
  textBlock: {
    hint: 'Drawn around the code, not encoded. Press Enter for a new line (up to 6 lines). A line that is too wide is cut with an ellipsis.',
    font: 'Font',
    size: 'Size',
    align: 'Alignment',
    aligns: { left: 'left', center: 'center', right: 'right' },
    color: 'Text color',
    resetColor: 'use QR colors',
  },
  frame: {
    style: 'Frame',
    styles: { bar: 'bar', plain: 'plain' },
    barColor: 'Bar color',
    resetColor: 'use QR colors',
    outerRadius: 'Outer corner radius',
    innerRadius: 'QR corner radius',
    hint: 'The frame and corners show once a title or caption is set. The QR corner radius is capped by the padding, so the code stays scannable.',
  },
  saved: {
    title: 'My codes',
    count: '{n} saved',
    nameLabel: 'Name',
    save: 'Save this code',
    saved: 'Saved.',
    saveFailed: 'Could not save this code. Try again.',
    empty: 'Nothing saved yet.',
    privacyNote: 'Saved only in this browser. Never sent anywhere.',
    wifiNotice: 'Wi-Fi passwords are never saved.',
    logoDropped: 'The logo was too large and was not saved.',
    load: 'Load',
    delete: 'Delete',
    loadAria: 'Load {name}',
    deleteAria: 'Delete {name}',
    exportBackup: 'Export backup',
    importBackup: 'Import backup',
    imported: '{n} imported.',
    importError: 'That file is not a qrc-gen backup.',
    limit: 'Up to {n} codes. Delete one to save another.',
    full: 'Browser storage is full. Delete a code and try again.',
    blocked: 'This browser blocks local storage, so codes cannot be saved.',
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
