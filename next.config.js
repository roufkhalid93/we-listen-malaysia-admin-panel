/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 auto-generates AGENTS.md / CLAUDE.md on dev start; opt out.
  agentRules: false,
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
