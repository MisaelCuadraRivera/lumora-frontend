/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Set the root directory for Turbopack to silence the warning
    root: ".",
  },
}

export default nextConfig
