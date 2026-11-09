import type { MetadataRoute } from "next";

const SITE = "https://qr.donotpanic.space";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${SITE}/en`, sl: `${SITE}/sl` };
  return ["en", "sl"].map((lang) => ({
    url: `${SITE}/${lang}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
