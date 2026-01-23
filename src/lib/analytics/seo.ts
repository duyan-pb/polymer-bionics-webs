/**
 * SEO & Redirect Infrastructure (Epic 13)
 * 
 * Provides:
 * - Dynamic meta tag management
 * - Structured data (JSON-LD) helpers
 * - Canonical URL handling
 * - Open Graph and Twitter Card meta
 * - Client-side redirect tracking
 * - SEO event tracking for analytics
 */

import { track } from './tracker'
import { canTrack } from './consent'

// =============================================================================
// TYPES
// =============================================================================

export interface PageMetadata {
  /** Page title */
  title: string
  /** Meta description */
  description: string
  /** Canonical URL */
  canonical?: string
  /** Keywords (less important for SEO now, but still used) */
  keywords?: string[]
  /** Robots directive */
  robots?: string
  /** Open Graph metadata */
  og?: OpenGraphMeta
  /** Twitter Card metadata */
  twitter?: TwitterCardMeta
  /** Additional meta tags */
  meta?: Record<string, string>
}

export interface OpenGraphMeta {
  title?: string
  description?: string
  type?: 'website' | 'article' | 'product' | 'profile'
  url?: string
  image?: string
  imageAlt?: string
  siteName?: string
  locale?: string
}

export interface TwitterCardMeta {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title?: string
  description?: string
  image?: string
  imageAlt?: string
}

export interface StructuredDataOrganization {
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone?: string
    email?: string
    contactType: string
  }
}

export interface StructuredDataProduct {
  '@type': 'Product'
  name: string
  description: string
  image?: string | string[]
  brand?: {
    '@type': 'Brand'
    name: string
  }
  offers?: {
    '@type': 'Offer'
    availability?: string
    priceCurrency?: string
    price?: string
  }
}

export interface StructuredDataArticle {
  '@type': 'Article' | 'NewsArticle' | 'BlogPosting'
  headline: string
  description: string
  image?: string | string[]
  author?: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
  datePublished?: string
  dateModified?: string
}

export interface RedirectRule {
  /** Source path (supports wildcards) */
  from: string
  /** Destination path or URL */
  to: string
  /** HTTP status code */
  status: 301 | 302 | 307 | 308
  /** Whether this is a regex pattern */
  isRegex?: boolean
}

// =============================================================================
// DEFAULT SEO CONFIG
// =============================================================================

export const DEFAULT_SEO_CONFIG = {
  siteName: 'Polymer Bionics',
  defaultTitle: 'Polymer Bionics - Bioactive Medical Device Innovations',
  titleTemplate: '%s | Polymer Bionics',
  defaultDescription: 'Pioneering bioactive polymer technologies for next-generation medical devices and implants.',
  defaultImage: '/images/og-default.png',
  twitterSite: '@polymerbionics',
  locale: 'en_US',
}

// =============================================================================
// META TAG MANAGEMENT
// =============================================================================

/**
 * Update page metadata dynamically
 */
