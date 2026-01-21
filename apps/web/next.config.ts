import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn-icons-png.flaticon.com/**"),
      new URL("https://upload.wikimedia.org/**"),
      new URL("https://freepnglogo.com/**"),
      new URL("https://www.ipify.org/**")
    ],
  }
};

export default nextConfig;
