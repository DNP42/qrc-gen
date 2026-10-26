import type { Dictionary } from './en';

/**
 * Slovenian UI strings. Same tone as EN, not a word-for-word translation.
 */
export const sl: Dictionary = {
  meta: {
    title: 'qrc-gen — QR kode iz praznine',
    description:
      'Brezplačen generator QR kod. Povezave, Wi-Fi, vizitke. Po želji logotip ali besedilo na sredini. Brez računov, brez sledenja, brez nakladanja.',
    ogDescription: 'Brezplačen generator QR kod. Brez računov, brez sledenja, brez nakladanja.',
  },
  header: {
    tagline: 'QR kode iz praznine',
    github: 'github →',
    language: 'Jezik',
  },
  hero: {
    title: 'Ustvari QR kode.',
    titleMuted: 'Brez računov. Brez sledenja. Brez nakladanja.',
    intro:
      'Za povezave, Wi-Fi omrežja in vizitke. Dodaj logotip ali besedilo na sredino — popravljanje napak se samodejno okrepi, da se koda še vedno prebere. Ven prideta PNG in SVG.',
  },
  cards: {
    content: 'Vsebina',
    style: 'Slog',
    preview: 'Predogled',
    export: 'Izvoz',
  },
  preview: {
    loading: 'zaganjam matrico…',
  },
  footer: {
    builtBy: 'zgrajeno v praznini · odprta koda · vajb:',
    poweredBy: 'poganja',
  },
  content: {
    tabs: {
      url: 'URL / besedilo',
      wifi: 'Wi-Fi',
      vcard: 'vCard',
    },
    url: {
      label: 'URL ali poljubno besedilo',
      placeholder: 'https://example.com ali karkoli drugega',
      encodedAs: 'Kodirano kot navadno besedilo.',
      charCount: {
        one: '{n} znak',
        two: '{n} znaka',
        few: '{n} znaki',
        other: '{n} znakov',
      },
    },
    wifi: {
      ssid: 'Ime omrežja (SSID)',
      ssidPlaceholder: 'moj-domači-wifi',
      encryption: 'Šifriranje',
      encryptionOptions: {
        WPA: 'WPA / WPA2 / WPA3',
        WEP: 'WEP',
        nopass: 'Brez (odprto)',
      },
      hidden: 'Skrito omrežje',
      yes: 'da',
      no: 'ne',
      password: 'Geslo',
    },
    vcard: {
      firstName: { label: 'Ime', placeholder: 'Ada' },
      lastName: { label: 'Priimek', placeholder: 'Lovelace' },
      organization: { label: 'Organizacija', placeholder: 'Analitični stroj d.o.o.' },
      title: { label: 'Naziv', placeholder: 'Matematičarka' },
      phone: { label: 'Telefon', placeholder: '+386 40 123 456' },
      email: { label: 'E-pošta', placeholder: 'ada@example.com' },
      url: { label: 'Spletna stran', placeholder: 'https://example.com' },
    },
  },
  style: {
    preset: 'Barvna predloga',
    foreground: 'Ospredje',
    background: 'Ozadje',
    dotStyle: 'Oblika pik',
    cornerSquares: 'Kotni kvadrati',
    cornerDots: 'Kotne pike',
    overlay: 'Prekrivni sloj (neobvezno)',
    presets: {
      hawk: 'hawk',
      mono: 'mono',
      inverted: 'obrnjeno',
      cyan: 'cian',
      amber: 'jantar',
      blood: 'kri',
    },
    dotStyles: {
      rounded: 'zaobljeno',
      square: 'kvadratno',
      dots: 'pike',
      classy: 'elegantno',
      'classy-rounded': 'elegantno zaobljeno',
      'extra-rounded': 'zelo zaobljeno',
    },
    cornerSquareStyles: {
      'extra-rounded': 'zelo zaobljeno',
      square: 'kvadratno',
      dot: 'pika',
    },
    cornerDotStyles: {
      dot: 'pika',
      square: 'kvadratno',
    },
    overlayKinds: {
      none: 'brez',
      image: 'slika',
      text: 'besedilo',
    },
    chooseImage: 'Izberi sliko…',
    overlayPreviewAlt: 'predogled prekrivne slike',
    clear: 'počisti',
    textPlaceholder: 'živjo (do 6 znakov)',
    textHint: 'Narisano čez sredino kode. Popravljanje napak samodejno skoči na H.',
    noneHint: 'Gola QR koda. Najgostejši zapis, najhitrejše skeniranje.',
  },
  download: {
    filename: 'Ime datoteke',
    png: 'Prenesi PNG',
    svg: 'Prenesi SVG',
    defaultNames: {
      url: 'qr-koda',
      wifi: 'wifi-qr',
      vcard: 'vizitka-qr',
    },
  },
};
