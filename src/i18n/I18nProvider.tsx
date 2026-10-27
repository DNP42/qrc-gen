'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

interface I18nValue {
  locale: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Read-only language context for client components. The locale comes from
 * the URL (`/en`, `/sl`); it never changes within a page, so this is not state.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, dict }), [locale, dict]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useDict/useLocale must be used inside <I18nProvider>');
  return value;
}

export function useDict(): Dictionary {
  return useI18n().dict;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
