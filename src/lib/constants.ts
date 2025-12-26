/**
 * Application Constants
 * 
 * Centralized constants for the application.
 * Single source of truth for navigation, categories, animations, and styling.
 * 
 * @module lib/constants
 */

/**
 * Navigation item configuration.
 */
export interface NavItem {
  /** Unique page identifier */
  id: string
  /** Display label */
  label: string
  /** Description for search and tooltips */
  description?: string
}

/**
 * Navigation items for the site.
 * Used by Navigation, GlobalSearch, and Footer components.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', description: 'Return to home page' },
  { id: 'team', label: 'Team', description: 'Meet our team' },
  { id: 'materials', label: 'Materials', description: 'Our advanced materials' },
  { id: 'products', label: 'Products', description: 'Product portfolio' },
  // { id: 'applications', label: 'Applications', description: 'Application areas' },
  { id: 'media', label: 'Videos & Case Studies', description: 'Media and case studies' },
  { id: 'datasheets', label: 'Datasheets', description: 'Technical datasheets' },
  { id: 'news', label: 'News & Publications', description: 'Latest news and publications' },
  { id: 'contact', label: 'Contact', description: 'Get in touch' },
] as const

/**
 * Team member categories with display labels
 */
export const TEAM_CATEGORIES = {
  founders: 'Founders',
  management: 'Project Management Team',
  'lab-management': 'Laboratory Management Team',
  'research-engineering': 'Research/Engineering Team',
  research: 'Research Team',
  engineering: 'Engineering Team',
  advisory: 'Scientific Advisory Board',
} as const

export type TeamCategory = keyof typeof TEAM_CATEGORIES

/**
 * Default animation variants for page transitions
 */
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: 'easeOut' },
} as const

/**
 * Card hover animation classes (reusable Tailwind)
 */
export const CARD_HOVER_CLASSES = 
  'hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer hover:border-primary'

/**
 * Hero section default classes
 */
export const HERO_SECTION_CLASSES = 
  'relative bg-background overflow-hidden'

/**
 * Content section default classes
 */
export const CONTENT_SECTION_CLASSES = 'py-20 px-8'

/**
 * Max content width wrapper
 */
export const CONTENT_MAX_WIDTH = 'max-w-[1280px] mx-auto'
