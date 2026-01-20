/**
 * Vite Configuration
 * 
 * Build tooling configuration for the Polymer Bionics React application.
 * 
 * Features:
 * - React with SWC for fast compilation
 * - Tailwind CSS v4 integration
 * - GitHub Spark plugin integration
 * - Phosphor Icons proxy plugin
 * - Optimized chunk splitting for better caching
 * - Path alias (@/) for clean imports
 * 
 * @see https://vite.dev/config/
 */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

/**
 * Check if we're building for a static deployment (e.g., Netlify, Azure Static Web Apps)
 * When STATIC_DEPLOY is set, we use a local localStorage-based KV implementation
 * instead of the GitHub Spark KV backend.
 */
const isStaticDeploy = process.env.STATIC_DEPLOY === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    // Only include Spark plugin when not doing static deploy
    ...(isStaticDeploy ? [] : [sparkPlugin() as PluginOption]),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      // When doing static deploy, use localStorage-based KV hook instead of Spark's
      ...(isStaticDeploy ? {
        '@github/spark/hooks': resolve(projectRoot, 'src/hooks/use-kv.ts'),
      } : {}),
    }
  },
  build: {
    // Enable minification and tree-shaking
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Optimize chunk splitting
    rollupOptions: {
      // Mark optional dependencies as external - they are loaded dynamically at runtime
      external: ['@microsoft/applicationinsights-web', 'web-vitals'],
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
});
