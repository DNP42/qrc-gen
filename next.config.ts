import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `/` has no page of its own: send it to /sl when the browser's first
  // language is Slovenian, otherwise to /en. Temporary redirects, so browsers
  // don't cache the choice. Next anchors `value` as ^…$.
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "header", key: "accept-language", value: "sl(?:[-;,].*)?" }],
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
