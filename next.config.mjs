import createMDX from '@next/mdx'
import CopyPlugin from "copy-webpack-plugin";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: "node_modules/pdfkit/js/data",
              to: "vendor-chunks/data",
            },
          ],
        })
      );
    }
    config.externals = config.externals || [];
    config.externals.push(
      "chrome-aws-lambda",
      "puppeteer",
      /^puppeteer[/\\]/,
      /^chrome-aws-lambda[/\\]/
    );
    // Ensure `fs` is disabled for client-side bundles
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  }, 
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure the file extensions that Next.js should handle as pages
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig)
