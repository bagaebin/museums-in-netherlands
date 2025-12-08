/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Enable static HTML export so GitHub Pages can serve the built site directly
   * from the generated `out/index.html` bundle.
   */
  output: 'export',
};

export default nextConfig;
