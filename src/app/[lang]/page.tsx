import { notFound } from 'next/navigation';
import { Generator } from '@/components/Generator';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { I18nProvider } from '@/i18n/I18nProvider';

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <I18nProvider locale={lang} dict={dict}>
      <Generator />
    </I18nProvider>
  );
}
