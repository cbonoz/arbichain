/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    domains: ["images.unsplash.com", "tailwindui.com", "res.cloudinary.com", "imgbb.com"],
  },
};

export default nextConfig;
