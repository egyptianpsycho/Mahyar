/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
    ],
  },
};
export default nextConfig;
