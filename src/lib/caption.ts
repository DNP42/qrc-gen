/**
 * Caption layer: a title above and a caption below the QR code, inside an
 * optional frame.
 *
 * This file never touches buildOptions(). The QR is generated exactly as
 * before; the text and frame are geometry computed here and painted around
 * it. One layout object feeds the live preview (React SVG), the PNG (canvas)
 * and the SVG (string), so all three match.
 */
import QRCodeStyling from 'qr-code-styling';
import { buildOptions, clampMargin, textToImage, type QRConfig } from '@/lib/qr';

export type FrameStyle = 'bar' | 'plain';
export type CaptionAlign = 'left' | 'center' | 'right';
export type CaptionFontId = 'inter' | 'playfair' | 'nunito' | 'jetbrains' | 'anton';

/** One block of text: the title above the code, or the caption below it. */
export interface TextBlockConfig {
  text: string;
  /** Font size in px on the default 320px code; scales with the code size. */
  size: number;
  font: CaptionFontId;
  align: CaptionAlign;
  /** null follows the QR background on a bar, the QR foreground on plain. */
  color: string | null;
}

export interface FrameConfig {
  style: FrameStyle;
  /** null follows the QR foreground. */
  barColor: string | null;
  /** Corner radius of the whole sign, px on the default 320px code. */
  outerRadius: number;
  /** Corner radius of the QR code itself, px on the default 320px code. */
  innerRadius: number;
}

export interface CaptionConfig {
  frame: FrameConfig;
  title: TextBlockConfig;
  caption: TextBlockConfig;
}

export const CAPTION_MAX_LENGTH = 240;
export const CAPTION_MAX_LINES = 6;
/** Line spacing as a multiple of the font size. */
const LINE_HEIGHT = 1.25;
export const FONT_SIZE_MIN = 12;
export const CAPTION_SIZE_MAX = 48;
export const TITLE_SIZE_MAX = 72;
export const RADIUS_MIN = 0;
export const RADIUS_MAX = 60;
/** The PNG is rendered this many times larger than the on-screen code. */
export const EXPORT_SCALE = 3;

