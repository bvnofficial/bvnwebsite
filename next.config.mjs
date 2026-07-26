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
      // Moved the Regal Homes client deliverable under /client/.
      { source: "/regal-homes", destination: "/client/regal-homes", permanent: true },
      { source: "/regal-homes/:path*", destination: "/client/regal-homes/:path*", permanent: true },
      // Convenience: catch the shortened Discovery & Setup link (missing the phone-and-payments segment).
      { source: "/clients/regal-homes/discovery-setup", destination: "/clients/regal-homes/phone-and-payments/discovery-setup", permanent: false },
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
