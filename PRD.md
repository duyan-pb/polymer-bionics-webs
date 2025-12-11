# Planning Guide

A professional life sciences company website for Polymer Bionics that establishes credibility with investors, partners, and collaborators through comprehensive team, product, research, and technical resources.

**Experience Qualities**:
1. **Professional** - The site must convey scientific rigor and commercial maturity expected in the medical biomaterials industry
2. **Trustworthy** - Clear information hierarchy, detailed technical documentation, and transparent team credentials build confidence with stakeholders
3. **Sophisticated** - Modern design that balances aesthetic refinement with functional accessibility for scientists, engineers, and business partners

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
  - Multiple distinct sections (Team, Products, Videos/Case Studies, Datasheets, News/Publications) each with unique content structures, filtering capabilities, modal interactions, and comprehensive data management

## Essential Features

### Team Page with Expandable Bios
- **Functionality**: Grid display of team members with high-quality headshots, names, titles, and brief credentials; clicking opens detailed modal with full bio, achievements, and links
- **Purpose**: Build trust and credibility by showcasing the scientific and business expertise behind the company
- **Trigger**: User navigates to Team page or clicks a team member card
- **Progression**: View team grid → Click member card → Modal opens with full bio, publications, LinkedIn/Scholar links → Close or navigate to next member
- **Success criteria**: All team members display correctly, modals open/close smoothly, external links work, responsive on mobile

### Product Catalog with Technical Details
- **Functionality**: Structured product cards with names, taglines, features, technical specs, applications, regulatory status, and datasheet links
- **Purpose**: Help investors and customers quickly understand product portfolio, technical capabilities, and commercial readiness
- **Trigger**: User navigates to Products page
- **Progression**: View product grid → Click product for expanded details → Read technical specs, features, applications → Access datasheet or case study links
- **Success criteria**: Products display in organized grid, technical information is scannable, comparison tables render correctly, links to datasheets work

### Video & Case Study Gallery
- **Functionality**: Grid of video thumbnails and case study cards; videos play in lightbox player; case studies show structured content (problem → solution → results → quote)
- **Purpose**: Demonstrate real-world validation and technology performance to investors and regulatory stakeholders
- **Trigger**: User navigates to Videos/Case Studies page, clicks video thumbnail or case study card
- **Progression**: View gallery → Click video thumbnail → Lightbox player opens → Watch video → Close or navigate to next; OR click case study → Read structured content with graphs/images
- **Success criteria**: Videos play smoothly in lightbox, case studies display with proper structure, thumbnails load correctly, mobile-responsive

### Datasheets Library
- **Functionality**: Searchable/filterable table of technical datasheets with categories, version numbers, last updated dates, and PDF download links
- **Purpose**: Signal commercial maturity and provide engineers/scientists with expected technical documentation
- **Trigger**: User navigates to Datasheets page, filters by category, or searches for specific material
- **Progression**: View datasheet library → Filter by category or search → Browse results → Click to download PDF datasheet
- **Success criteria**: Filtering works correctly, search returns relevant results, PDFs download, table displays cleanly with all metadata

### News & Publications Timeline
- **Functionality**: Two-section page with reverse-chronological news feed (grants, partnerships, announcements) and publication cards (papers, abstracts, white papers) with tags, authors, abstracts, and download links
- **Purpose**: Demonstrate active research, partnerships, and scientific output to establish credibility
- **Trigger**: User navigates to News/Publications page, filters by tag
- **Progression**: View timeline → Filter by tag or content type → Read news items or publication abstracts → Click to download PDF or visit DOI
- **Success criteria**: Timeline displays chronologically, tags filter correctly, publication metadata is complete, external links work

## Edge Case Handling

- **Empty States**: Show helpful messages when no team members, products, videos, datasheets, or publications exist yet with admin prompts
- **Missing Media**: Display placeholder images for team headshots or video thumbnails if not available
- **Long Bios/Text**: Implement proper text truncation and "Read more" functionality to maintain layout integrity
- **Filter No Results**: Show "No results found" message when filters return empty sets with option to clear filters
- **PDF Loading Errors**: Handle failed datasheet downloads gracefully with error messages
- **Broken External Links**: Validate LinkedIn/Scholar/DOI links and show indicators for unavailable resources
- **Mobile Navigation**: Ensure complex data tables and grids adapt properly to small screens with horizontal scroll or card stacking

## Design Direction

The design should evoke **scientific precision**, **clinical trustworthiness**, and **innovation leadership**. This is not a consumer product—it's a B2B/investment-focused life sciences site that needs to convey both cutting-edge research and commercial readiness. The aesthetic should feel like a blend of Oxford academia and modern biotech (think Moderna meets Nature journal meets high-end materials science). Clean, data-dense when needed, but never cluttered. Professional photography and technical diagrams should coexist harmoniously.

## Color Selection

The color scheme draws from clinical and scientific aesthetics—cool, precise, trustworthy blues paired with energizing accent colors that suggest innovation.

- **Primary Color**: Deep Scientific Blue (oklch(0.45 0.15 250)) - Conveys trust, precision, and scientific authority; used for headers, primary CTAs, and navigation
- **Secondary Colors**: 
  - Clinical White (oklch(0.99 0 0)) - Clean backgrounds that echo laboratory and clinical environments
  - Slate Gray (oklch(0.55 0.01 250)) - Supporting text and subtle UI elements that add sophistication without competing