export const DEFAULT_CAPTION: CaptionConfig = {
  frame: { style: 'bar', barColor: null, outerRadius: 28, innerRadius: 14 },
  title: { text: '', size: 32, font: 'inter', align: 'center', color: null },
  caption: { text: '', size: 24, font: 'inter', align: 'center', color: null },
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

/** Text as trimmed lines: blank edges dropped, at most CAPTION_MAX_LINES. */
export function captionLines(text: string): string[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  while (lines.length && !lines[0]) lines.shift();
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines.slice(0, CAPTION_MAX_LINES);
}

/** The frame and corners are drawn only when there is a title or a caption. */
export function isCaptionActive(c: CaptionConfig): boolean {
  return c.title.text.trim().length > 0 || c.caption.text.trim().length > 0;
}

/** Fonts the current title and caption use (each loaded once). */
export function activeFontIds(c: CaptionConfig): CaptionFontId[] {
  const ids: CaptionFontId[] = [];
  for (const block of [c.title, c.caption]) {
    if (block.text.trim() && !ids.includes(block.font)) ids.push(block.font);
  }
  return ids;
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
  font: CaptionFontId;
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
  /** Corner radius of the QR canvas. */
  qrRadius: number;
  /** Corner radius of the whole sign. */
  outerRadius: number;
  /** Bar style: outer frame minus the QR window, filled with `frameColor`. */
  framePath: string | null;
  frameColor: string;
  /** Plain style: a plate in the QR background color behind everything. */
  plateColor: string | null;
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

/** Rounded rectangle path; every radius is capped so the arcs never overlap. */
export function roundedRectPath(x: number, y: number, w: number, h: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  return (
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}` +
    `V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}

/** `margin` is the quiet zone actually drawn (see layoutInput), in the same pixels as `size`. */
type LayoutInput = Pick<QRConfig, 'size' | 'margin' | 'fgColor' | 'bgColor'>;

/** Layout input for a config rendered at `scale` x: the clamped margin buildOptions() really draws. */
export function layoutInput(config: QRConfig, scale = 1): LayoutInput {
  return {
    size: config.size * scale,
    margin: clampMargin(config.margin, config.size) * scale,
    fgColor: config.fgColor,
    bgColor: config.bgColor,
  };
}

export function computeLayout(qr: LayoutInput, cap: CaptionConfig): CaptionLayout {
  const size = qr.size;
  const base: CaptionLayout = {
    active: false, w: size, h: size, qrX: 0, qrY: 0, qrSize: size, qrRadius: 0, outerRadius: 0,
    framePath: null, frameColor: qr.fgColor, plateColor: null, blocks: [],
  };
  if (!isCaptionActive(cap)) return base;

  const k = size / 320;
  const bar = cap.frame.style === 'bar';
  // The corner is capped by the quiet zone, so rounding never cuts a finder pattern.
  const qrRadius = Math.min(Math.round(cap.frame.innerRadius * k), Math.max(0, qr.margin));

  const sections = [cap.title, cap.caption].map((block) => ({
    block,
    rows: captionLines(block.text),
    fs: Math.round(block.size * k),
  }));
  const [title, caption] = sections;
  const bandHeight = (s: (typeof sections)[number]) =>
    s.rows.length === 0
      ? 0
      : Math.round(s.fs * (LINE_HEIGHT * s.rows.length + (bar ? 0.35 : 0.25)) + (bar ? 16 : 12) * k);
  const topH = bandHeight(title);
  const botH = bandHeight(caption);

  // The bar keeps a thin border on a side that has no text.
  const b = bar ? Math.round(14 * k) : 0;
  // On the bar, a corner larger than this would put the QR window's corner outside
  // the rounded outline and paint the bar over the code. (3.414 = 1 / (1 - 1/sqrt 2) * 1/sqrt 2.)
  const outerLimit = bar ? Math.floor(3.414 * b + qrRadius) : Number.POSITIVE_INFINITY;
  const outerRadius = Math.min(Math.round(cap.frame.outerRadius * k), outerLimit);
  const w = size + 2 * b;
  const padX = bar ? b + Math.round(8 * k) : Math.round(12 * k);
  const qrY = topH || b;
  const bottomY = qrY + size;
  const h = bottomY + (botH || b);

  const blocks: TextBlock[] = [];
  const addBlock = (s: (typeof sections)[number], centerY: number) => {
    if (s.rows.length === 0) return;
    const font = fontById(s.block.font);
    const fit = s.rows.map((r) => fitText(r, font, s.fs, w - 2 * padX));
    const anchor = s.block.align === 'left' ? 'start' : s.block.align === 'right' ? 'end' : 'middle';
    blocks.push({
      x: anchor === 'start' ? padX : anchor === 'end' ? w - padX : w / 2,
      lines: baselines(fit.length, centerY, s.fs, fit[0].capH).map((y, i) => ({ str: fit[i].str, y })),
      anchor, size: s.fs, font: font.id, family: font.family, weight: font.weight,
      color: s.block.color ?? (bar ? qr.bgColor : qr.fgColor),
    });
  };
  addBlock(title, topH / 2);
  addBlock(caption, bottomY + botH / 2);

  const shared = { ...base, active: true, w, h, qrX: b, qrY, qrRadius, outerRadius, blocks };
  if (bar) {
    return {
      ...shared,
      frameColor: cap.frame.barColor ?? qr.fgColor,
      framePath:
        roundedRectPath(0, 0, w, h, outerRadius) + roundedRectPath(b, qrY, size, size, qrRadius),
    };
  }
  return { ...shared, plateColor: qr.bgColor };
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
  await Promise.all(activeFontIds(cap).map(loadCaptionFont));
  const layout = computeLayout(layoutInput(config, EXPORT_SCALE), cap);
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
  if (layout.plateColor) {
    ctx.fillStyle = layout.plateColor;
    ctx.fill(new Path2D(roundedRectPath(0, 0, layout.w, layout.h, layout.outerRadius)));
  }
  ctx.save();
  // The QR never shows outside the sign, whatever the two radii are.
  if (layout.plateColor) {
    ctx.clip(new Path2D(roundedRectPath(0, 0, layout.w, layout.h, layout.outerRadius)));
  }
  if (layout.qrRadius > 0) {
    ctx.clip(new Path2D(roundedRectPath(layout.qrX, layout.qrY, layout.qrSize, layout.qrSize, layout.qrRadius)));
  }
  ctx.drawImage(bmp, layout.qrX, layout.qrY, layout.qrSize, layout.qrSize);
  ctx.restore();
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

/** One self-contained SVG: each font is embedded as a base64 woff2 subset. */
export async function captionedSvg(config: QRConfig, cap: CaptionConfig): Promise<Blob> {
  const fontIds = activeFontIds(cap);
  const fontBufs = await Promise.all(fontIds.map(loadCaptionFont));
  const layout = computeLayout(layoutInput(config), cap);
  const blob = (await rawQr(config, 'svg').getRawData('svg')) as Blob | null;
  if (!blob) throw new Error('QR render failed');
  const doc = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const inner = doc.documentElement;
  inner.setAttribute('x', String(layout.qrX));
  inner.setAttribute('y', String(layout.qrY));
  const qrMarkup = new XMLSerializer().serializeToString(inner);

  const parts: string[] = [];
  const defs: string[] = fontIds.map((id, i) => {
    const font = fontById(id);
    return `@font-face{font-family:"${font.family}";font-weight:${font.weight};src:url(data:font/woff2;base64,${toBase64(fontBufs[i])}) format("woff2")}`;
  });
  const clipId = 'qrc-qr-clip';
  const plateClipId = 'qrc-plate-clip';
  const clipped = layout.qrRadius > 0;
  parts.push(
    `<defs>${defs.length ? `<style>${defs.join('')}</style>` : ''}` +
      (layout.plateColor
        ? `<clipPath id="${plateClipId}"><rect width="${layout.w}" height="${layout.h}" rx="${layout.outerRadius}" ry="${layout.outerRadius}"/></clipPath>`
        : '') +
      (clipped
        ? `<clipPath id="${clipId}"><rect x="${layout.qrX}" y="${layout.qrY}" width="${layout.qrSize}" height="${layout.qrSize}" rx="${layout.qrRadius}" ry="${layout.qrRadius}"/></clipPath>`
        : '') +
      `</defs>`,
  );
  if (layout.plateColor) {
    parts.push(
      `<rect width="${layout.w}" height="${layout.h}" rx="${layout.outerRadius}" ry="${layout.outerRadius}" fill="${escapeXml(layout.plateColor)}"/>`,
    );
  }
  const qrPart = clipped ? `<g clip-path="url(#${clipId})">${qrMarkup}</g>` : qrMarkup;
  parts.push(layout.plateColor ? `<g clip-path="url(#${plateClipId})">${qrPart}</g>` : qrPart);
  if (layout.framePath) {
    parts.push(`<path d="${layout.framePath}" fill="${escapeXml(layout.frameColor)}" fill-rule="evenodd"/>`);
  }
  for (const t of layout.blocks) {
    for (const l of t.lines) {
      parts.push(
        `<text x="${t.x}" y="${l.y}" text-anchor="${t.anchor}" font-family="${t.family}, sans-serif" font-weight="${t.weight}" font-size="${t.size}" fill="${escapeXml(t.color)}">${escapeXml(l.str)}</text>`,
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
