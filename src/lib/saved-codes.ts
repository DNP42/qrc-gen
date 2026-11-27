/**
 * Saved codes: designs the user chose to keep in this browser.
 *
 * Everything here is local. Nothing is sent anywhere. Data read back from
 * storage or from an imported file is untrusted, so it is rebuilt from the
 * defaults key by key and every value is checked before it can reach the
 * renderer.
 */
import { DEFAULT_CAPTION, type CaptionConfig } from '@/lib/caption';
import { CONTENT_TYPES, DEFAULT_CONTENT, type ContentState } from '@/lib/content';
import { DEFAULT_CONFIG, type QRConfig } from '@/lib/qr';

export const STORAGE_KEY = 'qrc-gen:codes:v1';
export const MAX_CODES = 20;
export const MAX_NAME_LENGTH = 60;
/** A saved logo larger than this (as a data URL) is dropped, not stored. */
export const MAX_LOGO_CHARS = 200_000;

/** The QR settings of a saved code; the encoded data comes from `content`. */
export type SavedDesign = Omit<QRConfig, 'data'>;

export interface SavedCode {
  id: string;
  name: string;
  createdAt: number;
  /** Small JPEG data URL shown in the list. */
  thumb: string;
  content: ContentState;
  design: SavedDesign;
  caption: CaptionConfig;
}

interface NewSavedCode {
  id: string;
  name: string;
  now: number;
  thumb: string;
  content: ContentState;
  config: QRConfig;
  caption: CaptionConfig;
}

/** The settings without the encoded string, which comes from the content. */
function withoutData(config: QRConfig): SavedDesign {
  const copy: Partial<QRConfig> = { ...config };
  delete copy.data;
  return copy as SavedDesign;
}

/** Build the record to store. The Wi-Fi password is never kept: storage is plain text. */
export function createSavedCode(input: NewSavedCode): SavedCode {
  const design: SavedDesign = withoutData(input.config);
  return {
    id: input.id,
    name: input.name.trim().slice(0, MAX_NAME_LENGTH),
    createdAt: input.now,
    thumb: input.thumb,
    content: { ...input.content, wifi: { ...input.content.wifi, password: '' } },
    design,
    caption: input.caption,
  };
}

// ------------------------------------------------------------ validation

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Allowed values for string fields, by dotted path. */
const ENUMS: Record<string, readonly string[]> = {
  'content.type': CONTENT_TYPES,
  'content.wifi.encryption': ['WPA', 'WEP', 'nopass'],
  'design.dotStyle': ['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'],
  'design.cornerSquareStyle': ['square', 'dot', 'extra-rounded'],
  'design.cornerDotStyle': ['square', 'dot'],
  'design.gradient.type': ['linear', 'radial'],
  'caption.frame.style': ['bar', 'plain'],
  'caption.title.align': ['left', 'center', 'right'],
  'caption.caption.align': ['left', 'center', 'right'],
  'caption.title.font': ['inter', 'playfair', 'nunito', 'jetbrains', 'anton'],
  'caption.caption.font': ['inter', 'playfair', 'nunito', 'jetbrains', 'anton'],
};

const COLOR_KEYS = new Set(['fgColor', 'bgColor', 'from', 'to', 'barColor', 'color']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Rebuild `value` in the shape of `defaults`: unknown keys are dropped and
 * every field falls back to its default when the type, enum or color is wrong.
 */
function sanitize<T>(defaults: T, value: unknown, path: string): T {
  if (isRecord(defaults)) {
    const source = isRecord(value) ? value : {};
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = sanitize(defaults[key], source[key], `${path}.${key}`);
    }
    return out as T;
  }
  const key = path.slice(path.lastIndexOf('.') + 1);
  if (defaults === null) {
    // A nullable color: a hex string, or null to follow the QR colors.
    return (typeof value === 'string' && HEX_COLOR.test(value) ? value : null) as T;
  }
  if (typeof defaults === 'string') {
    if (typeof value !== 'string') return defaults;
    const allowed = ENUMS[path];
    if (allowed) return (allowed.includes(value) ? value : defaults) as T;
    if (COLOR_KEYS.has(key)) return (HEX_COLOR.test(value) ? value : defaults) as T;
    return value.slice(0, 2000) as T;
  }
  if (typeof defaults === 'number') {
    return (typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 10_000
      ? value
      : defaults) as T;
  }
  if (typeof defaults === 'boolean') {
    return (typeof value === 'boolean' ? value : defaults) as T;
  }
  return defaults;
}

