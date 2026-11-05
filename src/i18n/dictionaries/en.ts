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
  nav: {
    label: 'Main',
    home: 'qrc-gen home',
    generator: 'QR generator',
    vizitka: 'Business card',
    autopilot: 'Autopilot',
    pricing: 'Prices',
  },
  // Sales pages. Prices, the e-mail address and the VAT note are not here:
  // they live in src/config/offers.ts so the owner changes them in one place.
  offers: {
    products: {
      wifiPoster: 'Wi-Fi QR poster A4',
      vizitka: 'Web business card',
      website: 'Website',
      hospitalityPack: 'Hospitality pack',
      autopilot: 'Social media autopilot',
    },
    price: {
      plusPerYear: '+ {price} / year',
      plusPerMonth: '+ {price} / month',
      plusPerMonthMaintenance: '+ {price} / month maintenance',
      perMonth: '{price} / month',
      orFreeAfterCall: 'or free after a call with us',
    },
    cta: {
      order: 'Order by e-mail',
      call: 'Call us',
      details: 'See details →',
      ask: 'Ask by e-mail',
    },
    mail: {
      orderSubject: 'Order: {product}',
      orderBody:
        'Hello {brand},\n\nI would like to order: {product}.\n\nBusiness name:\nPlace:\nPhone:\n\nThank you.',
      askSubject: 'Question: {product}',
      askBody: 'Hello {brand},\n\nI have a question about: {product}.\n\n',
    },
    recommended: 'Recommended',
    priceHeading: 'Price',
    contactHeading: 'Questions?',
    contactBody: 'Write to us at {email}. A person answers, not a bot.',
    madeBy: 'An offer by {brand}.',
  },
  vizitka: {
    meta: {
      title: 'Web business card — {brand}',
      description:
        'A one-page web business card for a small business: hours, map, phone, menu and a QR code. 29 € setup, 12 € a year.',
    },
    title: 'Web business card',
    lead: 'One page with all a guest needs. Name, hours, map, phone and your menu. One QR code opens it.',
    includesHeading: 'What is on the card',
    includes: [
      'Business name and one short line',
      'Opening hours',
      'Map with directions',
      'Phone button: one tap to call',
      'Link to your menu or services',
      'A QR code that opens the card',
    ],
    qrHeading: 'Print the QR code once',
    qrBody: [
      'The QR code points to your card, not to the text on it.',
      'New hours, a new phone, a new menu? We update the card.',
      'The printed code stays the same. You never print it again.',
    ],
    freeInPack: 'Free in the Hospitality pack.',
    mock: {
      caption: 'Example card. The business is made up.',
      name: 'Bistro Lipa',
      tagline: 'Home cooking by the river',
      hoursLabel: 'Hours',
      hours: [
        { days: 'Mon–Fri', time: '10:00–22:00' },
        { days: 'Sat–Sun', time: '11:00–23:00' },
      ],
      mapLabel: 'Map',
      directions: 'Directions',
      call: 'Call',
      menu: 'Menu',
      scan: 'Scan to open',
    },
  },
  autopilot: {
    meta: {
      title: 'Social media autopilot — {brand}',
      description:
        '8 short videos a month in your brand. You approve each one, we post them to Instagram and Facebook. 149 € a month, cancel any month.',
    },
    title: 'Social media autopilot',
    lead: 'Short videos every week, in your brand. You approve. We post.',
    cancelAnyMonth: 'Cancel any month.',
    includesHeading: 'What you get',
    includes: [
      '{n} short videos (Reels) per month',
      'Made by our AI studio, in your colours and style',
      'You approve each video by message',
      'We post them to Instagram and Facebook',
    ],
    honest: 'Honest note: we do not promise followers or sales.',
    howHeading: 'How it works',
    steps: [
      { title: 'Send us your brand', body: 'Your logo and 5 photos. That is enough to start.' },
      {
        title: 'Approve the videos',
        body: 'We send you each video by message. Say yes, or tell us what to change.',
      },
      { title: 'We post them', body: 'Approved videos go to Instagram and Facebook on a steady schedule.' },
    ],
    faqHeading: 'Common questions',
    faq: [
      { question: 'Who owns the videos?', answer: 'You do. Use them anywhere you like.' },
      {
        question: 'What do you need from me?',
        answer: 'Your logo, 5 photos and about 10 minutes a month to approve the videos.',
      },
      { question: 'Can I stop?', answer: 'Yes. Cancel any month.' },
    ],
  },
  pricing: {
    meta: {
      title: 'Prices — {brand}',
      description:
        'Prices for Wi-Fi QR posters, web business cards, websites, the hospitality pack and the social media autopilot.',
    },
    title: 'Prices',
    lead: 'Start small or take the whole pack. Pick a card, or ask us.',
    summaries: {
      wifiPoster: 'An A4 poster with a QR code. Guests scan it and join your Wi-Fi.',
      vizitka: 'One page with hours, map, phone and menu. One QR code opens it.',
      website: 'A website with several pages for your business. We keep it running.',
      hospitalityPack: 'For restaurants and bars. All you need in one pack:',
      autopilot: '8 short videos a month on Instagram and Facebook. You approve each one.',
    },
    packIncludes: ['Menu website', 'TV menu board', 'Wi-Fi QR poster', 'Web business card'],
  },
};

export type Dictionary = typeof en;
