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
export type CaptionAlign = 'left' | 'center' | 'right';
export type CaptionFontId = 'inter' | 'playfair' | 'nunito' | 'jetbrains' | 'anton';

export interface CaptionConfig {
  /** Headline above the QR. */
  title: string;
  /** Title size in px on the default 320px code; scales with the code size. */
  titleSize: number;
  /** Caption below the QR. */
  text: string;
  style: CaptionStyle;
  align: CaptionAlign;
  font: CaptionFontId;
  /** Font size in px on the default 320px code; scales with the code size. */
  fontSize: number;
  /** null follows the QR foreground. */
  barColor: string | null;
  /** null follows the QR background on a bar, the QR foreground on plain text. */
  textColor: string | null;
}

export const CAPTION_MAX_LENGTH = 240;
export const CAPTION_MAX_LINES = 6;
/** Line spacing as a multiple of the font size. */
const LINE_HEIGHT = 1.25;
export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 48;
export const TITLE_SIZE_MIN = 12;
export const TITLE_SIZE_MAX = 72;
/** The PNG is rendered this many times larger than the on-screen code. */
export const EXPORT_SCALE = 3;

export const DEFAULT_CAPTION: CaptionConfig = {
  title: '',
  titleSize: 32,
  text: '',
  style: 'bar',
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

/** Caption text as trimmed lines: blank edges dropped, at most CAPTION_MAX_LINES. */
export function captionLines(text: string): string[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  while (lines.length && !lines[0]) lines.shift();
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines.slice(0, CAPTION_MAX_LINES);
}

export function isCaptionActive(c: CaptionConfig): boolean {
  return c.style !== 'none' && (c.title.trim().length > 0 || c.text.trim().length > 0);
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

export interface TextBlock {
  x: number;
  anchor: 'start' | 'middle' | 'end';
  size: number;
  color: string;
  /** One entry per line; `y` is the baseline. */
  lines: { str: string; y: number }[];
  family: string;
  weight: number;
}

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
  /** Plain-text style: strips filled with the QR background. */
  strips: { x: number; y: number; w: number; h: number; color: string }[];
  /** Title (above the QR) and caption (below it), in that order. */
  blocks: TextBlock[];
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

/** Baselines for `n` lines centred on `cy`. */
function baselines(n: number, cy: number, fs: number, capH: number): number[] {
  const lh = fs * LINE_HEIGHT;
  const top = cy - ((n - 1) * lh + capH) / 2;
  return Array.from({ length: n }, (_, i) => Math.round(top + capH + i * lh));
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
    framePath: null, frameColor: qr.fgColor, strips: [], blocks: [],
  };
  if (!isCaptionActive(cap)) return base;

  const k = size / 320;
  const font = fontById(cap.font);
  const bar = cap.style === 'bar';
  const anchor = cap.align === 'left' ? 'start' : cap.align === 'right' ? 'end' : 'middle';
  const barColor = cap.barColor ?? qr.fgColor;
  const textColor = cap.textColor ?? (bar ? qr.bgColor : qr.fgColor);

  const title = { rows: captionLines(cap.title), fs: Math.round(cap.titleSize * k) };
  const caption = { rows: captionLines(cap.text), fs: Math.round(cap.fontSize * k) };
  const bandHeight = (s: { rows: string[]; fs: number }) =>
    s.rows.length === 0
      ? 0
      : Math.round(s.fs * (LINE_HEIGHT * s.rows.length + (bar ? 0.35 : 0.25)) + (bar ? 16 : 12) * k);
  const topH = bandHeight(title);
  const botH = bandHeight(caption);

  // Bar style keeps a thin border on a side that has no text.
  const b = bar ? Math.round(14 * k) : 0;
  const innerR = Math.round(14 * k);
  const outerR = innerR + b;
  const w = size + 2 * b;
  const padX = bar ? b + Math.round(8 * k) : Math.round(12 * k);
  const qrY = topH || b;
  const bottomY = qrY + size;
  const h = bottomY + (botH || b);

  const blocks: TextBlock[] = [];
  const addBlock = (s: { rows: string[]; fs: number }, centerY: number) => {
    if (s.rows.length === 0) return;
    const fit = s.rows.map((r) => fitText(r, font, s.fs, w - 2 * padX));
    blocks.push({
      x: anchor === 'start' ? padX : anchor === 'end' ? w - padX : w / 2,
      lines: baselines(fit.length, centerY, s.fs, fit[0].capH).map((y, i) => ({ str: fit[i].str, y })),
      anchor, size: s.fs, color: textColor, family: font.family, weight: font.weight,
    });
  };
  addBlock(title, topH / 2);
  addBlock(caption, bottomY + botH / 2);

  if (bar) {
    // A side with a text band meets the QR square; a side with only a border is rounded.
    const hole: [number, number, number, number] = [
      topH ? 0 : innerR, topH ? 0 : innerR, botH ? 0 : innerR, botH ? 0 : innerR,
    ];
    return {
      ...base,
      active: true, w, h, qrX: b, qrY,
      frameColor: barColor,
      framePath: rrect(0, 0, w, h, [outerR, outerR, outerR, outerR]) + rrect(b, qrY, size, size, hole),
      blocks,
    };
  }

  const strips = [];
  if (topH) strips.push({ x: 0, y: 0, w, h: topH, color: qr.bgColor });
  if (botH) strips.push({ x: 0, y: bottomY, w, h: botH, color: qr.bgColor });
  return { ...base, active: true, w, h, qrX: 0, qrY, strips, blocks };
}

// --------------------------------------------------------------- export

function overlayImage(config: QRConfig): string | undefined {
  const o = config.overlay;
  if (o.kind === 'image') return o.src || undefined;
  if (o.kind === 'text') return textToImage(o.text, config.fgColor, config.bgColor) || undefined;
  return undefined;
}

/**
 * `scale` only enlarges the render (size, margin, logo gap in pixels). The
 * encoded data, error correction and styles are exactly buildOptions()'s.
 */
function rawQr(config: QRConfig, type: 'canvas' | 'svg', scale = 1) {
  const o = buildOptions(config, overlayImage(config));
  return new QRCodeStyling({
    ...o,
    type,
    width: (o.width ?? config.size) * scale,
    height: (o.height ?? config.size) * scale,
    margin: (o.margin ?? 0) * scale,
    imageOptions: { ...o.imageOptions, margin: (o.imageOptions?.margin ?? 0) * scale },
  });
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

/**
 * PNG at EXPORT_SCALE x the on-screen size, on an opaque white backdrop.
 * Chat apps such as WhatsApp recompress images to JPEG: a small image turns
 * soft, and transparent corners (the rounded bar frame) turn black.
 */
export async function captionedPng(config: QRConfig, cap: CaptionConfig): Promise<Blob> {
  await loadCaptionFont(cap.font);
  const layout = computeLayout({ ...config, size: config.size * EXPORT_SCALE }, cap);
  const blob = (await rawQr(config, 'canvas', EXPORT_SCALE).getRawData('png')) as Blob | null;
  if (!blob) throw new Error('QR render failed');
  const bmp = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = layout.w;
  canvas.height = layout.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, layout.w, layout.h);
  for (const strip of layout.strips) {
    ctx.fillStyle = strip.color;
    ctx.fillRect(strip.x, strip.y, strip.w, strip.h);
  }
  ctx.drawImage(bmp, layout.qrX, layout.qrY, layout.qrSize, layout.qrSize);
  if (layout.framePath) {
    ctx.fillStyle = layout.frameColor;
    ctx.fill(new Path2D(layout.framePath), 'evenodd');
  }
  for (const block of layout.blocks) {
    ctx.font = `${block.weight} ${block.size}px "${block.family}", sans-serif`;
    ctx.fillStyle = block.color;
    ctx.textAlign = block.anchor === 'start' ? 'left' : block.anchor === 'end' ? 'right' : 'center';
    ctx.textBaseline = 'alphabetic';
    for (const l of block.lines) ctx.fillText(l.str, block.x, l.y);
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
  const first = layout.blocks[0];
  if (first) {
    parts.push(
      `<defs><style>@font-face{font-family:"${first.family}";font-weight:${first.weight};src:url(data:font/woff2;base64,${toBase64(fontBuf)}) format("woff2")}</style></defs>`,
    );
  }
  for (const s of layout.strips) {
    parts.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${s.color}"/>`);
  }
  parts.push(qrMarkup);
  if (layout.framePath) {
    parts.push(`<path d="${layout.framePath}" fill="${layout.frameColor}" fill-rule="evenodd"/>`);
  }
  for (const t of layout.blocks) {
    for (const l of t.lines) {
      parts.push(
        `<text x="${t.x}" y="${l.y}" text-anchor="${t.anchor}" font-family="${t.family}, sans-serif" font-weight="${t.weight}" font-size="${t.size}" fill="${t.color}">${escapeXml(l.str)}</text>`,
      );
    }
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
