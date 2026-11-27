import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const SITE = "https://qr.donotpanic.space";

export const dynamic = "force-static";

const PAGES = [
  { path: "", priority: 1 },
  { path: "/privacy", priority: 0.3 },
  { path: "/imprint", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}${path}`]));
    return locales.map((lang) => ({
      url: `${SITE}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