export function updatePageMeta(metadata: Partial<PageMetadata>): void {
  // Update title
  if (metadata.title) {
    document.title = DEFAULT_SEO_CONFIG.titleTemplate.replace('%s', metadata.title)
  }
  
  // Update meta tags
  updateMetaTag('description', metadata.description)
  updateMetaTag('keywords', metadata.keywords?.join(', '))
  updateMetaTag('robots', metadata.robots)
  
  // Update canonical
  if (metadata.canonical) {
    updateLinkTag('canonical', metadata.canonical)
  }
  
  // Update Open Graph tags
  if (metadata.og) {
    updateOGTags(metadata.og, metadata)
  }
  
  // Update Twitter Card tags
  if (metadata.twitter) {
    updateTwitterTags(metadata.twitter, metadata)
  }
  
  // Update custom meta tags
  if (metadata.meta) {
    for (const [name, content] of Object.entries(metadata.meta)) {
      updateMetaTag(name, content)
    }
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content?: string): void {
  if (!content) {
    return
  }
  
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  
  meta.content = content
}

/**
 * Update or create an Open Graph meta tag
 */
function updateOGMetaTag(property: string, content?: string): void {
  if (!content) {
    return
  }
  
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  
  meta.content = content
}

/**
 * Update Open Graph tags
 */
function updateOGTags(og: OpenGraphMeta, metadata: Partial<PageMetadata>): void {
  updateOGMetaTag('og:title', og.title || metadata.title)
  updateOGMetaTag('og:description', og.description || metadata.description)
  updateOGMetaTag('og:type', og.type || 'website')
  updateOGMetaTag('og:url', og.url || metadata.canonical || window.location.href)
  updateOGMetaTag('og:image', og.image || DEFAULT_SEO_CONFIG.defaultImage)
  updateOGMetaTag('og:image:alt', og.imageAlt)
  updateOGMetaTag('og:site_name', og.siteName || DEFAULT_SEO_CONFIG.siteName)
  updateOGMetaTag('og:locale', og.locale || DEFAULT_SEO_CONFIG.locale)
}

/**
 * Update Twitter Card tags
 */
function updateTwitterTags(twitter: TwitterCardMeta, metadata: Partial<PageMetadata>): void {
  updateMetaTag('twitter:card', twitter.card || 'summary_large_image')
  updateMetaTag('twitter:site', twitter.site || DEFAULT_SEO_CONFIG.twitterSite)
  updateMetaTag('twitter:creator', twitter.creator)
  updateMetaTag('twitter:title', twitter.title || metadata.title)
  updateMetaTag('twitter:description', twitter.description || metadata.description)
  updateMetaTag('twitter:image', twitter.image || DEFAULT_SEO_CONFIG.defaultImage)
  updateMetaTag('twitter:image:alt', twitter.imageAlt)
}

/**
 * Update or create a link tag
 */
function updateLinkTag(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  
  link.href = href
}

// =============================================================================
// STRUCTURED DATA (JSON-LD)
// =============================================================================

/**
 * Add structured data to the page
 */
export function addStructuredData(
  data: StructuredDataOrganization | StructuredDataProduct | StructuredDataArticle | Record<string, unknown>
): void {
  const jsonLd = {
    '@context': 'https://schema.org',
    ...data,
  }
  
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  script.id = `structured-data-${data['@type']?.toString().toLowerCase() || 'custom'}`
  
  // Remove existing script with same ID
  const existing = document.getElementById(script.id)
  if (existing) {
    existing.remove()
  }
  
  document.head.appendChild(script)
}

/**
 * Add Organization structured data
 */
export function addOrganizationSchema(org: Omit<StructuredDataOrganization, '@type'>): void {
  addStructuredData({
    '@type': 'Organization',
    ...org,
  })
}

/**
 * Add Product structured data
 */
export function addProductSchema(product: Omit<StructuredDataProduct, '@type'>): void {
  addStructuredData({
    '@type': 'Product',
    ...product,
  })
}

/**
 * Add Article structured data
 */
export function addArticleSchema(
  article: Omit<StructuredDataArticle, '@type'>,
  type: 'Article' | 'NewsArticle' | 'BlogPosting' = 'Article'
): void {
  addStructuredData({
    '@type': type,
    ...article,
  })
}

/**
 * Add BreadcrumbList structured data
 */
export function addBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): void {
  addStructuredData({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  })
}

// =============================================================================
// REDIRECT HANDLING
// =============================================================================

let redirectRules: RedirectRule[] = []

/**
 * Configure redirect rules
 */
export function configureRedirects(rules: RedirectRule[]): void {
  redirectRules = rules
}

/**
 * Check if current path should redirect
 */
export function checkRedirect(): RedirectRule | null {
  const currentPath = window.location.pathname
  
  for (const rule of redirectRules) {
    if (rule.isRegex) {
      const regex = new RegExp(rule.from)
      if (regex.test(currentPath)) {
        return rule
      }
    } else if (rule.from === currentPath) {
      return rule
    }
  }
  
  return null
}

/**
 * Execute redirect and track it
 */
