# Planning Guide

A professional biotech company website showcasing Polymer Bionics' medical innovations, team expertise, and research publications in polymer-based bioelectronics and flexible medical device technology.

**Experience Qualities**:
1. **Pioneering** - Conveys innovation in flexible bioelectronics and polymer science through dynamic, organic design elements
2. **Approachable** - Balances scientific credibility with warmth and accessibility through softer color palettes and inviting layouts
3. **Precise** - Demonstrates technical excellence and medical-grade engineering through clean, well-organized information architecture

**Complexity Level**: Content Showcase (information-focused)
This is primarily an informational website presenting company details, team members, products, research, and publications without complex interactive features or user-generated content management.

## Essential Features

### Hero Section with Company Overview
- **Functionality**: Displays company tagline, mission statement, and key value propositions
- **Purpose**: Immediately communicates Polymer Bionics' focus and expertise in flexible bioelectronics and polymer-based medical devices
- **Trigger**: Page load on homepage
- **Progression**: User sees hero image/graphic → reads headline and tagline → views CTAs to explore sections
- **Success criteria**: Clear understanding of company mission within 5 seconds

### Team Member Profiles
- **Functionality**: Grid display of team members with photos, names, roles, and credentials
- **Purpose**: Establishes credibility and expertise through showcasing qualified personnel
- **Trigger**: Navigate to Team section
- **Progression**: View team grid → click member card → see expanded bio with research interests and publications
- **Success criteria**: All team members visible with key credentials immediately apparent

### Product Showcase
- **Functionality**: Displays medical products/technologies with descriptions, applications, and specifications
- **Purpose**: Demonstrates commercial applications and innovation pipeline
- **Trigger**: Navigate to Products section
- **Progression**: Browse product cards → click for details → view technical specs and use cases
- **Success criteria**: Clear product differentiation with visual appeal and technical depth

### Materials Catalog
- **Functionality**: Comprehensive display of biomaterial offerings with properties, advantages, and technical specifications
- **Purpose**: Showcases the company's core materials science capabilities and polymer platform
- **Trigger**: Navigate to Materials section
- **Progression**: View materials grid → click material card → see detailed properties, advantages, and technical details
- **Success criteria**: Clear differentiation between material types with accessible technical information

### Applications Gallery
- **Functionality**: Display of medical applications enabled by PolymerBionics materials with benefits and use cases
- **Purpose**: Demonstrates real-world clinical applications and market opportunities for the technology
- **Trigger**: Navigate to Applications section
- **Progression**: Browse application cards → click for details → view benefits, use cases, and relevant materials
- **Success criteria**: Clear connection between materials capabilities and clinical applications

### Media Gallery (Videos & Case Studies)
- **Functionality**: Embedded videos and downloadable case study documents
- **Purpose**: Provides in-depth demonstrations and clinical evidence
- **Trigger**: Navigate to Media section
- **Progression**: Browse video thumbnails → play embedded video OR view case study cards → download PDF
- **Success criteria**: Smooth video playback and clear case study previews

### Technical Datasheets Library
- **Functionality**: Organized library of downloadable technical documents
- **Purpose**: Provides detailed specifications for researchers and medical professionals
- **Trigger**: Navigate to Datasheets section
- **Progression**: Browse datasheet list → filter by category → download PDF
- **Success criteria**: Quick access to relevant technical documentation

### News & Publications Feed
- **Functionality**: Chronological display of company news and scientific publications
- **Purpose**: Demonstrates ongoing research activity and industry presence
- **Trigger**: Navigate to News section
- **Progression**: Scroll through items → click news article for details OR click publication for external link/PDF
- **Success criteria**: Recent updates visible with clear publication dates and sources

## Edge Case Handling

- **Empty sections**: Display elegant "Coming soon" states with relevant messaging when no content exists yet
- **Long text content**: Implement read-more/collapse functionality for lengthy bios or descriptions
- **Missing images**: Use gradient placeholders with initials for team members or product icons
- **External link failures**: Gracefully handle broken PDF or external links with error messages
- **Mobile navigation**: Hamburger menu for small screens with smooth sidebar transitions

## Design Direction

The design should evoke innovation, flexibility, and biocompatibility - reflecting the organic, adaptable nature of polymer materials. Think modern medical device aesthetics meets materials science, with a warm color palette inspired by biological systems and soft tissue engineering.

## Color Selection

