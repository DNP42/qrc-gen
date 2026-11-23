/**
 * Caption layer: a printed-sign label drawn around or next to the QR code.
 *
 * This file never touches buildOptions(). The QR is generated exactly as
 * before; the caption is geometry computed here and painted on top of / next
 * to it. One layout object feeds the live preview (React SVG), the PNG
 * (canvas) and the SVG (string), so all three match.
 */
import QRCodeStyling from 'qr-code-styling';
import { buildOptions, textToImage, type QRConfig } from '@/lib/qr';

export type CaptionStyle = 'none' | 'text' | 'bar';
export type CaptionPosition = 'below' | 'above';
export type CaptionAlign = 'left' | 'center' | 'right';
export type CaptionFontId = 'inter' | 'playfair' | 'nunito' | 'jetbrains' | 'anton';

export interface CaptionConfig {
  text: string;
  style: CaptionStyle;
  position: CaptionPosition;
  align: CaptionAlign;
  font: CaptionFontId;
  /** Font size in px on the default 320px code; scales with the code size. */
  fontSize: number;
  /** null follows the QR foreground. */
  barColor: string | null;
  /** null follows the QR background on a bar, the QR foreground on plain text. */
  textColor: string | null;
}

export const CAPTION_MAX_LENGTH = 40;
export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 48;

export const DEFAULT_CAPTION: CaptionConfig = {
  text: '',
  style: 'bar',
  position: 'below',
  align: 'center',
  font: 'inter',
  fontSize: 24,
  barColor: null,
  textColor: null,
};

export interface CaptionFont {
  id: CaptionFontId;
  label: string;
  family: string;
  file: string;
  weight: number;
}

/** Self-hosted, SIL OFL 1.1. Files and licenses live in public/fonts. */
export const CAPTION_FONTS: CaptionFont[] = [
  { id: 'inter', label: 'Inter', family: 'qrc-cap-inter', file: 'inter-700.woff2', weight: 700 },
  { id: 'playfair', label: 'Playfair Display', family: 'qrc-cap-playfair', file: 'playfair-display-700.woff2', weight: 700 },
  { id: 'nunito', label: 'Nunito', family: 'qrc-cap-nunito', file: 'nunito-700.woff2', weight: 700 },
  { id: 'jetbrains', label: 'JetBrains Mono', family: 'qrc-cap-jetbrains', file: 'jetbrains-mono-700.woff2', weight: 700 },
  { id: 'anton', label: 'Anton', family: 'qrc-cap-anton', file: 'anton-400.woff2', weight: 400 },
];

export function fontById(id: CaptionFontId): CaptionFont {
  return CAPTION_FONTS.find((f) => f.id === id) ?? CAPTION_FONTS[0];
}

export function isCaptionActive(c: CaptionConfig): boolean {
  return c.style !== 'none' && c.text.trim().length > 0;
}

// ---------------------------------------------------------------- fonts

const fontLoads = new Map<CaptionFontId, Promise<ArrayBuffer>>();

/** Fetch and register one font. Only the chosen font is ever requested. */
export function loadCaptionFont(id: CaptionFontId): Promise<ArrayBuffer> {
  const cached = fontLoads.get(id);
  if (cached) return cached;
  const font = fontById(id);
  const p = fetch(`/fonts/${font.file}`)
    .then((r) => {
      if (!r.ok) throw new Error(`font ${font.file}: ${r.status}`);
      return r.arrayBuffer();
    })
    .then(async (buf) => {
      const face = new FontFace(font.family, buf.slice(0), { weight: String(font.weight) });
      await face.load();
      document.fonts.add(face);
      return buf;
    });
  p.catch(() => fontLoads.delete(id));
  fontLoads.set(id, p);
  return p;
}

// --------------------------------------------------------------- layout

