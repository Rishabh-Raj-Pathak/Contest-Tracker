/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for now to prevent multiple reloads in development
  reactStrictMode: false,
  // Improve caching
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Improve static asset handling
  images: {
    domains: ["codeforces.org", "leetcode.com", "img.icons8.com"],
  },
  // Static export
  output: "standalone",
};

export default nextConfig;