A fresh, modern scientific palette centered on teal/turquoise tones (#00A9AD) representing biocompatibility and innovation, matching the Polymer Bionics brand identity from polymerbionics.com. The color scheme evokes trust, clarity, and medical precision.

- **Primary Color**: Teal/Turquoise (oklch(0.58 0.14 194) / #00A9AD) - Represents innovation, biocompatibility, and modern medical technology with a fresh, approachable feel
- **Secondary Colors**: 
  - Light Gray (oklch(0.95 0.005 240)) - Soft backgrounds that create clean, professional layouts
  - Clean White (oklch(1.00 0 0)) - Clean white backgrounds for maximum clarity
- **Accent Color**: Teal/Turquoise (oklch(0.58 0.14 194) / #00A9AD) - Draws attention to key actions and interactive elements
- **Foreground/Background Pairings**: 
  - Primary (Teal oklch(0.58 0.14 194)): White text (oklch(1.00 0 0)) - Ratio 4.8:1 ✓
  - Accent (Teal oklch(0.58 0.14 194)): White text (oklch(1.00 0 0)) - Ratio 4.8:1 ✓
  - Background (White oklch(1.00 0 0)): Foreground text (oklch(0.20 0.01 240)) - Ratio 15.2:1 ✓
  - Muted (Light Gray oklch(0.96 0.005 240)): Medium text (oklch(0.50 0.01 240)) - Ratio 5.8:1 ✓

## Font Selection

Typography uses Arial/Helvetica throughout for a clean, professional, and highly readable experience that matches the Polymer Bionics brand identity from polymerbionics.com. Arial provides a classic, trusted sans-serif that is universally compatible and conveys medical/scientific authority.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Arial Bold/48-60px/tight letter-spacing (-0.01em) - Strong, confident presence for main headings
  - H2 (Section Titles): Arial Bold/36-40px/normal letter-spacing - Clear content organization
  - H3 (Subsections): Arial Bold/20-24px/normal letter-spacing - Supporting hierarchy
  - Body Text: Arial Regular/16px/1.6 line-height - Clean readability with excellent legibility
  - Labels/UI: Arial Regular/14px/0.01em letter-spacing - Professional interface elements
  - Captions: Arial Regular/14px/1.5 line-height/muted color - Supporting information

## Animations

Animations should be subtle and purposeful, emphasizing content relationships and guiding user attention without distraction. Use smooth page transitions (300ms ease), gentle hover states on cards (scale 1.02, 200ms), and fade-ins for content sections as they enter viewport. Navigation changes should feel fluid with content sliding in from logical directions.

## Component Selection

- **Components**:
  - Navigation: Custom header with logo and horizontal menu (shadcn Sheet for mobile drawer)
  - Hero: Custom section with large typography and gradient background
  - Cards: shadcn Card for team members, products, case studies, datasheets
  - Buttons: shadcn Button with primary, secondary, and ghost variants
  - Dialogs: shadcn Dialog for expanded team bios and product details
  - Tabs: shadcn Tabs for organizing content within sections (e.g., News vs Publications)
  - Badges: shadcn Badge for roles, product categories, publication types
  - Separator: shadcn Separator for visual content breaks

- **Customizations**:
  - Hover effects on cards with subtle shadow elevation increase
  - Custom gradient backgrounds using mesh gradients for hero sections
  - Icon integration with Phosphor icons for all UI actions

- **States**:
  - Buttons: Distinct hover (brightness increase), active (scale down), and disabled (opacity 50%) states
  - Cards: Subtle elevation on hover, border color change on focus
  - Links: Underline decoration with accent color, smooth transition

- **Icon Selection**:
  - Navigation: List for menu, X for close
  - External links: ArrowUpRight or Download for PDFs
  - Social/Contact: LinkedinLogo, EnvelopeSimple
  - Content: Play for videos, FileText for documents, Newspaper for news

- **Spacing**:
  - Page padding: px-6 md:px-12 lg:px-24
  - Section gaps: gap-16 md:gap-24
  - Card padding: p-6
  - Component gaps: gap-4 for related items, gap-8 for distinct groups

- **Mobile**:
  - Mobile-first grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for cards
  - Navigation: Full-width sheet drawer on mobile with large touch targets
  - Typography: Reduced heading sizes on mobile (H1: 32px → 48px)
  - Stacked layout for hero content on small screens

## Analytics & Privacy

The site implements a comprehensive analytics infrastructure with GDPR-compliant consent management:

- **Consent Management**: Hard-gated tracking with granular user controls
- **Azure Application Insights**: Application performance monitoring
- **Google Analytics 4**: User behavior and conversion tracking
- **Microsoft Clarity**: Session replay and heatmaps
- **Core Web Vitals**: LCP, FID, CLS performance metrics
- **Feature Flags**: A/B testing and controlled feature rollouts

All tracking respects user consent preferences and implements privacy-first design principles.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| TypeScript 5.9 | Type Safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component Library |
| Framer Motion | Animations |
| Phosphor Icons | Icon System |
| GitHub Spark | KV Store & Hosting |
| Vitest | Unit Testing |
| Stryker | Mutation Testing |
| Azure Web App | Production Hosting |
