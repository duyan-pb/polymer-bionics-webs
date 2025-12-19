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
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/           # Feature pages + shared components
│   ├── ui/               # shadcn/ui primitives (DO NOT edit)
│   ├── HomePage.tsx      # Landing page
│   ├── TeamPage.tsx      # Team member profiles
│   ├── ProductsPage.tsx  # Product showcase
│   └── ...               # Other page components
├── hooks/
│   ├── use-theme.ts      # Theme management
│   └── use-mobile.ts     # Responsive detection
├── lib/
│   ├── constants.ts      # Navigation, categories, transitions
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Utility functions
│   └── *-data.ts         # Seed data files
└── styles/
    └── theme.css         # CSS custom properties
```

## CI/CD Pipeline

### Automated Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Build & Deploy** | Push to `main` | Deploys to Azure Web App |
| **PR Validation** | Pull requests | Lint, type check, build verification |
| **Dependency Review** | Pull requests | Security vulnerability scanning |
| **CodeQL Analysis** | Push/PR/Weekly | Static code security analysis |
| **Dependabot** | Weekly | Automated dependency updates |

### Deployment

The site automatically deploys to Azure Web App when changes are pushed to `main`:

1. Builds the Vite application
2. Creates `web.config` for SPA routing
3. Deploys to Azure using OIDC authentication
4. Runs health check to verify deployment

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
