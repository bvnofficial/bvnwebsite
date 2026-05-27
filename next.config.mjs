/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.bvnofficial.com"],
  },
  async rewrites() {
    return [
      { source: "/x1r", destination: "/x1r/index.html" },
      { source: "/x1r/", destination: "/x1r/index.html" },
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
