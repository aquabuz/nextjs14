/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // log twice
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return [
      {
        source: "/admin-api/back-office/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/:path*`,
      },
    ];
  },
  //   trailingSlash: true,
};

export default nextConfig;
