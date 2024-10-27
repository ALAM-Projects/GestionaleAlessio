/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: "/dashboard/client/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
};

export default nextConfig;
