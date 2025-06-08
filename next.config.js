/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig