# Copilot Instructions for Polymer Bionics Website

## Project Overview
A React application for a biotech company website showcasing medical device innovations. Built with Vite, React 19, Tailwind CSS v4, and shadcn/ui components.

## Architecture

### State Management
- Static data is imported directly from source files in `lib/*.ts`
- Page components receive data as props from App.tsx
- No localStorage caching - data is always fresh from source files

### Centralized Constants
- Navigation items, team categories, and page transitions are defined in [src/lib/constants.ts](src/lib/constants.ts)
- Always use `NAV_ITEMS` from constants instead of defining navigation inline
- Use `TEAM_CATEGORIES` for team member categorization
- Use `PAGE_TRANSITION` for consistent page animations

### Component Patterns
```tsx
// Page components receive data from App.tsx via props
// All page components should accept onNavigate prop for navigation
export function TeamPage({ team, onNavigate }: { team: TeamMember[], onNavigate: (page: string) => void }) {
  // Use team prop directly - no hooks needed
}
```

### Custom Hooks
- `useTheme()` - Theme management with localStorage persistence ([src/hooks/use-theme.ts](src/hooks/use-theme.ts))
- `useMobile()` - Responsive breakpoint detection ([src/hooks/use-mobile.ts](src/hooks/use-mobile.ts))

### Reusable Components
- `PageHero` - Standardized hero section for all pages ([src/components/PageHero.tsx](src/components/PageHero.tsx))
- `ClickableCard` - Accessible card with keyboard navigation ([src/components/ClickableCard.tsx](src/components/ClickableCard.tsx))
- `Breadcrumbs` - Navigation breadcrumbs ([src/components/Breadcrumbs.tsx](src/components/Breadcrumbs.tsx))
- `ContactLinks` - WhatsApp/Email contact buttons ([src/components/ContactLinks.tsx](src/components/ContactLinks.tsx))
- `GlobalSearch` - Site-wide search with keyboard shortcuts ([src/components/GlobalSearch.tsx](src/components/GlobalSearch.tsx))
- `BackToTopButton` - Scroll-to-top floating button ([src/components/BackToTopButton.tsx](src/components/BackToTopButton.tsx))
- `FloatingContactButton` - Floating contact CTA ([src/components/FloatingContactButton.tsx](src/components/FloatingContactButton.tsx))

### Data Flow
1. **Static data** defined in lib/*.ts files (team-data.ts, seed-data.ts, etc.)
2. **App.tsx** imports data directly and passes to page components as props
3. Every deployment gets fresh data from source files

### Navigation
- Single-page app with state-based routing in App.tsx
- Pages: home | team | materials | applications | products | media | datasheets | news | contact | payment
- Navigation items centralized in constants.ts

## Key Conventions

### UI Components
- Use **shadcn/ui** (new-york style) from `@/components/ui/*`
- Icons: **Phosphor Icons** (`@phosphor-icons/react`), use weight="duotone"
- Animations: **Framer Motion** for transitions
- Toasts: **Sonner** (`toast.success()`, `toast.error()`)

### Styling
- Tailwind CSS v4 with CSS variables for theming
- Primary: teal/turquoise (`--color-primary`)
- Use constants like HERO_SECTION_CLASSES, CONTENT_SECTION_CLASSES

### Path Aliases
- `@/` maps to `src/` - always use for imports

## File Organization
```
src/
├── components/          # Feature pages + shared components
│   ├── PageHero.tsx     # Reusable hero section
│   ├── ClickableCard.tsx # Accessible clickable cards
│   ├── Breadcrumbs.tsx  # Navigation breadcrumbs
│   ├── GlobalSearch.tsx # Site-wide search
│   ├── Navigation.tsx   # Header navigation
│   ├── Footer.tsx       # Site footer
│   ├── contact/         # Contact form components
│   ├── __tests__/       # Component tests
│   └── ui/              # shadcn/ui primitives (DO NOT edit)
├── hooks/
│   ├── use-theme.ts     # Theme management hook
│   ├── use-mobile.ts    # Responsive detection hook
│   └── __tests__/       # Hook tests
├── lib/
│   ├── analytics/       # Analytics infrastructure
│   ├── constants.ts     # Centralized constants (NAV_ITEMS, etc.)
│   ├── types.ts         # All TypeScript interfaces
│   ├── utils.ts         # cn() helper and utilities
│   ├── feature-flags.ts # Feature flag system
│   ├── analytics-config.ts # Analytics configuration
│   ├── seed-data.ts     # Product generation
│   ├── team-data.ts     # Team definitions
│   ├── materials-data.ts # Materials & applications
│   ├── media-data.ts    # Videos and case studies
│   ├── publications-data.ts # Publications data
│   └── contact-config.ts # Contact info
├── test/
│   ├── setup.ts         # Vitest setup
│   └── mocks/           # Test mocks
└── styles/theme.css     # CSS variables
```

## Common Tasks

### Adding a New Page
1. Create component with `onNavigate` prop
2. Add case in App.tsx renderPage()
3. Add nav item in constants.ts NAV_ITEMS

### Adding New Data
1. Define interface in types.ts
2. Add data to appropriate lib/*.ts file
3. Import in App.tsx and pass to page component

## Anti-Patterns to Avoid
- Don't define navigation items inline - use NAV_ITEMS
- Don't duplicate interface definitions - use types.ts
- Don't use 'image' field - use 'imageUrl' consistently
- Don't omit onNavigate prop from page components
- Don't use Card with onClick directly - use ClickableCard for accessibility
- Don't forget useMemo for filtered/computed data
- Don't create inline onClick handlers - use useCallback for stable references

## CI/CD & Deployment

### GitHub Actions Workflows
- **main_polymerbionics-webapp.yml** - Build and deploy to Azure on push to `main`
- **pr-validation.yml** - Lint, type check, and build verification on PRs
- **dependency-review.yml** - Security scanning for dependencies on PRs

### Build Environment Variables
These are injected during CI builds and accessible via `import.meta.env`:
- `VITE_BUILD_TIME` - Commit timestamp
- `VITE_BUILD_SHA` - Git commit SHA
- `VITE_BUILD_REF` - Branch name

### Azure Deployment
- App deploys to Azure Web App: `polymerbionics-webapp.azurewebsites.net`
- Uses OIDC authentication (no secrets stored)
- `web.config` is auto-generated for SPA routing
- Health check runs after deployment

## Testing Locally
```bash
npm run dev          # Development server
npm run build        # Production build (with type check)
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run validate     # Run all checks (lint, typecheck, test, build)
```

### Empty State Pattern ("Coming Soon")
Pages with empty data arrays display a "Coming Soon" card with:
- A relevant Phosphor icon (weight="light", size=80)
- Heading: "{Content type} coming soon"
- Description explaining the content will be available soon
- ContactLinks component for user engagement

Example pages using this pattern:
- DatasheetsPage (datasheets)
- MediaPage (videos, case studies)
- NewsPage (news, publications)

### Placeholder Content
Many data files contain placeholder content marked with `// TODO:` comments. See [TODO.md](../TODO.md) for a complete list of:
- Team member bios needing real content
- Product descriptions and specifications
- Materials and applications data
- Media URLs (videos, PDFs)
- Configuration values (analytics, contact info)
