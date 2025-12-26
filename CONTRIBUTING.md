# Contributing to Polymer Bionics Website

Thank you for your interest in contributing to the Polymer Bionics website! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Architecture Guidelines](#architecture-guidelines)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/polymer-bionics-webs.git
   cd polymer-bionics-webs
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/duyan-pb/polymer-bionics-webs.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the [code style](#code-style) guidelines

4. **Run checks**:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

5. **Commit your changes** using [conventional commits](#commit-messages)

6. **Push and create a PR**

## Testing Guidelines

We use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/react) for testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- path/to/test.ts
```

### Coverage Thresholds

All PRs must maintain these minimum coverage thresholds:

| Metric | Threshold |
|--------|-----------|
| Statements | 75% |
| Branches | 65% |
| Functions | 80% |
| Lines | 75% |

### Writing Tests

1. **Place tests** in `__tests__/` directories adjacent to source files
2. **Name test files** with `.test.ts` or `.test.tsx` extension
3. **Use descriptive test names** that explain the expected behavior
4. **Follow AAA pattern**: Arrange, Act, Assert

```tsx
// Good test example
describe('useTheme', () => {
  it('should return dark theme when system prefers dark', () => {
    // Arrange
    mockMatchMedia(true) // prefers dark
    
    // Act
    const { result } = renderHook(() => useTheme())
    
    // Assert
    expect(result.current.theme).toBe('dark')
  })
})
```

### Test Categories

| Category | Location | Description |
|----------|----------|-------------|
| Unit Tests | `src/**/__tests__/` | Test individual functions and hooks |
| Component Tests | `src/components/__tests__/` | Test React component behavior |
| Integration Tests | `src/lib/analytics/__tests__/` | Test module interactions |

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define interfaces in `src/lib/types.ts`
- Use proper type annotations, avoid `any`

### React Components

- Use functional components with hooks
- Accept `onNavigate` prop for page components
- Use `useMemo` for computed data
- Use `useCallback` for stable function references

```tsx
// Good
export function MyPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const handleClick = useCallback(() => {
    onNavigate('home');
  }, [onNavigate]);
  
  return <Button onClick={handleClick}>Go Home</Button>;
}

// Avoid
export function MyPage({ onNavigate }) {
  return <Button onClick={() => onNavigate('home')}>Go Home</Button>;
}
```

### Styling

- Use Tailwind CSS classes
- Use CSS variables from `theme.css` for colors
- Use constants from `src/lib/constants.ts` for repeated class patterns

### Imports

- Use `@/` path alias for all imports
- Order: React -> External libs -> Internal modules -> Types -> Styles

```tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/constants';
import type { TeamMember } from '@/lib/types';
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |
| `ci` | CI/CD changes |

### Examples

```
feat(team): add team member filtering by category
fix(navigation): resolve mobile menu not closing on page change
docs: update README with deployment instructions
chore(deps): update dependencies to latest versions
```

## Pull Request Process

1. **Fill out the PR template** completely

2. **Ensure all checks pass**:
   - ESLint (code quality)
   - TypeScript (type checking)
   - Vitest (unit tests with coverage thresholds)
   - Build (production build)
   - Dependency review (security)

3. **Add tests** for new functionality:
   - New features require corresponding test coverage
   - Bug fixes should include regression tests
   - Maintain or improve existing coverage

4. **Request review** from @duyan-pb

5. **Address feedback** promptly

6. **Squash commits** if requested

### PR Title Format

Use the same format as commit messages:
```
feat(products): add product comparison feature
```

## Architecture Guidelines

### Adding a New Page

1. Create component in `src/components/`:
   ```tsx
   export function NewPage({ onNavigate }: { onNavigate: (page: string) => void }) {
     return <div>New Page</div>;
   }
   ```

2. Add case in `App.tsx` `renderPage()`:
   ```tsx
   case 'newpage':
     return <NewPage onNavigate={handleNavigate} />;
   ```

3. Add nav item in `src/lib/constants.ts`:
   ```tsx
   { id: 'newpage', label: 'New Page', icon: IconName }
   ```

### Adding New Data Types

1. Define interface in `src/lib/types.ts`
2. Create seed data in `src/lib/[name]-data.ts`
3. Add KV subscription in `App.tsx`
4. Create initializer component if needed

### Using the KV Store

```tsx
import { useKV } from '@github/spark/hooks';

// In component
const [data, setData] = useKV<DataType[]>('key', defaultValue);
```

### Reusable Components

| Component | Purpose |
|-----------|---------|
| `PageHero` | Standardized page headers |
| `ClickableCard` | Accessible clickable cards |
| `Breadcrumbs` | Navigation breadcrumbs |
| `ContactLinks` | Contact action buttons |

## Questions?

Open a [Discussion](https://github.com/duyan-pb/polymer-bionics-webs/discussions) for questions or suggestions.

---

Thank you for contributing!
