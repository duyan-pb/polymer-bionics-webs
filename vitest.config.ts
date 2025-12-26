/**
 * Vitest Configuration
 * 
 * Test framework configuration for unit and integration testing.
 * 
 * Features:
 * - React Testing Library with happy-dom environment
 * - V8 coverage provider with HTML and LCOV reporters
 * - Coverage thresholds per critical module (≥80% for analytics)
 * - Mock configuration for external dependencies
 * - JSON reporter for CI/CD integration
 * 
 * Coverage Targets:
 * - Global: 75% statements, 65% branches, 80% functions
 * - Analytics core (consent, identity, tracker): 85-90%
 * - Schemas: 95%+
 * 
 * Run: npm run test | npm run test:coverage
 */
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
    exclude: ['node_modules', 'dist', 'src/components/ui/**'],
    
    // Retry flaky tests once (track flaky rate)
    retry: 1,
    
    // Reporter for CI/CD integration
    reporters: ['default', 'json'],
    outputFile: {
      json: 'reports/test-results.json',
    },
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      
      // All source files for comprehensive coverage
      include: [
        'src/lib/**/*.ts',
        'src/components/ConsentBanner.tsx',
        'src/components/AnalyticsProvider.tsx',
        'src/components/ClickableCard.tsx',
        'src/components/Breadcrumbs.tsx',
        'src/components/PageHero.tsx',
        'src/components/Navigation.tsx',
        'src/ErrorFallback.tsx',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/test/**',
        'src/**/__tests__/**',
        'src/components/ui/**',
      ],
      
      // Coverage thresholds - ≥80% for critical modules
      thresholds: {
        // Global thresholds (baseline)
        global: {
          statements: 75,
          branches: 65,
          functions: 80,
          lines: 75,
        },
        // Per-file thresholds for critical modules
        'src/lib/analytics/consent.ts': {
          statements: 90,
          branches: 70,
          functions: 95,
          lines: 90,
        },
        'src/lib/analytics/identity.ts': {
          statements: 85,
          branches: 75,
          functions: 90,
          lines: 85,
        },
        'src/lib/analytics/tracker.ts': {
          statements: 85,
          branches: 75,
          functions: 90,
          lines: 85,
        },
        'src/lib/analytics/schemas.ts': {
          statements: 95,
          branches: 85,
          functions: 100,
          lines: 95,
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
