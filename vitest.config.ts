import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html'],
      include: ['src/lib/analytics/**/*.ts', 'src/lib/feature-flags.ts', 'src/components/ConsentBanner.tsx', 'src/components/AnalyticsProvider.tsx'],
      exclude: ['src/**/*.d.ts', 'src/test/**'],
      thresholds: {
        global: {
          // Realistic thresholds given internal/untestable code
          // (script loading, SDK internals, re-export files)
          statements: 78,
          branches: 65,
          functions: 85,
          lines: 78,
        },
      },
    },
    // Mock external modules that are dynamically imported
    alias: {
      '@microsoft/applicationinsights-web': path.resolve(__dirname, './src/test/mocks/applicationinsights-web.ts'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
