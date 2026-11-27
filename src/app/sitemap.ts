import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const SITE = "https://qr.donotpanic.space";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`]));
  return locales.map((lang) => ({
    url: `${SITE}/${lang}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
