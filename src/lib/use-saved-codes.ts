'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  STORAGE_KEY,
  parseSavedCodes,
  storeSavedCodes,
  type SavedCode,
  type StoreResult,
} from '@/lib/saved-codes';

const CHANGE_EVENT = 'qrc-gen:codes-changed';

function subscribe(onChange: () => void): () => void {
  // `storage` fires for other tabs; our own writes announce themselves.
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** The raw stored string, or undefined when storage is blocked, or null when empty. */
function readRaw(): string | null | undefined {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return undefined;
  }
}

/**
 * Saved codes from this browser's local storage, kept in sync across the
 * generator and the saved list. Server render and first paint see no codes.
 */
export function useSavedCodes(): {
  codes: SavedCode[];
  available: boolean;
  store: (next: SavedCode[]) => StoreResult;
} {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const codes = useMemo(() => (raw ? parseSavedCodes(raw) : []), [raw]);
  const store = useCallback((next: SavedCode[]): StoreResult => {
    const result = storeSavedCodes(next);
    if (result.ok) window.dispatchEvent(new Event(CHANGE_EVENT));
    return result;
  }, []);
  return { codes, available: raw !== undefined, store };
}
