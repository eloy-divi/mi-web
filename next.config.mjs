/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Si luego usas imágenes remotas, añade tus dominios aquí
    remotePatterns: [
      // { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // Deja vacío si no lo necesitas
  },
};

export default nextConfig;
