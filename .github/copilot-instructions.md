# Copilot Instructions for Polymer Bionics Website

## Project Overview
A **GitHub Spark** React application for a biotech company website showcasing medical device innovations. Built with Vite, React 19, Tailwind CSS v4, and shadcn/ui components.

## Architecture

### State Management with Spark KV Store
- Data persistence uses `useKV` hook from `@github/spark/hooks` (not React state or localStorage)
- Pattern: `const [data, setData] = useKV<Type[]>('key', defaultValue)`
- All entities (team, products, videos, etc.) stored in KV with typed interfaces from [src/lib/types.ts](src/lib/types.ts)

### Component Patterns
```tsx
// Page components receive data from App.tsx via props
export function TeamPage({ team }: { team: TeamMember[] }) {
  const [team, setTeam] = useKV<TeamMember[]>('team', initialTeam) // re-subscribe to enable updates
}
```

### Data Flow
1. **Initializers** ([ProductsInitializer.tsx](src/components/ProductsInitializer.tsx), [TeamInitializer.tsx](src/components/TeamInitializer.tsx)) seed KV store on first load
2. **Seed data** defined in [src/lib/seed-data.ts](src/lib/seed-data.ts), [team-data.ts](src/lib/team-data.ts), [materials-data.ts](src/lib/materials-data.ts)
3. **App.tsx** subscribes to all KV stores and passes to page components

### Navigation
- Single-page app with state-based routing in [App.tsx](src/App.tsx): `useState('home')` + `switch(currentPage)`
- Pages: `home | team | materials | applications | products | media | datasheets | news | contact`

## Key Conventions

### UI Components
- Use **shadcn/ui** (new-york style) from `@/components/ui/*` - see [components.json](components.json)
- Icons: **Phosphor Icons** (`@phosphor-icons/react`), use weight="duotone" for decorative icons
- Animations: **Framer Motion** for transitions
- Toasts: **Sonner** (`toast.success()`, `toast.error()`)

### Styling
- Tailwind CSS v4 with CSS variables for theming
- Theme colors defined in [src/styles/theme.css](src/styles/theme.css) using Radix UI color system
- Primary: teal/turquoise (`--color-primary`), use `text-primary`, `bg-primary`
- Spacing: Cards use `p-6`, sections use `py-16 px-8`, max container `max-w-[1280px] mx-auto`

### Path Aliases
- `@/` maps to `src/` - always use this for imports: `import { cn } from '@/lib/utils'`

### Spark-Specific Features
- LLM integration: `await window.spark.llm(prompt, "gpt-4o", true)` - returns JSON
- User context: `await window.spark.user()` returns `{ isOwner: boolean }`
- Images: Import directly from `@/assets/images/*`

## File Organization
```
src/
├── components/          # Feature pages + shared components
│   └── ui/              # shadcn/ui primitives (DO NOT edit directly)
├── lib/
│   ├── types.ts         # All TypeScript interfaces
│   ├── utils.ts         # cn() helper for classnames
│   ├── seed-data.ts     # Product generation
│   ├── team-data.ts     # Team member definitions
│   ├── materials-data.ts # Materials & applications data
│   └── contact-config.ts # Contact info configuration
└── styles/theme.css     # CSS variables & Radix colors
```

## Development Commands
```bash
npm run dev      # Start Vite dev server (port 5000)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run kill     # Kill process on port 5000
```

## Common Tasks

### Adding a New Page
1. Create component in `src/components/NewPage.tsx`
2. Add case in [App.tsx](src/App.tsx) `renderPage()` switch
3. Add nav item in [Navigation.tsx](src/components/Navigation.tsx) `navItems` array

### Adding New Data Types
1. Define interface in [src/lib/types.ts](src/lib/types.ts)
2. Add KV subscription in [App.tsx](src/App.tsx)
3. Create initializer component if data needs seeding

### Updating Contact Info
Edit [src/lib/contact-config.ts](src/lib/contact-config.ts) - used by ContactPage and FloatingContactButton
