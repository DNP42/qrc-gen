import type { Dictionary } from './en';

/**
 * Spanish UI strings. Same tone as EN, not a word-for-word translation.
 * Neutral Spanish (tú form), no regional slang.
 */
export const es: Dictionary = {
  meta: {
    title: 'qrc-gen — Generador de códigos QR gratis',
    description:
      'Generador de códigos QR gratis. Enlaces, Wi-Fi, tarjetas vCard. Logotipo o texto en el centro, si quieres. Sin cuentas. Sin rastreo.',
    ogDescription: 'Generador de códigos QR gratis. Sin cuentas. Sin rastreo.',
  },
  header: {
    tagline: 'Generador de códigos QR gratis',
    github: 'github →',
    language: 'Idioma',
  },
  hero: {
    title: 'Genera códigos QR.',
    titleMuted: 'Sin cuentas. Sin rastreo. Sin recopilar datos.',
    intro:
      'Para enlaces, redes Wi-Fi y tarjetas de contacto. Añade un logotipo o texto en el centro. La corrección de errores se ajusta sola para que el código se siga leyendo. Salida en PNG y SVG.',
  },
  cards: {
    content: 'Contenido',
    style: 'Estilo',
    preview: 'Vista previa',
    export: 'Exportar',
  },
  preview: {
    loading: 'Generando…',
  },
  footer: {
    builtBy: 'Código abierto · creado por',
    poweredBy: 'con tecnología de',
    home: 'donotpanic.space',
    source: 'código →',
    kofi: 'Gratis para siempre. Apoya el proyecto',
  },
  notFound: {
    heading: 'Página no encontrada.',
    body: 'La página que buscas no existe.',
    back: 'volver al generador →',
  },
  content: {
    tabs: {
      url: 'URL / Texto',
      wifi: 'Wi-Fi',
      vcard: 'vCard',
    },
    url: {
      label: 'URL o cualquier texto',
      placeholder: 'https://example.com o cualquier cadena',
      encodedAs: 'Se codifica como texto plano.',
      charCount: { one: '{n} carácter', other: '{n} caracteres' },
    },
    wifi: {
      ssid: 'Nombre de la red (SSID)',
      ssidPlaceholder: 'mi-wifi-de-casa',
      encryption: 'Cifrado',
      encryptionOptions: {
        WPA: 'WPA / WPA2 / WPA3',
        WEP: 'WEP',
        nopass: 'Ninguno (abierta)',
      },
      hidden: 'Red oculta',
      yes: 'sí',
      no: 'no',
      password: 'Contraseña',
    },
    vcard: {
      firstName: { label: 'Nombre', placeholder: 'Ada' },
      lastName: { label: 'Apellidos', placeholder: 'Lovelace' },
      organization: { label: 'Organización', placeholder: 'Máquina Analítica S.L.' },
      title: { label: 'Cargo', placeholder: 'Matemática' },
      phone: { label: 'Teléfono', placeholder: '+34 600 000 000' },
      email: { label: 'Correo electrónico', placeholder: 'ada@example.com' },
      url: { label: 'Sitio web', placeholder: 'https://example.com' },
    },
  },
  style: {
    preset: 'Combinación de colores',
    foreground: 'Primer plano',
    background: 'Fondo',
    dotStyle: 'Estilo de puntos',
    cornerSquares: 'Cuadrados de las esquinas',
    cornerDots: 'Puntos de las esquinas',
    padding: 'Margen',
    paddingHint: 'Zona de silencio alrededor del código. Si es muy pequeña, algunos lectores fallarán.',
    paddingValue: '{n} px',
    overlay: 'Superposición (opcional)',
    presets: {
      hawk: 'halcón',
      mono: 'mono',
      inverted: 'invertido',
      cyan: 'cian',
      amber: 'ámbar',
      blood: 'sangre',
    },
    dotStyles: {
      rounded: 'redondeado',
      square: 'cuadrado',
      dots: 'puntos',
      classy: 'elegante',
      'classy-rounded': 'elegante redondeado',
      'extra-rounded': 'muy redondeado',
    },
    cornerSquareStyles: {
      'extra-rounded': 'muy redondeado',
      square: 'cuadrado',
      dot: 'punto',
    },
    cornerDotStyles: {
      dot: 'punto',
      square: 'cuadrado',
    },
    overlayKinds: {
      none: 'ninguna',
      image: 'imagen',
      text: 'texto',
    },
    chooseImage: 'Elegir imagen…',
    overlayPreviewAlt: 'vista previa de la superposición',
    clear: 'quitar',
    textPlaceholder: 'texto (máx. 6 caracteres)',
    textHint: 'Se dibuja en el centro del QR. La corrección de errores sube a H sola.',
    gradient: 'Degradado',
    gradientOn: 'usar degradado',
    gradientFrom: 'Desde',
    gradientTo: 'Hasta',
    gradientTypes: { linear: 'lineal', radial: 'radial' },
    gradientHint: 'Mantén ambos colores claramente más oscuros o más claros que el fondo, o el código no se leerá.',
    imageMargin: 'Margen del logotipo',
    noneHint: 'QR liso. Codificación más densa, se lee más rápido.',
  },
  caption: {
    title: 'Leyenda (opcional)',
    text: 'Texto de la leyenda',
    placeholder: 'p. ej. Escanea para ver la carta\nAbierto todos los días 8–22',
    hint: 'Se dibuja alrededor del código, no se codifica. Pulsa Intro para una nueva línea (hasta 6 líneas). Una línea demasiado ancha se corta con puntos suspensivos.',
    style: 'Estilo de la etiqueta',
    styles: { none: 'ninguna', text: 'texto plano', bar: 'barra' },
    position: 'Posición',
    positions: { above: 'arriba', below: 'abajo' },
    align: 'Alineación',
    aligns: { left: 'izquierda', center: 'centro', right: 'derecha' },
    font: 'Fuente',
    fontSize: 'Tamaño de fuente',
    fontSizeValue: '{n} px',
    barColor: 'Color de la barra',
    textColor: 'Color del texto',
    resetColors: 'usar colores del QR',
  },
  affiliates: {
    heading: 'Llévalo al mundo real',
    blurb: 'Material para imprimir y exponer códigos QR.',
    disclosure: 'Como asociados de Amazon, ganamos con las compras que cumplen los requisitos.',
  },
  moreFrom: {
    heading: 'Más de DoNotPanic',
    links: {
      hub: { label: 'Web + configuración DNS', note: 'Puesta en marcha de pago para tu sitio y dominio.' },
      links: { label: 'Enlaces', note: 'Todos los proyectos de DoNotPanic en un solo sitio.' },
      dj: { label: 'DJ', note: 'Música y sesiones.' },
      qttt: { label: 'Tres en raya cuántico', note: 'Un juego para jugar.' },
    },
  },
  download: {
    filename: 'Nombre del archivo',
    png: 'Descargar PNG',
    svg: 'Descargar SVG',
    captionError: 'No se pudo crear el archivo con leyenda. Inténtalo de nuevo.',
    // ASCII only: the download sanitizer replaces anything else with '-'.
    defaultNames: {
      url: 'codigo-qr',
      wifi: 'wifi-qr',
      vcard: 'vcard-qr',
    },
  },
};
