import { notFound } from 'next/navigation';
import { LegalPage, legalMetadata } from '@/components/LegalPage';
import { hasLocale, locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return legalMetadata(lang, 'terms');
}

export default async function Page({ params }: PageProps<'/[lang]/terms'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} kind="terms" />;
}
