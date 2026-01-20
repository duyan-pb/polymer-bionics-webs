# Polymer Bionics Website

[![Build and Deploy](https://github.com/duyan-pb/polymer-bionics-webs/actions/workflows/main_polymerbionics-webapp.yml/badge.svg)](https://github.com/duyan-pb/polymer-bionics-webs/actions/workflows/main_polymerbionics-webapp.yml)
[![PR Validation](https://github.com/duyan-pb/polymer-bionics-webs/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/duyan-pb/polymer-bionics-webs/actions/workflows/pr-validation.yml)

A professional biotech company website showcasing Polymer Bionics' medical innovations, team expertise, and research publications in polymer-based bioelectronics and flexible medical device technology.

**Live Site:** [polymerbionics-webapp.azurewebsites.net](https://polymerbionics-webapp.azurewebsites.net)

## Features

- **Team Profiles** - Showcase team members with credentials and research interests
- **Product Catalog** - Display medical products with specifications and applications
- **Materials Library** - Comprehensive biomaterial offerings with technical properties
- **Applications Gallery** - Real-world clinical applications and use cases
- **Media Center** - Videos, case studies, and downloadable resources
- **Technical Datasheets** - Organized library of downloadable documentation
- **News & Publications** - Company news and scientific publications feed

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI Framework |
| [Vite](https://vitejs.dev) | Build Tool |
| [TypeScript](https://typescriptlang.org) | Type Safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | Component Library |
| [Framer Motion](https://framer.com/motion) | Animations |
| [Phosphor Icons](https://phosphoricons.com) | Icons |
| [GitHub Spark](https://githubnext.com/projects/github-spark) | KV Store & Hosting |

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/duyan-pb/polymer-bionics-webs.git
cd polymer-bionics-webs

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5000 |
| `npm run build` | Build for production (includes type check) |
| `npm run build:static` | Build for static hosting (Netlify, Vercel) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:mutation` | Run mutation tests with Stryker |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run type-coverage` | Check type coverage (≥95%) |
| `npm run knip` | Find unused code and dependencies |
| `npm run validate` | Run all checks (lint, test, build) |
| `npm run clean` | Clean build artifacts |

## Testing

The project uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/react) for comprehensive testing with mutation testing support via [Stryker](https://stryker-mutator.io/).

### Coverage Thresholds

| Metric | Global | Analytics Core | Schemas |
|--------|--------|----------------|----------|
| Statements | 75% | 85-90% | 95% |
| Branches | 65% | 70-75% | 85% |
| Functions | 80% | 90-95% | 100% |
| Lines | 75% | 85-90% | 95% |

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run mutation tests
npm run test:mutation

# Run specific test file
npm run test -- src/lib/analytics/__tests__/consent.test.ts
```

### Test Structure

```
src/
├── components/__tests__/     # Component tests
│   ├── ConsentBanner.test.tsx
│   ├── Navigation.test.tsx
│   └── ...
├── lib/__tests__/            # Utility/library tests
│   ├── feature-flags.test.ts
│   └── utils.test.ts
└── lib/analytics/__tests__/  # Analytics module tests
    ├── consent.test.ts
    ├── tracker.test.ts
    ├── identity.test.ts
    └── ...
```

## Project Structure

```
src/
├── components/              # Feature pages + shared components
│   ├── ui/                  # shadcn/ui primitives (DO NOT edit)
│   ├── contact/             # Contact form components
│   ├── __tests__/           # Component unit tests
│   ├── HomePage.tsx         # Landing page
│   ├── TeamPage.tsx         # Team member profiles
│   ├── ProductsPage.tsx     # Product showcase
│   ├── MaterialsPage.tsx    # Materials library
│   ├── ApplicationsPage.tsx # Clinical applications
│   ├── MediaPage.tsx        # Videos & case studies
│   ├── DatasheetsPage.tsx   # Technical datasheets
│   ├── NewsPage.tsx         # News & publications
│   ├── ContactPage.tsx      # Contact information
│   ├── PageHero.tsx         # Reusable page hero section
│   ├── ClickableCard.tsx    # Accessible clickable cards
│   ├── Breadcrumbs.tsx      # Navigation breadcrumbs
│   ├── Navigation.tsx       # Header navigation
│   ├── Footer.tsx           # Site footer
│   ├── GlobalSearch.tsx     # Site-wide search
│   ├── ConsentBanner.tsx    # GDPR consent banner
│   └── AnalyticsProvider.tsx # Analytics initialization
├── hooks/
│   ├── use-theme.ts         # Theme management hook
│   ├── use-mobile.ts        # Responsive breakpoint detection
│   ├── use-kv.ts            # localStorage KV (static deployments)
│   └── __tests__/           # Hook unit tests
├── lib/
│   ├── analytics/           # Analytics infrastructure
│   │   ├── __tests__/       # Analytics unit tests
│   │   ├── consent.ts       # Consent management (GDPR)
│   │   ├── tracker.ts       # Event tracking wrapper
│   │   ├── identity.ts      # Anonymous identity
│   │   ├── schemas.ts       # Zod validation schemas
│   │   ├── attribution.ts   # UTM tracking
│   │   ├── app-insights.ts  # Azure Application Insights
│   │   ├── ga4.ts           # Google Analytics 4
│   │   ├── session-replay.ts # Microsoft Clarity
│   │   ├── web-vitals.ts    # Core Web Vitals
│   │   └── cost-control.ts  # Budget management
│   ├── __tests__/           # Library unit tests
│   ├── constants.ts         # Navigation, categories, transitions
│   ├── types.ts             # TypeScript interfaces
│   ├── feature-flags.ts     # Feature flag system
│   ├── analytics-config.ts  # Analytics configuration
│   ├── utils.ts             # Utility functions (cn, etc.)
│   ├── spark-stub.ts        # No-op Spark runtime (static deployments)
│   ├── seed-data.ts         # Product seed data
│   ├── team-data.ts         # Team member data
│   ├── materials-data.ts    # Materials & applications
│   ├── media-data.ts        # Video/case study data
│   ├── publications-data.ts # Publications data
│   └── contact-config.ts    # Contact information
├── test/                    # Test configuration
│   ├── setup.ts             # Vitest setup
│   └── mocks/               # Test mocks (Spark, window, etc.)
├── types/                   # Additional type definitions
│   ├── spark.d.ts           # GitHub Spark types
│   └── lucide-react.d.ts    # Lucide icon types
└── styles/
    └── theme.css            # CSS custom properties

api/                         # Azure Functions
└── src/functions/
    └── events.ts            # Server-side event collection

docs/                        # Documentation
└── ANALYTICS.md             # Analytics infrastructure docs
```

## CI/CD Pipeline

### Automated Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Build & Deploy** | Push to `main` | Deploys to Azure Web App |
| **PR Validation** | Pull requests | Lint, type check, test, build verification |
| **Dependency Review** | Pull requests | Security vulnerability scanning |
| **CodeQL Analysis** | Push/PR/Weekly | Static code security analysis || **Code Quality** | Push/PR | Code quality metrics and analysis || **Dependabot** | Weekly | Automated dependency updates |

### Deployment

The site automatically deploys to Azure Web App when changes are pushed to `main`:

1. Builds the Vite application
2. Runs all tests and coverage checks
3. Creates `web.config` for SPA routing
4. Deploys to Azure using OIDC authentication
5. Runs health check to verify deployment

### Static Hosting (Netlify/Vercel)

The app can also be deployed to static hosting platforms like Netlify or Vercel:

```bash
# Build for static deployment
npm run build:static
```

This uses a localStorage-based KV store instead of GitHub Spark's backend. The build process:
- Aliases `@github/spark/hooks` to a localStorage-based `useKV` hook
- Aliases `@github/spark/spark` to a no-op stub (prevents `/_spark/` API calls)
- Data persists in browser localStorage with `spark_kv_` prefix
- Supports cross-tab synchronization via storage events

**Netlify Configuration** (already included in `netlify.toml`):
- Build command: `npm run build:static`
- Publish directory: `dist`
- SPA routing: All routes redirect to `index.html`

## Analytics

The project includes a comprehensive analytics infrastructure with privacy-first design:

| Feature | Description |
|---------|-------------|
| **Consent Management** | GDPR-compliant consent banner with granular controls |
| **Azure App Insights** | Application performance monitoring |
| **Google Analytics 4** | User behavior analytics |
| **Microsoft Clarity** | Session replay and heatmaps |
| **Web Vitals** | Core Web Vitals tracking (LCP, FID, CLS) |
| **Feature Flags** | A/B testing and feature rollouts |

For detailed documentation, see [docs/ANALYTICS.md](docs/ANALYTICS.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [GitHub Spark](https://githubnext.com/projects/github-spark)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Phosphor Icons](https://phosphoricons.com)