export interface CaptionLayout {
  active: boolean;
  w: number;
  h: number;
  /** Where the QR canvas sits inside the composite. */
  qrX: number;
  qrY: number;
  qrSize: number;
  /** Bar style: outer frame minus the QR window, filled with `frameColor`. */
  framePath: string | null;
  frameColor: string;
  /** Plain-text style: a strip filled with the QR background. */
  strip: { x: number; y: number; w: number; h: number; color: string } | null;
  text: {
    x: number;
    y: number;
    anchor: 'start' | 'middle' | 'end';
    size: number;
    color: string;
    str: string;
    family: string;
    weight: number;
  } | null;
}

let measureCtx: CanvasRenderingContext2D | null = null;
function ctx2d(): CanvasRenderingContext2D | null {
  if (!measureCtx && typeof document !== 'undefined') {
    measureCtx = document.createElement('canvas').getContext('2d');
  }
  return measureCtx;
}

function fitText(str: string, font: CaptionFont, size: number, maxW: number) {
  const ctx = ctx2d();
  if (!ctx) return { str, capH: size * 0.7 };
  ctx.font = `${font.weight} ${size}px "${font.family}", sans-serif`;
  const capH = ctx.measureText('H').actualBoundingBoxAscent || size * 0.7;
  if (ctx.measureText(str).width <= maxW) return { str, capH };
  let s = str;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return { str: `${s.trimEnd()}…`, capH };
}

function rrect(x: number, y: number, w: number, h: number, r: [number, number, number, number]): string {
  const [tl, tr, br, bl] = r;
  return (
    `M${x + tl} ${y}H${x + w - tr}A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}` +
    `V${y + h - br}A${br} ${br} 0 0 1 ${x + w - br} ${y + h}` +
    `H${x + bl}A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` +
    `V${y + tl}A${tl} ${tl} 0 0 1 ${x + tl} ${y}Z`
  );
}

export function computeLayout(
  qr: Pick<QRConfig, 'size' | 'fgColor' | 'bgColor'>,
  cap: CaptionConfig,
): CaptionLayout {
  const size = qr.size;
  const base: CaptionLayout = {
    active: false, w: size, h: size, qrX: 0, qrY: 0, qrSize: size,
    framePath: null, frameColor: qr.fgColor, strip: null, text: null,
  };
  if (!isCaptionActive(cap)) return base;

  const k = size / 320;
  const font = fontById(cap.font);
  const fs = Math.round(cap.fontSize * k);
  const below = cap.position === 'below';
  const bar = cap.style === 'bar';
  const anchor = cap.align === 'left' ? 'start' : cap.align === 'right' ? 'end' : 'middle';
  const barColor = cap.barColor ?? qr.fgColor;
  const textColor = cap.textColor ?? (bar ? qr.bgColor : qr.fgColor);
  const text = cap.text.trim();

  if (bar) {
    const b = Math.round(14 * k);
    const innerR = Math.round(14 * k);
    const outerR = innerR + b;
    const bandH = Math.round(fs * 1.6 + 16 * k);
    const w = size + 2 * b;
    const h = size + b + bandH;
    const qrX = b;
    const qrY = below ? b : bandH;
    const padX = b + Math.round(8 * k);
    const { str, capH } = fitText(text, font, fs, w - 2 * padX);
    const bandY = below ? b + size : 0;
    const cy = bandY + bandH / 2;
    const hole: [number, number, number, number] = below
      ? [innerR, innerR, 0, 0]
      : [0, 0, innerR, innerR];
    return {
      ...base,
      active: true, w, h, qrX, qrY,
      frameColor: barColor,
      framePath: rrect(0, 0, w, h, [outerR, outerR, outerR, outerR]) + rrect(qrX, qrY, size, size, hole),
      text: {
        x: anchor === 'start' ? padX : anchor === 'end' ? w - padX : w / 2,
        y: Math.round(cy + capH / 2),
        anchor, size: fs, color: textColor, str, family: font.family, weight: font.weight,
      },
    };
  }

  const stripH = Math.round(fs * 1.5 + 12 * k);
  const padX = Math.round(12 * k);
  const h = size + stripH;
  const stripY = below ? size : 0;
  const { str, capH } = fitText(text, font, fs, size - 2 * padX);
  return {
    ...base,
    active: true, h, qrY: below ? 0 : stripH,
    strip: { x: 0, y: stripY, w: size, h: stripH, color: qr.bgColor },
    text: {
      x: anchor === 'start' ? padX : anchor === 'end' ? size - padX : size / 2,
      y: Math.round(stripY + stripH / 2 + capH / 2),
      anchor, size: fs, color: textColor, str, family: font.family, weight: font.weight,
    },
  };
}

