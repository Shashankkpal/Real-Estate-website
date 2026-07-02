/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlxksbmdsnpnmqzqkihw.supabase.co",
      },
    ],
  },
};

export default nextConfig;