export function executeRedirect(rule: RedirectRule): void {
  // Track redirect event
  if (canTrack('analytics')) {
    track('redirect', {
      from_path: window.location.pathname,
      to_path: rule.to,
      redirect_status: rule.status,
    })
  }
  
  // Perform redirect
  // Note: In a SPA, this would be handled by the router
  // This is for server-side or full page redirects
  if (rule.to.startsWith('http')) {
    window.location.assign(rule.to)
  } else {
    window.location.assign(rule.to)
  }
}

// =============================================================================
// SEO TRACKING
// =============================================================================

/**
 * Track page indexability status
 */
export function trackPageIndexability(): void {
  if (!canTrack('analytics')) {
    return
  }
  
  const robotsMeta = document.querySelector('meta[name="robots"]')
  const robotsContent = robotsMeta?.getAttribute('content') || 'index,follow'
  
  const isIndexable = !robotsContent.includes('noindex')
  const isFollowable = !robotsContent.includes('nofollow')
  
  track('seo_indexability', {
    page_path: window.location.pathname,
    is_indexable: isIndexable,
    is_followable: isFollowable,
    robots_content: robotsContent,
    has_canonical: !!document.querySelector('link[rel="canonical"]'),
    has_structured_data: !!document.querySelector('script[type="application/ld+json"]'),
  })
}

/**
 * Track outbound links for SEO analysis
 */
export function trackOutboundLink(url: string, linkText?: string): void {
  if (!canTrack('analytics')) {
    return
  }
  
  try {
    const urlObj = new URL(url)
    const isExternal = urlObj.hostname !== window.location.hostname
    
    if (isExternal) {
      track('outbound_link', {
        destination_url: url,
        destination_domain: urlObj.hostname,
        link_text: linkText,
        source_page: window.location.pathname,
      })
    }
  } catch {
    // Invalid URL, skip tracking
  }
}

/**
 * Set up automatic outbound link tracking
 */
export function setupOutboundLinkTracking(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (link?.href) {
      trackOutboundLink(link.href, link.textContent?.trim())
    }
  })
}

// =============================================================================
// PAGE METADATA FOR COMMON PAGES
// =============================================================================

/**
 * Pre-defined page metadata for common pages
 */
export const PAGE_METADATA: Record<string, PageMetadata> = {
  home: {
    title: 'Home',
    description: 'Polymer Bionics - Pioneering bioactive polymer technologies for next-generation medical devices.',
    og: { type: 'website' },
  },
  team: {
    title: 'Our Team',
    description: 'Meet the scientists and engineers behind Polymer Bionics innovative medical device technologies.',
    og: { type: 'website' },
  },
  products: {
    title: 'Products',
    description: 'Explore our range of bioactive polymer products for medical device applications.',
    og: { type: 'website' },
  },
  materials: {
    title: 'Materials',
    description: 'Learn about our advanced bioactive polymer materials and their unique properties.',
    og: { type: 'website' },
  },
  applications: {
    title: 'Applications',
    description: 'Discover the diverse medical applications of our bioactive polymer technologies.',
    og: { type: 'website' },
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with Polymer Bionics to discuss your medical device needs.',
    og: { type: 'website' },
  },
  news: {
    title: 'News & Updates',
    description: 'Stay updated with the latest news and developments from Polymer Bionics.',
    og: { type: 'website' },
  },
  media: {
    title: 'Media Gallery',
    description: 'View images and videos showcasing Polymer Bionics technologies and facilities.',
    og: { type: 'website' },
  },
}

/**
 * Update page metadata based on page name
 */
export function setPageMetadata(pageName: string): void {
  const metadata = PAGE_METADATA[pageName]
  if (metadata) {
    updatePageMeta(metadata)
  }
}

// =============================================================================
// REACT HOOK
// =============================================================================

/**
 * React hook for managing page SEO
 */
export function usePageSEO(pageName: string, customMetadata?: Partial<PageMetadata>): void {
  if (typeof window === 'undefined') {
    return
  }
  
  const metadata = {
    ...PAGE_METADATA[pageName],
    ...customMetadata,
  }
  
  updatePageMeta(metadata)
}
