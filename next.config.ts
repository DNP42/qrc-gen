import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