// --------------------------------------------------------------- export

function overlayImage(config: QRConfig): string | undefined {
  const o = config.overlay;
  if (o.kind === 'image') return o.src || undefined;
  if (o.kind === 'text') return textToImage(o.text, config.fgColor, config.bgColor) || undefined;
  return undefined;
}

function rawQr(config: QRConfig, type: 'canvas' | 'svg') {
  return new QRCodeStyling({ ...buildOptions(config, overlayImage(config)), type });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

export async function captionedPng(config: QRConfig, cap: CaptionConfig): Promise<Blob> {
  await loadCaptionFont(cap.font);
  const layout = computeLayout(config, cap);
  const blob = (await rawQr(config, 'canvas').getRawData('png')) as Blob | null;
  if (!blob) throw new Error('QR render failed');
  const bmp = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = layout.w;
  canvas.height = layout.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  if (layout.strip) {
    ctx.fillStyle = layout.strip.color;
    ctx.fillRect(layout.strip.x, layout.strip.y, layout.strip.w, layout.strip.h);
  }
  ctx.drawImage(bmp, layout.qrX, layout.qrY, layout.qrSize, layout.qrSize);
  if (layout.framePath) {
    ctx.fillStyle = layout.frameColor;
    ctx.fill(new Path2D(layout.framePath), 'evenodd');
  }
  const t = layout.text;
  if (t) {
    ctx.font = `${t.weight} ${t.size}px "${t.family}", sans-serif`;
    ctx.fillStyle = t.color;
    ctx.textAlign = t.anchor === 'start' ? 'left' : t.anchor === 'end' ? 'right' : 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(t.str, t.x, t.y);
  }
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encode failed'))), 'image/png'),
  );
}

/** One self-contained SVG: the font is embedded as a base64 woff2 subset. */
export async function captionedSvg(config: QRConfig, cap: CaptionConfig): Promise<Blob> {
  const fontBuf = await loadCaptionFont(cap.font);
  const layout = computeLayout(config, cap);
  const blob = (await rawQr(config, 'svg').getRawData('svg')) as Blob | null;
  if (!blob) throw new Error('QR render failed');
  const doc = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const inner = doc.documentElement;
  inner.setAttribute('x', String(layout.qrX));
  inner.setAttribute('y', String(layout.qrY));
  const qrMarkup = new XMLSerializer().serializeToString(inner);

  const parts: string[] = [];
  const t = layout.text;
  if (t) {
    parts.push(
      `<defs><style>@font-face{font-family:"${t.family}";font-weight:${t.weight};src:url(data:font/woff2;base64,${toBase64(fontBuf)}) format("woff2")}</style></defs>`,
    );
  }
  if (layout.strip) {
    const s = layout.strip;
    parts.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${s.color}"/>`);
  }
  parts.push(qrMarkup);
  if (layout.framePath) {
    parts.push(`<path d="${layout.framePath}" fill="${layout.frameColor}" fill-rule="evenodd"/>`);
  }
  if (t) {
    parts.push(
      `<text x="${t.x}" y="${t.y}" text-anchor="${t.anchor}" font-family="${t.family}, sans-serif" font-weight="${t.weight}" font-size="${t.size}" fill="${t.color}">${escapeXml(t.str)}</text>`,
    );
  }
  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.w}" height="${layout.h}" viewBox="0 0 ${layout.w} ${layout.h}">${parts.join('')}</svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
