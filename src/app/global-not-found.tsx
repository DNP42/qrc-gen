import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { geistMono, geistSans } from "./fonts";
import "./globals.css";

// Unknown URLs (/de, /whatever) have no language to read, so every language
// gets its own block. Next adds <meta name="robots" content="noindex"> itself.
export const metadata: Metadata = {
  title: "qrc-gen — 404",
};

export default async function GlobalNotFound() {
  const blocks = await Promise.all(
    locales.map(async (locale) => ({ locale, t: (await getDictionary(locale)).notFound })),
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <h1 className="font-mono text-6xl text-[var(--hawk)] hawk-glow scanline">{404}</h1>
        {blocks.map(({ locale, t }) => (
          <section key={locale} lang={locale} className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">{t.heading}</h2>
            <p className="font-mono text-sm text-[var(--muted)]">{t.body}</p>
            <Link
              href={`/${locale}`}
              className="inline-block font-mono text-xs text-[var(--hawk)] hover:underline"
            >
              {t.back}
            </Link>
          </section>
        ))}
      </body>
    </html>
  );
}
