export interface TeamMember {
  id: string
  name: string
  title: string
  role: string
  category: 'founders' | 'management' | 'advisory'
  shortBio: string
  fullBio: string
  image?: string
  imageUrl?: string
  linkedin?: string
  linkedIn?: string
  scholar?: string
  email?: string
  education?: string[]
  achievements?: string[]
  publications?: string[]
}

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  technicalDescription: string
  category: string
  specifications: string
  features: string[]
  applications: string[]
  regulatoryStatus?: string
  imageUrl?: string
  datasheetId?: string
  caseStudyId?: string
}

export interface Video {
  id: string
  title: string
  description: string
  url: string
  videoUrl: string
  category: string
  thumbnailUrl?: string
  duration?: string
}

export interface CaseStudy {
  id: string
  title: string
  description: string
  problem: string
  solution: string
  results: string
  quote?: { text: string; author: string }
  pdfUrl: string
  category: string
  publishedDate: string
  datasheetId?: string
}

export interface Datasheet {
  id: string
  name: string
  title: string
  description: string
  category: string
  version: string
  lastUpdated: string
  pdfUrl: string
  fileSize?: string
  technicalSpecs?: Record<string, string>
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  date: string
  category: string
  link?: string
  imageUrl?: string
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  date: string
  type: 'journal' | 'conference' | 'preprint'
  abstract: string
  tags: string[]
  doi?: string
  url?: string
  pdfUrl?: string
}
