import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

// Server-side loader: each page pulls in only its own language. The result
// is plain data, so it can be passed to client components as a prop.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en').then((m) => m.en),
  sl: () => import('./dictionaries/sl').then((m) => m.sl),
  es: () => import('./dictionaries/es').then((m) => m.es),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
