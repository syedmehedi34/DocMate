/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ibb.co image hosting (both variants)
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      // localhost — for doctor profile images stored locally
      {
        protocol: "http",
        hostname: "localhost",
      },
      // Google (NextAuth profile pictures)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
