import { rmRedirects } from "./rm-redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.bvnofficial.com"],
  },
  async rewrites() {
    return [
    ];
  },
  async redirects() {
    return [
      // Revolution Materials bare domain and .au domain (host-gated, see rm-redirects.mjs).
      ...rmRedirects(),
      // Skinlux app suite demo: the hub's links are relative, so send the short URL to the file.
      { source: "/clients/skinlux", destination: "/clients/skinlux/index.html", permanent: false },
      // Keighran Legal and Legend Lending app suite demos (sample data, relative links).
      { source: "/clients/keighran-legal", destination: "/clients/keighran-legal/index.html", permanent: false },
      { source: "/clients/legend-lending", destination: "/clients/legend-lending/index.html", permanent: false },
      // Rogalski Lawyers "Claim Command" demo (sample data).
      { source: "/clients/rogalski-lawyers", destination: "/clients/rogalski-lawyers/index.html", permanent: false },
      // Moved the Regal Homes client deliverable under /client/.
      { source: "/regal-homes", destination: "/client/regal-homes", permanent: true },
      { source: "/regal-homes/:path*", destination: "/client/regal-homes/:path*", permanent: true },
      // Convenience: catch the shortened Discovery & Setup link (missing the phone-and-payments segment).
      { source: "/clients/regal-homes/discovery-setup", destination: "/clients/regal-homes/phone-and-payments/discovery-setup", permanent: false },
      // Raetzer client demos moved from /raetzer-pllc to /raetzer.
      { source: "/clients/raetzer-pllc", destination: "/clients/raetzer", permanent: false },
      { source: "/clients/raetzer-pllc/:path*", destination: "/clients/raetzer/:path*", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "bluetooth=*",
          },
        ],
      },
      {
        // Never cache the standalone HTML tool pages
        source: "/:tool.html",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
