/** Browser-only image helpers for saved codes (canvas). */
import { captionedPng, type CaptionConfig } from '@/lib/caption';
import type { QRConfig } from '@/lib/qr';
import { MAX_LOGO_CHARS } from '@/lib/saved-codes';

const THUMB_WIDTH = 96;
const LOGO_MAX_SIDE = 256;

/** A small JPEG of the finished code, for the saved list. */
export async function makeThumbnail(config: QRConfig, caption: CaptionConfig): Promise<string> {
  const bmp = await createImageBitmap(await captionedPng(config, caption));
  const canvas = document.createElement('canvas');
  canvas.width = THUMB_WIDTH;
  canvas.height = Math.round((bmp.height * THUMB_WIDTH) / bmp.width);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.7);
}

/**
 * Shrink a logo so storage stays small. SVG stays vector (dropped only when
 * huge); bitmaps are scaled down to LOGO_MAX_SIDE. Returns '' when it still
 * does not fit, so the caller can say the logo was not saved.
 */
export async function shrinkLogo(src: string): Promise<string> {
  if (!src) return '';
  if (src.startsWith('data:image/svg')) return src.length <= MAX_LOGO_CHARS ? src : '';
  const img = new Image();
  img.src = src;
  await img.decode();
  const scale = Math.min(1, LOGO_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const out = canvas.toDataURL('image/png');
  return out.length <= MAX_LOGO_CHARS ? out : '';
}