function sanitizeOverlay(value: unknown): QRConfig['overlay'] {
  if (!isRecord(value)) return { kind: 'none' };
  if (value.kind === 'text' && typeof value.text === 'string') {
    return { kind: 'text', text: value.text.slice(0, 6) };
  }
  if (
    value.kind === 'image' &&
    typeof value.src === 'string' &&
    value.src.length <= MAX_LOGO_CHARS &&
    /^data:image\/(png|jpeg|webp|svg\+xml)[;,]/.test(value.src)
  ) {
    return { kind: 'image', src: value.src };
  }
  return { kind: 'none' };
}

function parseSavedCode(value: unknown): SavedCode | null {
  if (!isRecord(value)) return null;
  const { id, name, createdAt, thumb } = value;
  if (typeof id !== 'string' || !id || typeof name !== 'string') return null;
  if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) return null;
  if (!isRecord(value.content) || !CONTENT_TYPES.includes(value.content.type as never)) return null;

  const design = sanitize(withoutData(DEFAULT_CONFIG), value.design, 'design');
  const rawDesign = isRecord(value.design) ? value.design : {};
  design.overlay = sanitizeOverlay(rawDesign.overlay);

  const content = sanitize(DEFAULT_CONTENT, value.content, 'content');
  content.wifi.password = '';

  return {
    id: id.slice(0, 80),
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    createdAt,
    thumb: typeof thumb === 'string' && thumb.startsWith('data:image/') && thumb.length < 60_000 ? thumb : '',
    content,
    design,
    caption: sanitize(DEFAULT_CAPTION, value.caption, 'caption'),
  };
}

/**
 * Parse stored or imported JSON (a list, or `{ codes: [...] }`). Invalid
 * input gives an empty list; invalid entries are skipped; the list is capped.
 */
export function parseSavedCodes(raw: string): SavedCode[] {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return [];
  }
  const list = Array.isArray(json) ? json : isRecord(json) && Array.isArray(json.codes) ? json.codes : [];
  const seen = new Set<string>();
  const codes: SavedCode[] = [];
  for (const entry of list) {
    const code = parseSavedCode(entry);
    if (code && !seen.has(code.id)) {
      seen.add(code.id);
      codes.push(code);
    }
  }
  return codes.slice(0, MAX_CODES);
}

/** Add imported codes after the existing ones, skipping ids already present. */
export function mergeSavedCodes(existing: SavedCode[], imported: SavedCode[]): SavedCode[] {
  const ids = new Set(existing.map((c) => c.id));
  return [...existing, ...imported.filter((c) => !ids.has(c.id))].slice(0, MAX_CODES);
}

export function serializeSavedCodes(codes: SavedCode[]): string {
  return JSON.stringify({ version: 1, codes }, null, 2);
}

// --------------------------------------------------------------- storage

export type StoreResult = { ok: true } | { ok: false; reason: 'full' | 'blocked' };

/** Storage can be missing or blocked (private windows, site settings): never throw. */
export function loadSavedCodes(): { codes: SavedCode[]; available: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { codes: raw ? parseSavedCodes(raw) : [], available: true };
  } catch {
    return { codes: [], available: false };
  }
}

export function storeSavedCodes(codes: SavedCode[]): StoreResult {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    return { ok: true };
  } catch (error) {
    const full = error instanceof DOMException && error.name === 'QuotaExceededError';
    return { ok: false, reason: full ? 'full' : 'blocked' };
  }
}
