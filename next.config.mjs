/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        // port: "",           // optional, default empty
        // pathname: "/**",    // optional, সব path allow করতে (default /**)
      },
      // যদি আরও কোনো domain থাকে (যেমন Google profile pic বা অন্য CDN) তাহলে যোগ করো
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      // },
    ],
  },
};

export default nextConfig;
