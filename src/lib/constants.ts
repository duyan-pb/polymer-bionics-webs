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
  management: 'Project Management',
  'design-engineering': 'Design & Engineering',
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

// =============================================================================
// TIMING CONSTANTS
// =============================================================================

/**
 * Default debounce delay for search inputs (ms)
 */
export const DEBOUNCE_DELAY_MS = 200

/**
 * Idle callback fallback timeout (ms)
 */
export const IDLE_CALLBACK_TIMEOUT_MS = 500

/**
 * Scroll threshold for showing back-to-top button (px)
 */
export const SCROLL_THRESHOLD_PX = 400

// =============================================================================
// CONTENT LIMITS
// =============================================================================

/** Default loading skeleton card count */
export const DEFAULT_LOADING_SKELETON_COUNT = 6

/** Home page feature icon size (px) */
export const HOME_FEATURE_ICON_SIZE = 40

/** Home page partner placeholder count */
export const HOME_PARTNER_PLACEHOLDER_COUNT = 4

/** Application benefits preview count */
export const APPLICATION_BENEFIT_PREVIEW_COUNT = 2

// =============================================================================
// ANIMATION CONSTANTS
// =============================================================================

/**
 * Hero image animation configuration
 */
export const HERO_IMAGE_ANIMATION = {
  /** Initial scale for zoom-in effect */
  INITIAL_SCALE: 1.05,
  /** Bezier curve for smooth easing [x1, y1, x2, y2] */
  EASE_CURVE: [0.25, 0.1, 0.25, 1] as readonly [number, number, number, number],
  /** Animation duration in seconds */
  DURATION: 0.8,
} as const

// =============================================================================
// UI CONSTANTS
// =============================================================================

/**
 * Material card display limits
 */
export const MATERIAL_CARD = {
  /** Max properties to show before truncating */
  MAX_PROPERTIES: 3,
  /** Max characters for property text before truncating */
  MAX_PROPERTY_LENGTH: 30,
} as const
