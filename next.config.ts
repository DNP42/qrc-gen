import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The only root layout sits under the dynamic [lang] segment, so a plain
  // app/not-found.tsx has no layout to render in and unknown URLs would get
  // Next's English-only default 404. global-not-found.tsx is the documented
  // fix for that setup (still marked experimental in Next 16).
  experimental: {
    globalNotFound: true,
  },

  // `/` has no page of its own: send it to /sl when the browser's first
  // language is Slovenian, otherwise to /en. Temporary redirects, so browsers
  // don't cache the choice. Next anchors `value` as ^…$ and compiles it
  // without the `i` flag, while language tags are case-insensitive (RFC 5646),
  // hence `[sS][lL]` for `sl`, `SL` and `Sl-SI` alike.
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "header", key: "accept-language", value: "[sS][lL](?:[-;,].*)?" }],
        destination: "/sl",
        permanent: false,
      },
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
