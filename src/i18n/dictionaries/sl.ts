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
  notFound: {
    heading: 'Signala ni.',
    body: 'Te strani ni. Praznino smo preverili dvakrat.',
    back: 'nazaj na generator →',
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
    padding: 'Odmik',
    paddingHint: 'Tiha cona okoli kode. Pretesno, pa telefon obupa.',
    paddingValue: '{n} px',
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
  nav: {
    label: 'Glavni meni',
    home: 'qrc-gen domov',
    generator: 'QR generator',
    vizitka: 'Vizitka',
    autopilot: 'Autopilot',
    pricing: 'Cenik',
  },
  offers: {
    products: {
      wifiPoster: 'Wi-Fi QR plakat A4',
      vizitka: 'Spletna vizitka',
      website: 'Spletna stran',
      hospitalityPack: 'Gostinski paket',
      autopilot: 'Autopilot za družbena omrežja',
    },
    price: {
      plusPerYear: '+ {price} / leto',
      plusPerMonth: '+ {price} / mesec',
      plusPerMonthMaintenance: '+ {price} / mesec vzdrževanje',
      perMonth: '{price} / mesec',
      orFreeAfterCall: 'ali brezplačno po pogovoru z nami',
    },
    cta: {
      order: 'Naroči po e-pošti',
      call: 'Pokliči nas',
      details: 'Več o tem →',
      ask: 'Vprašaj po e-pošti',
    },
    mail: {
      orderSubject: 'Naročilo: {product}',
      orderBody:
        'Pozdravljeni, {brand}!\n\nŽelim naročiti: {product}.\n\nIme podjetja:\nKraj:\nTelefon:\n\nHvala.',
      askSubject: 'Vprašanje: {product}',
      askBody: 'Pozdravljeni, {brand}!\n\nZanima me: {product}.\n\n',
    },
    recommended: 'Priporočamo',
    priceHeading: 'Cena',
    contactHeading: 'Vprašanja?',
    contactBody: 'Pišite nam na {email}. Odgovori človek, ne robot.',
    madeBy: 'Ponudba ekipe {brand}.',
  },
  vizitka: {
    meta: {
      title: 'Spletna vizitka — {brand}',
      description:
        'Spletna vizitka na eni strani za mala podjetja: urnik, zemljevid, telefon, meni in QR koda. 29 € za postavitev, 12 € na leto.',
    },
    title: 'Spletna vizitka',
    lead: 'Ena stran z vsem, kar gost potrebuje. Ime, urnik, zemljevid, telefon in vaš meni. Ena QR koda jo odpre.',
    includesHeading: 'Kaj je na vizitki',
    includes: [
      'Ime podjetja in en kratek stavek',
      'Odpiralni čas',
      'Zemljevid z navodili za pot',
      'Gumb za klic: en dotik in kliče',
      'Povezava do menija ali storitev',
      'QR koda, ki odpre vizitko',
    ],
    qrHeading: 'QR kodo natisnete enkrat',
    qrBody: [
      'QR koda kaže na vašo vizitko, ne na besedilo na njej.',
      'Nov urnik, nova številka, nov meni? Mi posodobimo vizitko.',
      'Natisnjena koda ostane ista. Ni vam je treba tiskati znova.',
    ],
    freeInPack: 'Brezplačno v Gostinskem paketu.',
    mock: {
      caption: 'Primer vizitke. Lokal je izmišljen.',
      name: 'Bistro Lipa',
      tagline: 'Domača kuhinja ob reki',
      hoursLabel: 'Odprto',
      hours: [
        { days: 'pon–pet', time: '10:00–22:00' },
        { days: 'sob–ned', time: '11:00–23:00' },
      ],
      mapLabel: 'Zemljevid',
      directions: 'Pot do nas',
      call: 'Pokliči',
      menu: 'Meni',
      scan: 'Skeniraj in odpri',
    },
  },
  autopilot: {
    meta: {
      title: 'Autopilot za družbena omrežja — {brand}',
      description:
        '8 kratkih videov na mesec v vaši podobi. Vsakega potrdite, mi ga objavimo na Instagramu in Facebooku. 149 € na mesec, odpoved kadarkoli.',
    },
    title: 'Autopilot za družbena omrežja',
    lead: 'Kratki videi vsak teden, v vaši podobi. Vi potrdite. Mi objavimo.',
    cancelAnyMonth: 'Odpoveste lahko vsak mesec.',
    includesHeading: 'Kaj dobite',
    includes: [
      '{n} kratkih videov (Reels) na mesec',
      'Naredi jih naš AI studio, v vaših barvah in slogu',
      'Vsak video potrdite s sporočilom',
      'Objavimo jih na Instagramu in Facebooku',
    ],
    honest: 'Pošteno povedano: ne obljubljamo sledilcev ali prodaje.',
    howHeading: 'Kako deluje',
    steps: [
      { title: 'Pošljite nam svojo podobo', body: 'Logotip in 5 fotografij. To je dovolj za začetek.' },
      {
        title: 'Potrdite videe',
        body: 'Vsak video vam pošljemo v sporočilu. Recite da ali povejte, kaj spremeniti.',
      },
      { title: 'Mi jih objavimo', body: 'Potrjene videe redno objavljamo na Instagramu in Facebooku.' },
    ],
    faqHeading: 'Pogosta vprašanja',
    faq: [
      { question: 'Čigavi so videi?', answer: 'Vaši. Uporabite jih, kjer želite.' },
      {
        question: 'Kaj potrebujete od mene?',
        answer: 'Logotip, 5 fotografij in približno 10 minut na mesec za potrditev videov.',
      },
      { question: 'Lahko odpovem?', answer: 'Da. Odpoveste lahko vsak mesec.' },
    ],
  },
  pricing: {
    meta: {
      title: 'Cenik — {brand}',
      description:
        'Cene za Wi-Fi QR plakate, spletne vizitke, spletne strani, Gostinski paket in autopilot za družbena omrežja.',
    },
    title: 'Cenik',
    lead: 'Začnite z malim ali vzemite cel paket. Izberite kartico ali nas vprašajte.',
    summaries: {
      wifiPoster: 'Plakat A4 s QR kodo. Gost jo skenira in je na vašem Wi-Fi.',
      vizitka: 'Ena stran z urnikom, zemljevidom, telefonom in menijem. Ena QR koda jo odpre.',
      website: 'Spletna stran z več podstranmi za vaše podjetje. Mi skrbimo, da deluje.',
      hospitalityPack: 'Za restavracije in bare. Vse v enem paketu:',
      autopilot: '8 kratkih videov na mesec na Instagramu in Facebooku. Vsakega potrdite.',
    },
    packIncludes: ['Spletni meni', 'TV menijska tabla', 'Wi-Fi QR plakat', 'Spletna vizitka'],
  },
};
