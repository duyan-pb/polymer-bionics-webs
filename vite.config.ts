/**
 * Vite Configuration
 * 
 * Build tooling configuration for the Polymer Bionics React application.
 * 
 * Features:
 * - React with SWC for fast compilation
 * - Tailwind CSS v4 integration
 * - Phosphor Icons proxy plugin
 * - Optimized chunk splitting for better caching
 * - Path alias (@/) for clean imports
 * 
 * @see https://vite.dev/config/
 */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
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
    // Enable asset inlining for small assets
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
  // Esbuild optimizations for faster builds
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
