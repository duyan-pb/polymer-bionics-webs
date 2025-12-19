# Contributing to Polymer Bionics Website

Thank you for your interest in contributing to the Polymer Bionics website! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
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
   npm run build
   ```

5. **Commit your changes** using [conventional commits](#commit-messages)

6. **Push and create a PR**

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
   - Build (production build)
   - Dependency review (security)

3. **Request review** from @duyan-pb

4. **Address feedback** promptly

5. **Squash commits** if requested

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