- **Accent Color**: Innovation Teal (oklch(0.65 0.14 195)) - Energetic highlight for CTAs, active states, and important data points; suggests cutting-edge technology
- **Foreground/Background Pairings**: 
  - Primary Blue on White (oklch(0.45 0.15 250) on oklch(0.99 0 0)) - Ratio 7.2:1 ✓ Excellent
  - White on Primary Blue (oklch(0.99 0 0) on oklch(0.45 0.15 250)) - Ratio 7.2:1 ✓ Excellent
  - Accent Teal on White (oklch(0.65 0.14 195) on oklch(0.99 0 0)) - Ratio 5.1:1 ✓ Passes AA
  - Slate Gray on White (oklch(0.55 0.01 250) on oklch(0.99 0 0)) - Ratio 4.6:1 ✓ Passes AA

## Font Selection

Typography should reflect both academic rigor and modern innovation—a serif for authority in headings paired with a technical sans-serif for readability in data-heavy contexts.

- **Primary Typeface**: Crimson Pro (serif) - Brings editorial authority and academic gravitas to headings and key messaging
- **Secondary Typeface**: IBM Plex Sans (sans-serif) - Technical clarity for body text, UI elements, and data presentation; excellent readability in dense information

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Crimson Pro Bold / 48px / tight letter-spacing (-0.5px) / line-height 1.1
  - H2 (Section Headers): Crimson Pro Semibold / 36px / normal spacing / line-height 1.2
  - H3 (Subsection Headers): IBM Plex Sans Semibold / 24px / normal spacing / line-height 1.3
  - H4 (Card Titles): IBM Plex Sans Medium / 18px / normal spacing / line-height 1.4
  - Body Text: IBM Plex Sans Regular / 16px / normal spacing / line-height 1.6
  - Small/Meta Text: IBM Plex Sans Regular / 14px / normal spacing / line-height 1.5
  - Button/CTA: IBM Plex Sans Medium / 15px / slight letter-spacing (0.3px) / uppercase for primary actions

## Animations

Animations should be restrained and purposeful—reflecting scientific precision rather than playfulness. Micro-interactions provide feedback and guide attention without feeling frivolous.

- **Navigation transitions**: Smooth 300ms ease-out fades when switching between major sections
- **Card hover states**: Subtle 200ms scale (1.02) and shadow lift on team/product/case study cards to indicate interactivity
- **Modal entrance**: 250ms ease-out scale from 0.95 to 1.0 with backdrop fade-in for bio and detail modals
- **Filter/search results**: Staggered fade-in (50ms delay between items) when applying filters or showing search results
- **Button interactions**: Quick 150ms press-down scale (0.98) on click for tactile feedback
- **Data loading states**: Smooth skeleton loading animations (shimmer effect) for content that requires fetch time
- **Scroll reveals**: Subtle fade-up on scroll for section content (only on larger screens, not mobile)

## Component Selection

- **Components**: 
  - **Card** - Primary container for team members, products, case studies, and datasheets with consistent spacing and elevation
  - **Dialog** - For expanded team member bios and product detail views with overlay backdrop
  - **Tabs** - To separate News and Publications sections on the same page
  - **Table** - For datasheets library with sortable columns and clean row structure
  - **Badge** - For tags, categories, regulatory status indicators, and version numbers
  - **Input** - Search fields for datasheets and publications filtering
  - **Button** - Primary actions (Download Datasheet, View Case Study, Open Video) and secondary navigation
  - **Separator** - Visual dividers between sections and content groups
  - **Scroll-Area** - For long modal content and mobile table scrolling
  - **Aspect-Ratio** - For consistent video thumbnail and team photo dimensions
  
- **Customizations**: 
  - Custom video lightbox component wrapping Dialog for full-screen video playback
  - Custom filter bar component combining Input search with Badge-based category filters
  - Technical comparison table component with sticky headers and zebra striping
  - Publication card with structured fields (authors, journal, abstract, DOI)
  
- **States**: 
  - Buttons: Solid primary (blue) for main CTAs, ghost/outline secondary for less prominent actions, hover darkens by 10%, active state has slight inset shadow
  - Cards: Resting state has subtle border, hover lifts with shadow and border color shift to accent teal, active/selected cards have blue left border indicator
  - Inputs: Light gray border at rest, focus state shows blue ring and border, error state shows red border with icon
  - Links: Underline on hover, external links have small icon indicator
  
- **Icon Selection**: 
  - **Download** icon for datasheet PDFs and publication downloads
  - **Play** icon for video thumbnails
  - **LinkedInLogo** and **GoogleLogo** for social/academic links
  - **MagnifyingGlass** for search functionality
  - **Funnel** or **SlidersHorizontal** for filter controls
  - **X** for closing modals and clearing filters
  - **User** for team member placeholders
  - **FileText** for datasheet and document indicators
  - **Newspaper** for news items
  - **BookOpen** for publications
  - **ArrowRight** for "Read more" and navigation cues
  
- **Spacing**: 
  - Container max-width: 1280px with 2rem horizontal padding
  - Section spacing: 4rem vertical (space-y-16)
  - Card grid gaps: 2rem (gap-8)
  - Card internal padding: 1.5rem (p-6)
  - Content text spacing: 1rem paragraph margins (space-y-4)
  - Tight element grouping: 0.5rem (gap-2)
  
- **Mobile**: 
  - Navigation collapses to hamburger menu with slide-out drawer
  - Card grids stack from 3-column → 2-column → 1-column at breakpoints (lg/md/sm)
  - Tables switch to card-based layout on mobile with key fields visible
  - Modals become full-screen on mobile devices
  - Touch-friendly button sizes (minimum 44px tap targets)
  - Reduced font sizes: H1 32px, H2 28px, body 15px on mobile
