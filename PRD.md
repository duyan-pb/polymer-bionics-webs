# Planning Guide

A professional biotech company website showcasing Neurox's medical innovations, team expertise, and research publications in neural interface technology and biomaterials.

**Experience Qualities**:
1. **Authoritative** - Conveys scientific credibility and medical-grade professionalism through refined typography and structured layouts
2. **Innovative** - Reflects cutting-edge biotechnology through modern design elements and subtle tech-inspired visual details
3. **Accessible** - Presents complex scientific information in clear, digestible formats for various audiences from researchers to investors

**Complexity Level**: Content Showcase (information-focused)
This is primarily an informational website presenting company details, team members, products, research, and publications without complex interactive features or user-generated content management.

## Essential Features

### Hero Section with Company Overview
- **Functionality**: Displays company tagline, mission statement, and key value propositions
- **Purpose**: Immediately communicates Neurox's focus and expertise in neural biomaterials
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

The design should evoke precision, innovation, and medical professionalism - balancing scientific authority with approachability. Think clean pharmaceutical aesthetics meets modern tech company, with a color palette inspired by neural networks and biotechnology.

## Color Selection

A sophisticated scientific palette with deep blue-purple tones representing neural technology, accented with vibrant cyan for innovation and energy.

- **Primary Color**: Deep Indigo (oklch(0.35 0.10 270)) - Represents depth of scientific research, neural networks, and medical authority
- **Secondary Colors**: 
  - Soft Lavender (oklch(0.94 0.02 280)) - Subtle backgrounds that don't compete with content
  - Warm Gray (oklch(0.92 0.005 270)) - Muted elements and borders
- **Accent Color**: Vibrant Cyan (oklch(0.70 0.15 195)) - Calls attention to interactive elements and innovation
- **Foreground/Background Pairings**: 
  - Primary (Deep Indigo oklch(0.35 0.10 270)): White text (oklch(0.99 0 0)) - Ratio 9.2:1 ✓
  - Accent (Vibrant Cyan oklch(0.70 0.15 195)): White text (oklch(0.99 0 0)) - Ratio 5.1:1 ✓
  - Background (Off-White oklch(0.99 0 0)): Dark text (oklch(0.25 0.01 270)) - Ratio 13.8:1 ✓
  - Muted (Soft Lavender oklch(0.94 0.02 280)): Medium text (oklch(0.50 0.05 270)) - Ratio 6.5:1 ✓

## Font Selection

Typography should blend scientific credibility with readability - a classic serif for authority paired with a clean technical sans-serif.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Crimson Pro Bold/48px/tight letter-spacing (-0.02em) - Commanding presence for main headings
  - H2 (Section Titles): Crimson Pro Semibold/36px/normal letter-spacing - Clear content organization
  - H3 (Subsections): Crimson Pro Semibold/24px/normal letter-spacing - Supporting hierarchy
  - Body Text: IBM Plex Sans Regular/16px/1.6 line-height - Optimal readability for descriptions
  - Labels/UI: IBM Plex Sans Medium/14px/0.01em letter-spacing - Clean interface elements
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
