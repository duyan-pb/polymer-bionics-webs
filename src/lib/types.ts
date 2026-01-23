/**
 * Core Type Definitions
 * 
 * Centralized TypeScript interfaces for all domain entities.
 * These types are used across the application for type safety
 * and consistency in data structures.
 * 
 * @module lib/types
 */

import type { TEAM_CATEGORIES } from './constants'

/**
 * Valid team member category keys.
 * Derived from TEAM_CATEGORIES constant.
 */
export type TeamCategory = keyof typeof TEAM_CATEGORIES

/**
 * Team member profile data.
 * Used for displaying team information across the site.
 */
export interface TeamMember {
  /** Unique identifier */
  id: string
  /** Full name */
  name: string
  /** Job title (e.g., "CEO & Founder") */
  title: string
  /** Role description */
  role: string
  /** Team category (founders, research, etc.) */
  category: TeamCategory
  /** Brief bio for card display */
  shortBio: string
  /** Extended biography for detail view */
  fullBio: string
  /** Profile image URL */
  imageUrl?: string
  /** LinkedIn profile URL */
  linkedin?: string
  /** Google Scholar profile URL */
  scholar?: string
  /** Email address */
  email?: string
  /** Education credentials */
  education?: string[]
  /** Notable achievements */
  achievements?: string[]
  /** Published works */
  publications?: string[]
}

/**
 * Product catalog item.
 * Represents a medical device or technology product.
 */
export interface Product {
  /** Unique identifier */
  id: string
  /** Product name */
  name: string
  /** Short marketing tagline */
  tagline: string
  /** General description */
  description: string
  /** Detailed technical description */
  technicalDescription: string
  /** Product category */
  category: string
  /** Technical specifications text */
  specifications: string
  /** Key features list */
  features: string[]
  /** Application areas */
  applications: string[]
  /** Regulatory approval status */
  regulatoryStatus?: string
  /** Primary product image URL */
  imageUrl?: string
  /** Additional image URLs */
  images?: string[]
  /** Related datasheet ID */
  datasheetId?: string
  /** Related case study ID */
  caseStudyId?: string
}

/**
 * Video content item.
 * Used for media gallery and embedded video players.
 */
export interface Video {
  /** Unique identifier */
  id: string
  /** Video title */
  title: string
  /** Video description */
  description: string
  /** Video embed or source URL */
  videoUrl: string
  /** Video category */
  category: string
  /** Thumbnail image URL */
  thumbnailUrl?: string
  /** Video duration (e.g., "5:30") */
  duration?: string
}

/**
 * Case study document.
 * Represents a detailed clinical or technical case study.
 */
export interface CaseStudy {
  /** Unique identifier */
  id: string
  /** Case study title */
  title: string
  /** Brief description */
  description: string
  /** Problem statement */
  problem: string
  /** Solution description */
  solution: string
  /** Results and outcomes */
  results: string
  /** Featured testimonial quote */
  quote?: { text: string; author: string }
  /** PDF download URL */
  pdfUrl: string
  /** Case study category */
  category: string
  /** Publication date (ISO string) */
  publishedDate: string
  /** Related datasheet ID */
  datasheetId?: string
}

/**
 * Technical datasheet document.
 * Represents downloadable technical documentation.
 */
export interface Datasheet {
  /** Unique identifier */
  id: string
  /** Internal name/code */
  name: string
  /** Display title */
  title: string
  /** Datasheet description */
  description: string
  /** Document category */
  category: string
  /** Document version */
  version: string
  /** Last update date */
  lastUpdated: string
  /** PDF download URL */
  pdfUrl: string
  /** Human-readable file size */
  fileSize?: string
  /** Technical specifications key-value pairs */
  technicalSpecs?: Record<string, string>
}

/**
 * News article or announcement.
 * Used for the news feed section.
 */
export interface NewsItem {
  /** Unique identifier */
  id: string
  /** Article title */
  title: string
  /** Brief summary */
  summary: string
  /** Full article content */
  content: string
  /** Publication date (ISO string) */
  date: string
  /** News category */
  category: string
  /** External link URL */
  link?: string
  /** Featured image URL */
  imageUrl?: string
}

/**
 * Scientific publication or research paper.
 * Represents academic publications by the team.
 */
export interface Publication {
  /** Unique identifier */
  id: string
  /** Publication title */
  title: string
  /** List of author names */
  authors: string[]
  /** Journal or conference name */
  journal: string
  /** Publication year */
  year: number
  /** Publication date (ISO string) */
  date: string
  /** Publication type */
  type: 'journal' | 'conference' | 'preprint'
  /** Abstract text */
  abstract: string
  /** Topic tags */
  tags: string[]
  /** Digital Object Identifier */
  doi?: string
  /** External URL to publication */
  url?: string
  /** PDF download URL */
  pdfUrl?: string
}

/**
 * Payment/order draft data for pre-filling the payment page.
 */
export interface PaymentOrderDraft {
  /** Contact name */
  name: string
  /** Contact email */
  email: string
  /** Company name */
  company: string
  /** Product name */
  product: string
  /** Quantity requested */
  quantity: string
  /** Shipping country */
  country: string
  /** Additional notes */
  notes: string
}

/**
 * Biomaterial information.
 * Represents a material in the materials catalog.
 */

/**
 * Biomaterial information.
 * Represents a material in the materials catalog.
 */
export interface Material {
  /** Unique identifier */
  id: string
  /** Material name */
  name: string
  /** Material description */
  description: string
  /** Key properties list */
  properties: string[]
  /** Competitive advantages */
  keyAdvantages: string[]
  /** Detailed technical information */
  technicalDetails: string
  /** CSS class for gradient background */
  imageClass?: string
  /** Material image URL */
  imageUrl?: string
}

/**
 * Clinical application area.
 * Represents a use case for the company's materials.
 */
export interface Application {
  /** Unique identifier */
  id: string
  /** Application name */
  name: string
  /** Application description */
  description: string
  /** Key benefits list */
  benefits: string[]
  /** Specific use case examples */
  useCases: string[]
  /** IDs of related materials */
  relevantMaterials: string[]
  /** CSS class for gradient background */
  imageClass?: string
  /** Application image URL */
  imageUrl?: string
}
