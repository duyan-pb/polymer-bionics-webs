/**
 * ESLint Configuration
 * 
 * Code quality and consistency rules for TypeScript/React development.
 * 
 * Rule Categories:
 * - Type Safety: No `any`, consistent type imports
 * - Complexity: Cyclomatic < 18, max depth 4
 * - Code Style: React hooks rules, refresh constraints
 * 
 * Ignored Paths:
 * - dist/, node_modules/, packages/
 * - src/components/ui/** (shadcn primitives)
 * - *.config.* files
 * 
 * Run: npm run lint | npm run lint -- --fix
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'packages/**', '*.config.*', 'src/components/ui/**', 'src/types/**', 'reports/**', 'coverage/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // ==========================================================
      // TYPE SAFETY (target: 0 any, ≥95% type coverage)
      // ==========================================================
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      
      // ==========================================================
      // COMPLEXITY (cognitive < 15-20, cyclomatic < 10-18)
      // ==========================================================
      // Cyclomatic complexity: flag > 10 (warn), > 18 (error)
      'complexity': ['error', { max: 18 }],
      // Max nesting depth: 4 levels
      'max-depth': ['error', { max: 4 }],
      // Max nested callbacks: 3 levels (reduces cognitive load)
      'max-nested-callbacks': ['warn', { max: 3 }],
      // Max function length: 150 lines (300 is too permissive)
      'max-lines-per-function': ['warn', { 
        max: 150, 
        skipBlankLines: true, 
        skipComments: true,
        IIFEs: true,
      }],
      // Max file length: 400 lines
      'max-lines': ['warn', { 
        max: 400, 
        skipBlankLines: true, 
        skipComments: true 
      }],
      // Max function parameters: 4 (prefer object params for more)
      'max-params': ['warn', { max: 4 }],
      // Max statements per function
      'max-statements': ['warn', { max: 25 }],
      
      // ==========================================================
      // MAINTAINABILITY (reduce duplication, improve readability)
      // ==========================================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'no-unneeded-ternary': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      // Prevent magic numbers
      'no-magic-numbers': ['warn', { 
        ignore: [-1, 0, 1, 2, 100, 1000],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
      }],
      
      // ==========================================================
      // REACT BEST PRACTICES
      // ==========================================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Relaxed rules for test files
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/test/**', '**/__tests__/**'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'max-statements': 'off',
      'max-nested-callbacks': ['warn', { max: 5 }],
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
)
