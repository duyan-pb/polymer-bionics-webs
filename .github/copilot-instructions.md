# Copilot Instructions for Polymer Bionics Website

## Project Overview
A **GitHub Spark** React application for a biotech company website showcasing medical device innovations. Built with Vite, React 19, Tailwind CSS v4, and shadcn/ui components.

## Architecture

### State Management with Spark KV Store
- Data persistence uses `useKV` hook from `@github/spark/hooks` (not React state or localStorage)
- Pattern: `const [data, setData] = useKV<Type[]>('key', defaultValue)`
- All entities (team, products, videos, etc.) stored in KV with typed interfaces from [src/lib/types.ts](src/lib/types.ts)

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
  const [team, setTeam] = useKV<TeamMember[]>('team', initialTeam) // re-subscribe to enable updates
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

### Data Flow
1. **Initializers** seed KV store on first load
2. **Seed data** defined in lib/*.ts files
3. **App.tsx** subscribes to all KV stores and passes to page components

### Navigation
- Single-page app with state-based routing in App.tsx
- Pages: home | team | materials | applications | products | media | datasheets | news | contact
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

### Spark-Specific Features
- LLM: `await window.spark.llm(prompt, "gpt-4o", true)`
- User: `await window.spark.user()` returns `{ isOwner: boolean }`
- **WhatsApp/mailto links are blocked** - use copyWhatsAppNumber()

## File Organization
```
src/
├── components/          # Feature pages + shared components
│   ├── PageHero.tsx     # Reusable hero section
│   └── ui/              # shadcn/ui primitives (DO NOT edit)
├── hooks/
│   ├── use-theme.ts     # Theme management hook
│   └── use-mobile.ts    # Responsive detection hook
├── lib/
│   ├── constants.ts     # Centralized constants
│   ├── types.ts         # All TypeScript interfaces
│   ├── utils.ts         # cn() helper
│   ├── seed-data.ts     # Product generation
│   ├── team-data.ts     # Team definitions
│   ├── materials-data.ts # Materials & applications
│   └── contact-config.ts # Contact info
└── styles/theme.css     # CSS variables
```

## Common Tasks

### Adding a New Page
1. Create component with `onNavigate` prop
2. Add case in App.tsx renderPage()
3. Add nav item in constants.ts NAV_ITEMS

### Adding New Data Types
1. Define interface in types.ts
2. Add KV subscription in App.tsx
3. Create initializer if needed

## Anti-Patterns to Avoid
- Don't define navigation items inline - use NAV_ITEMS
- Don't use window.location.href for mailto - blocked in Spark
- Don't duplicate interface definitions - use types.ts
- Don't use 'image' field - use 'imageUrl' consistently
- Don't omit onNavigate prop from page components
- Don't use Card with onClick directly - use ClickableCard for accessibility
- Don't forget useMemo for filtered/computed data
- Don't create inline onClick handlers - use useCallback for stable references
