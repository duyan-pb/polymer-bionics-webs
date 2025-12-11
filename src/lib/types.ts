export interface TeamMember {
  id: string
  name: string
  title: string
  category: 'founders' | 'management' | 'advisory'
  image?: string
  shortBio: string
  fullBio: string
  education: string[]
  achievements: string[]
  publications?: string[]
  linkedin?: string
  scholar?: string
}

export interface Product {
  id: string
  name: string
  tagline: string
  category: string
  features: string[]
  technicalDescription: string
  applications: string[]
  regulatoryStatus: string
  datasheetId?: string
  caseStudyId?: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  videoUrl: string
  duration?: string
  category: string
}

export interface CaseStudy {
  id: string
  title: string
  category: string
  problem: string
  solution: string
  results: string
  quote?: {
    text: string
    author: string
    title: string
  }
  images?: string[]
  datasheetId?: string
}

export interface Datasheet {
  id: string
  name: string
  category: string
  version: string
  lastUpdated: string
  description: string
  technicalSpecs: {
    label: string
    value: string
  }[]
  pdfUrl?: string
}

export interface NewsItem {
  id: string
  title: string
  date: string
  category: string
  summary: string
  content: string
  link?: string
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  journal: string
  date: string
  abstract: string
  tags: string[]
  doi?: string
  pdfUrl?: string
  type: 'peer-reviewed' | 'conference' | 'white-paper' | 'preprint'
}
