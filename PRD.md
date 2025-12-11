# Planning Guide

A professional biotech company website showcasing PolymerBionics' medical innovations, team expertise, and research publications in polymer-based bioelectronics and flexible medical device technology.

**Experience Qualities**:
1. **Pioneering** - Conveys innovation in flexible bioelectronics and polymer science through dynamic, organic design elements
2. **Approachable** - Balances scientific credibility with warmth and accessibility through softer color palettes and inviting layouts
3. **Precise** - Demonstrates technical excellence and medical-grade engineering through clean, well-organized information architecture

**Complexity Level**: Content Showcase (information-focused)
This is primarily an informational website presenting company details, team members, products, research, and publications without complex interactive features or user-generated content management.

## Essential Features

### Hero Section with Company Overview
- **Functionality**: Displays company tagline, mission statement, and key value propositions
- **Purpose**: Immediately communicates PolymerBionics' focus and expertise in flexible bioelectronics and polymer-based medical devices
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

A sophisticated warm palette with coral-orange tones representing organic materials and biocompatibility, balanced with soft neutrals and deep navy for medical authority.

- **Primary Color**: Deep Navy (oklch(0.28 0.05 250)) - Represents medical authority, precision engineering, and scientific depth
- **Secondary Colors**: 
  - Warm Beige (oklch(0.95 0.015 85)) - Soft backgrounds that create warmth and approachability
  - Light Gray (oklch(0.93 0.005 260)) - Neutral elements and subtle borders
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 35)) - Represents organic materials, innovation, and energy - draws attention to key actions
- **Foreground/Background Pairings**: 
  - Primary (Deep Navy oklch(0.28 0.05 250)): White text (oklch(0.99 0 0)) - Ratio 11.5:1 ✓
  - Accent (Vibrant Coral oklch(0.68 0.18 35)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Background (Off-White oklch(0.99 0 0)): Dark text (oklch(0.22 0.03 250)) - Ratio 15.2:1 ✓
  - Muted (Warm Beige oklch(0.95 0.015 85)): Medium text (oklch(0.45 0.05 250)) - Ratio 7.8:1 ✓

## Font Selection

Typography should blend approachability with technical credibility - an elegant serif for warmth paired with a professional sans-serif for clarity.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Crimson Pro Bold/48px/tight letter-spacing (-0.02em) - Warm, inviting presence for main headings
  - H2 (Section Titles): Crimson Pro Semibold/36px/normal letter-spacing - Clear content organization with personality
  - H3 (Subsections): Crimson Pro Semibold/24px/normal letter-spacing - Supporting hierarchy
  - Body Text: IBM Plex Sans Regular/16px/1.6 line-height - Clean, technical readability
  - Labels/UI: IBM Plex Sans Medium/14px/0.01em letter-spacing - Professional interface elements
  - Captions: IBM Plex Sans Regular/14px/1.5 line-height/muted color - Supporting information

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
