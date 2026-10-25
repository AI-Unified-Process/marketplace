import type { NextConfig } from 'next';

const config: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' }];
  },
};

export default config;
