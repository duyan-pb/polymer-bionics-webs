/**
 * Publications and News Data
 * 
 * Seed data for the news feed and scientific publications.
 * Contains company announcements and academic publications.
 * 
 * @module lib/publications-data
 */

import type { Publication, NewsItem } from './types'

/**
 * Placeholder news items.
 * 
 * Replace these with actual company news, announcements,
 * and press releases.
 */
export const placeholderNews: NewsItem[] = [
  {
    id: 'news-1',
    title: '[News Title Placeholder]',
    summary: '[Summary placeholder - Brief description of the news item and its significance.]',
    content: '[Content placeholder - Full article content would appear here with detailed information about the announcement, partnership, or development.]',
    date: 'December 2024',
    category: 'announcement',
  },
  {
    id: 'news-2',
    title: '[News Title Placeholder]',
    summary: '[Summary placeholder - Brief description of the news item and its significance.]',
    content: '[Content placeholder - Full article content would appear here with detailed information about the announcement, partnership, or development.]',
    date: 'November 2024',
    category: 'partnership',
  },
  {
    id: 'news-3',
    title: '[News Title Placeholder]',
    summary: '[Summary placeholder - Brief description of the news item and its significance.]',
    content: '[Content placeholder - Full article content would appear here with detailed information about the announcement, partnership, or development.]',
    date: 'October 2024',
    category: 'research',
  },
  {
    id: 'news-4',
    title: '[News Title Placeholder]',
    summary: '[Summary placeholder - Brief description of the news item and its significance.]',
    content: '[Content placeholder - Full article content would appear here with detailed information about the announcement, partnership, or development.]',
    date: 'September 2024',
    category: 'grant',
  },
]

export const placeholderPublications: Publication[] = [
  {
    id: 'pub-1',
    title: '[Publication Title Placeholder]',
    authors: ['[Author Placeholder]', '[Author Placeholder]', '[Author Placeholder]'],
    journal: '[Journal Name Placeholder]',
    year: 2024,
    date: 'January 2024',
    type: 'journal',
    abstract: '[Abstract placeholder - This is a placeholder for the publication abstract describing the research methodology, key findings, and conclusions.]',
    tags: ['bioelectronics', 'polymers'],
    doi: '#',
  },
  {
    id: 'pub-2',
    title: '[Publication Title Placeholder]',
    authors: ['[Author Placeholder]', '[Author Placeholder]'],
    journal: '[Journal Name Placeholder]',
    year: 2024,
    date: 'March 2024',
    type: 'journal',
    abstract: '[Abstract placeholder - This is a placeholder for the publication abstract describing the research methodology, key findings, and conclusions.]',
    tags: ['neural interfaces', 'flexible electronics'],
    doi: '#',
  },
  {
    id: 'pub-3',
    title: '[Publication Title Placeholder]',
    authors: ['[Author Placeholder]', '[Author Placeholder]', '[Author Placeholder]', '[Author Placeholder]'],
    journal: '[Conference Name Placeholder]',
    year: 2024,
    date: 'June 2024',
    type: 'conference',
    abstract: '[Abstract placeholder - This is a placeholder for the conference paper abstract describing the presented work and its significance.]',
    tags: ['wearable sensors', 'biocompatibility'],
    doi: '#',
  },
  {
    id: 'pub-4',
    title: '[Publication Title Placeholder]',
    authors: ['[Author Placeholder]', '[Author Placeholder]'],
    journal: '[Preprint Server Placeholder]',
    year: 2024,
    date: 'September 2024',
    type: 'preprint',
    abstract: '[Abstract placeholder - This is a placeholder for the preprint abstract describing preliminary findings and ongoing research.]',
    tags: ['drug delivery', 'hydrogels'],
    doi: '#',
  },
]
