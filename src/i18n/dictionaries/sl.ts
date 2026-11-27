import type { Dictionary } from './en';

/**
 * Slovenian UI strings. Same tone as EN, not a word-for-word translation.
 */
export const sl: Dictionary = {
  meta: {
    title: 'qrc-gen — Brezplačen generator QR kod',
    description:
      'Brezplačen generator QR kod. Povezave, Wi-Fi, vizitke. Po želji logotip ali besedilo na sredini. Brez računov. Brez sledenja.',
    ogDescription: 'Brezplačen generator QR kod. Brez računov. Brez sledenja.',
  },
  header: {
    tagline: 'Brezplačen generator QR kod',
    github: 'github →',
    language: 'Jezik',
  },
  hero: {
    title: 'Ustvari QR kode.',
    titleMuted: 'Brez računov. Brez sledenja. Brez zbiranja podatkov.',
    intro:
      'Za povezave, Wi-Fi omrežja in vizitke. Dodaj logotip ali besedilo na sredino. Popravljanje napak se samodejno okrepi, da se koda še vedno prebere. Izhod: PNG in SVG.',
  },
  cards: {
    content: 'Vsebina',
    design: 'Videz',
    title: 'Naslov',
    caption: 'Napis',
    logo: 'Logotip / sredina',
    preview: 'Predogled',
    export: 'Izvoz',
    empty: 'prazno',
  },
  preview: {
    loading: 'Generiram…',
  },
  footer: {
    builtBy: 'Odprta koda · ustvaril',
    poweredBy: 'poganja',
    home: 'donotpanic.space',
    source: 'izvorna koda →',
    kofi: 'Za vedno zastonj. Podpri projekt',
  },
  legal: {
    back: '← nazaj na generator',
    navLabel: 'Pravno',
    nav: { privacy: 'Zasebnost', imprint: 'Impresum', terms: 'Pogoji' },
    updated: 'Nazadnje posodobljeno: {date}',
    pages: {
      privacy: {
        title: 'Politika zasebnosti',
        intro:
          'qrc-gen je brezplačno orodje. Ne zahteva prijave in ne zbira tvojih podatkov. Ta stran pojasni, kaj se kljub temu zgodi.',
        sections: [
          {
            heading: 'Kaj ostane v tvojem brskalniku',
            body: [
              'Vse, kar vpišeš (povezave, podatke za Wi-Fi, kontaktne podatke, naslove, napise, logotipe), se v kodo QR pretvori v tvojem brskalniku. Nikoli se ne pošlje na strežnik.',
              'Pisave za naslove in napise se nalagajo s te strani, ne od tretje osebe.',
            ],
          },
          {
            heading: 'Piškotki in shranjevanje',
            body: [
              'Ta stran ne nastavlja piškotkov in ne uporablja analitike, oglaševalskih ali sledilnih orodij. Zato ne prikazuje obvestila o piškotkih.',
              'Če pri kodi pritisneš Shrani, brskalnik ta videz hrani v tvoji napravi (lokalni pomnilnik). Nikoli se ne pošlje upravljavcu ali komu drugemu. Izbrišeš ga lahko v aplikaciji ali z brisanjem podatkov te strani v brskalniku. Shranjevanje, ki ga sam zahtevaš, ne potrebuje privolitve. Gesla za Wi-Fi se nikoli ne shranijo.',
            ],
          },
          {
            heading: 'Gostovanje',
            body: [
              'Stran gostuje pri podjetju Vercel. Ko odpreš stran, strežniki Vercel obdelajo tehnične podatke, kot so tvoj naslov IP, vrsta brskalnika in čas zahteve, da stran dostavijo in jo zaščitijo. Upravljavec te podatke uporablja samo za delovanje in varnost strani. Pravna podlaga: zakoniti interes za delovanje varne spletne strani (člen 6(1)(f) GDPR).',
            ],
          },
          {
            heading: 'Povezave na druge strani',
            body: [
              'Stran vsebuje povezave na GitHub, Ko-fi in druge strani DoNotPanic ter, kjer so prikazane, na Amazon. S klikom na povezavo zapustiš to stran in zanjo velja politika zasebnosti tiste strani. Partnerske povezave so označene, upravljavec pa lahko prejme provizijo za upravičene nakupe.',
            ],
          },
          {
            heading: 'Tvoje pravice',
            body: [
              'Po GDPR lahko zahtevaš vpogled, popravek ali izbris osebnih podatkov o tebi in ugovarjaš njihovi obdelavi. Ta stran sama ne zbira osebnih podatkov, zato običajno ni ničesar za posredovati. Lahko pa pišeš na kontaktni naslov v impresumu. Pritožiš se lahko tudi pri nacionalnem organu za varstvo podatkov.',
            ],
          },
          {
            heading: 'Spremembe',
            body: [
              'Če se to spremeni, na primer če bi dodali analitiko, najprej posodobimo to stran in zgornji datum.',
            ],
          },
        ],
      },
      imprint: {
        title: 'Impresum',
        intro: 'Podatki o tem, kdo upravlja to stran.',
        sections: [
          {
            heading: 'Upravljavec',
            body: [
              'Ime: [ime upravljavca, dopolni lastnik]',
              'Naslov: [poštni naslov, dopolni lastnik]',
              'Status: [na primer samostojni podjetnik ali podjetje, dopolni lastnik]',
            ],
          },
          { heading: 'Stik', body: ['E-pošta: [kontaktna e-pošta, dopolni lastnik]'] },
          { heading: 'Davki', body: ['ID za DDV: [če obstaja, dopolni lastnik]'] },
          { heading: 'Gostovanje', body: ['Vercel Inc., ZDA.'] },
        ],
      },
      terms: {
        title: 'Pogoji uporabe',
        intro: 'qrc-gen je brezplačen. Z uporabo se strinjaš s temi pogoji.',
        sections: [
          {
            heading: 'Storitev',
            body: [
              'qrc-gen ustvarja kode QR v tvojem brskalniku. Na voljo je takšen, kot je, brez kakršnega koli jamstva, in se lahko kadar koli spremeni ali preneha.',
            ],
          },
          {
            heading: 'Tvoja vsebina',
            body: [
              'Ti določiš, kaj koda vsebuje. Odgovarjaš zanjo, za pravico do uporabe dodanega logotipa ali besedila in za to, kam koda vodi. Orodja ne uporabljaj za nezakonito, zavajajočo ali škodljivo vsebino, vključno s povezavami na zlonamerno programje ali lažno predstavljanje.',
            ],
          },
          {
            heading: 'Preveri pred tiskom',
            body: [
              'Kodo vedno preberi z več napravami, preden jo natisneš ali objaviš. Barve, logotipi, odmik in zaobljeni robovi lahko kodo težje berljivo naredijo. Upravljavec ne odgovarja za natisnjene kode, ki se ne preberejo.',
            ],
          },
          {
            heading: 'Odgovornost',
            body: [
              'V obsegu, ki ga dovoljuje zakon, upravljavec ne odgovarja za škodo, ki nastane z uporabo orodja ali kod, narejenih z njim. Nič v teh pogojih ne omejuje odgovornosti, ki je po zakonu ni mogoče omejiti.',
            ],
          },
          {
            heading: 'Programje in povezave tretjih oseb',
            body: [
              'Risanje kode QR uporablja odprtokodno knjižnico qr-code-styling. Pisave za napise so odprte pisave z licenco SIL Open Font License. Povezave na druge strani niso pod nadzorom upravljavca.',
            ],
          },
          {
            heading: 'Partnerske povezave',
            body: ['Nekatere povezave so lahko partnerske. Kot partner Amazona zaslužimo z upravičenimi nakupi.'],
          },
          {
            heading: 'Veljavno pravo',
            body: ['Za te pogoje velja pravo [država upravljavca, dopolni lastnik].'],
          },
        ],
      },
    },
  },
  notFound: {
    heading: 'Stran ni najdena.',
    body: 'Stran, ki ste jo zahtevali, ne obstaja.',
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
    paddingHint: 'Tiha cona okoli kode. Premajhna vrednost otežuje skeniranje.',
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
    textPlaceholder: 'besedilo (do 6 znakov)',
    textHint: 'Narisano čez sredino kode. Popravljanje napak samodejno skoči na H.',
    gradient: 'Prelivanje',
    gradientOn: 'uporabi prelivanje',
    gradientFrom: 'Od',
    gradientTo: 'Do',
    gradientTypes: { linear: 'linearno', radial: 'radialno' },
    gradientHint: 'Obe barvi naj bosta jasno temnejši ali svetlejši od ozadja, sicer se koda ne skenira.',
    imageMargin: 'Rob logotipa',
    noneHint: 'Gola QR koda. Najgostejši zapis, najhitrejše skeniranje.',
  },
  controls: {
    decrease: 'Zmanjšaj: {label}',
    increase: 'Povečaj: {label}',
    unit: 'px',
  },
  title: {
    label: 'Naslov (nad kodo)',
    placeholder: 'npr. Kavarna Luna',
  },
  caption: {
    label: 'Napis (pod kodo)',
    placeholder: 'npr. Skeniraj za meni\nOdprto vsak dan 8–22',
  },
  textBlock: {
    hint: 'Nariše se ob kodi, ni zapisano vanjo. Enter naredi novo vrstico (do 6 vrstic). Preširoka vrstica se skrajša s tremi pikami.',
    font: 'Pisava',
    size: 'Velikost',
    align: 'Poravnava',
    aligns: { left: 'levo', center: 'sredina', right: 'desno' },
    color: 'Barva besedila',
    resetColor: 'barve kode QR',
  },
  frame: {
    style: 'Okvir',
    styles: { bar: 'trak', plain: 'navaden' },
    barColor: 'Barva traku',
    resetColor: 'barve kode QR',
    outerRadius: 'Zaobljenost okvirja',
    innerRadius: 'Zaobljenost kode QR',
    hint: 'Okvir in zaobljenost se pokažeta, ko je vpisan naslov ali napis. Zaobljenost kode QR omejuje odmik, da se koda še vedno prebere.',
  },
  saved: {
    title: 'Moje kode',
    count: 'shranjenih: {n}',
    nameLabel: 'Ime',
    save: 'Shrani to kodo',
    saved: 'Shranjeno.',
    saveFailed: 'Kode ni bilo mogoče shraniti. Poskusi znova.',
    empty: 'Še nič ni shranjenega.',
    privacyNote: 'Shranjeno samo v tem brskalniku. Nikoli ne gre nikamor.',
    wifiNotice: 'Gesla za Wi-Fi se nikoli ne shranijo.',
    logoDropped: 'Logotip je bil prevelik in ni bil shranjen.',
    load: 'Naloži',
    delete: 'Izbriši',
    loadAria: 'Naloži: {name}',
    deleteAria: 'Izbriši: {name}',
    exportBackup: 'Izvozi varnostno kopijo',
    importBackup: 'Uvozi varnostno kopijo',
    imported: 'Uvoženih: {n}.',
    importError: 'Ta datoteka ni varnostna kopija qrc-gen.',
    limit: 'Največ {n} kod. Izbriši eno, da shraniš novo.',
    full: 'Pomnilnik brskalnika je poln. Izbriši kodo in poskusi znova.',
    blocked: 'Ta brskalnik blokira lokalni pomnilnik, zato kod ni mogoče shraniti.',
  },
  affiliates: {
    heading: 'Natisni svojo QR kodo',
    blurb: 'Oprema za tisk in prikaz QR kod.',
    disclosure: 'Kot Amazonov partner zaslužimo pri kvalificiranih nakupih.',
  },
  moreFrom: {
    heading: 'Več od DoNotPanic',
    links: {
      hub: { label: 'Spletna stran + DNS', note: 'Plačljiva postavitev strani in domene.' },
      links: { label: 'Povezave', note: 'Vsi projekti DoNotPanic na enem mestu.' },
      dj: { label: 'DJ', note: 'Glasba in miksi.' },
      qttt: { label: 'Kvantni križci in krožci', note: 'Igra za igranje.' },
    },
  },
  download: {
    filename: 'Ime datoteke',
    png: 'Prenesi PNG',
    svg: 'Prenesi SVG',
    captionError: 'Datoteke z napisom ni bilo mogoče izdelati. Poskusi znova.',
    defaultNames: {
      url: 'qr-koda',
      wifi: 'wifi-qr',
      vcard: 'vizitka-qr',
    },
  },
};
