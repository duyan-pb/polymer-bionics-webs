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
      // When doing static deploy, use localStorage-based KV hook and stub Spark runtime
      ...(isStaticDeploy ? {
        '@github/spark/hooks': resolve(projectRoot, 'src/hooks/use-kv.ts'),
        '@github/spark/spark': resolve(projectRoot, 'src/lib/spark-stub.ts'),
      } : {}),
    }
  },
  build: {
    // Enable minification and tree-shaking
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Optimize chunk splitting
    rollupOptions: {
      // Mark optional dependencies as external - they are loaded dynamically at runtime
      external: ['@microsoft/applicationinsights-web', 'web-vitals'],
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix'
            }
            if (id.includes('@phosphor-icons')) {
              return 'vendor-icons'
            }
            if (id.includes('sonner') || id.includes('cmdk')) {
              return 'vendor-ui'
            }
          }
          // Split analytics into separate chunk (lazy loaded)
          if (id.includes('/lib/analytics/')) {
            return 'analytics'
          }
          return undefined
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
});
