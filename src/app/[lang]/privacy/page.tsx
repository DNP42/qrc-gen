import { notFound } from 'next/navigation';
import { LegalPage, legalMetadata } from '@/components/LegalPage';
import { hasLocale, locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return legalMetadata(lang, 'privacy');
}

export default async function Page({ params }: PageProps<'/[lang]/privacy'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} kind="privacy" />;
}
