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
    design: 'Diseño',
    title: 'Título',
    caption: 'Leyenda',
    logo: 'Logotipo / centro',
    preview: 'Vista previa',
    export: 'Exportar',
    empty: 'vacío',
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
  legal: {
    back: '← volver al generador',
    navLabel: 'Legal',
    nav: { privacy: 'Privacidad', imprint: 'Aviso legal', terms: 'Términos' },
    updated: 'Última actualización: {date}',
    pages: {
      privacy: {
        title: 'Política de privacidad',
        intro:
          'qrc-gen es una herramienta gratuita. No te pide iniciar sesión y no recopila tus datos. Esta página explica lo que ocurre de todos modos.',
        sections: [
          {
            heading: 'Lo que se queda en tu navegador',
            body: [
              'Todo lo que escribes (enlaces, datos de Wi-Fi, datos de contacto, títulos, leyendas, logotipos) se convierte en un código QR dentro de tu navegador. Nunca se envía a un servidor.',
              'Las fuentes de los títulos y las leyendas se sirven desde este sitio, no desde un tercero.',
            ],
          },
          {
            heading: 'Cookies y almacenamiento',
            body: [
              'Este sitio no instala cookies y no usa herramientas de analítica, publicidad ni seguimiento. Por eso no muestra un aviso de cookies.',
            ],
          },
          {
            heading: 'Alojamiento',
            body: [
              'Este sitio está alojado en Vercel. Cuando abres una página, los servidores de Vercel tratan datos técnicos como tu dirección IP, el tipo de navegador y la hora de la solicitud, para entregar el sitio y mantenerlo seguro. El responsable usa estos datos solo para operar y proteger el sitio. Base jurídica: interés legítimo en mantener un sitio web seguro (art. 6.1.f RGPD).',
            ],
          },
          {
            heading: 'Enlaces a otros sitios',
            body: [
              'El sitio enlaza con GitHub, Ko-fi y otras páginas de DoNotPanic y, cuando se muestran, con Amazon. Al seguir un enlace sales de este sitio y se aplica la política de privacidad del otro sitio. Los enlaces de afiliado están marcados, y el responsable puede recibir una comisión por las compras que cumplan los requisitos.',
            ],
          },
          {
            heading: 'Tus derechos',
            body: [
              'Según el RGPD puedes pedir acceso, rectificación o supresión de los datos personales que haya sobre ti, y oponerte a su tratamiento. Este sitio no recopila datos personales por sí mismo, así que normalmente no hay nada que entregar. Aun así, puedes escribir a la dirección de contacto del aviso legal. También puedes presentar una reclamación ante tu autoridad nacional de protección de datos.',
            ],
          },
          {
            heading: 'Cambios',
            body: [
              'Si esto cambia, por ejemplo si se añadiera analítica, esta página se actualiza primero y cambia la fecha de arriba.',
            ],
          },
        ],
      },
      imprint: {
        title: 'Aviso legal',
        intro: 'Información sobre quién gestiona este sitio.',
        sections: [
          { heading: 'Responsable', body: ['Nombre: donotpanic.space'] },
          { heading: 'Contacto', body: ['Correo electrónico: hello@donotpanic.space'] },
          { heading: 'Alojamiento', body: ['Vercel Inc., EE. UU.'] },
        ],
      },
      terms: {
        title: 'Términos de uso',
        intro: 'qrc-gen es gratuito. Al usarlo aceptas estos términos.',
        sections: [
          {
            heading: 'El servicio',
            body: [
              'qrc-gen crea códigos QR en tu navegador. Se ofrece tal cual, sin garantía de ningún tipo, y puede cambiar o cesar en cualquier momento.',
            ],
          },
          {
            heading: 'Tu contenido',
            body: [
              'Tú decides qué contiene un código. Eres responsable de él, de tener derecho a usar cualquier logotipo o texto que añadas y de a dónde enlaza el código. No uses la herramienta para contenido ilegal, engañoso o dañino, incluidos enlaces a malware o phishing.',
            ],
          },
          {
            heading: 'Comprueba antes de imprimir',
            body: [
              'Escanea siempre un código con más de un dispositivo antes de imprimirlo o publicarlo. Los colores, los logotipos, el margen y las esquinas redondeadas pueden dificultar su lectura. El responsable no responde de los códigos impresos que no se lean.',
            ],
          },
          {
            heading: 'Responsabilidad',
            body: [
              'En la medida que permita la ley, el responsable no responde de los daños derivados del uso de la herramienta ni de los códigos creados con ella. Nada de estos términos limita una responsabilidad que la ley no permita limitar.',
            ],
          },
          {
            heading: 'Software y enlaces de terceros',
            body: [
              'El dibujo del QR usa la biblioteca de código abierto qr-code-styling. Las fuentes de las leyendas son fuentes abiertas con licencia SIL Open Font License. Los enlaces a otros sitios no están bajo el control del responsable.',
            ],
          },
          {
            heading: 'Enlaces de afiliado',
            body: ['Algunos enlaces pueden ser de afiliado. Como afiliados de Amazon, ganamos con las compras que cumplen los requisitos.'],
          },
        ],
      },
    },
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
  controls: {
    decrease: 'Reducir {label}',
    increase: 'Aumentar {label}',
    unit: 'px',
  },
  title: {
    label: 'Título (encima del código)',
    placeholder: 'p. ej. Café Luna',
  },
  caption: {
    label: 'Leyenda (debajo del código)',
    placeholder: 'p. ej. Escanea para ver la carta\nAbierto todos los días 8–22',
  },
  textBlock: {
    hint: 'Se dibuja alrededor del código, no se codifica. Pulsa Intro para una nueva línea (hasta 6 líneas). Una línea demasiado ancha se corta con puntos suspensivos.',
    font: 'Fuente',
    size: 'Tamaño',
    align: 'Alineación',
    aligns: { left: 'izquierda', center: 'centro', right: 'derecha' },
    color: 'Color del texto',
    resetColor: 'usar colores del QR',
  },
  frame: {
    style: 'Marco',
    styles: { bar: 'barra', plain: 'liso' },
    barColor: 'Color de la barra',
    resetColor: 'usar colores del QR',
    outerRadius: 'Redondeo del marco',
    innerRadius: 'Redondeo del código QR',
    hint: 'El marco y las esquinas aparecen cuando hay título o leyenda. El redondeo del QR está limitado por el margen, para que el código se siga leyendo.',
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
