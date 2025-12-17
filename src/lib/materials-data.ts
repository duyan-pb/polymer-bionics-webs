export interface Material {
  id: string
  name: string
  description: string
  properties: string[]
  keyAdvantages: string[]
  technicalDetails: string
  imageClass?: string
}

export interface Application {
  id: string
  name: string
  description: string
  benefits: string[]
  useCases: string[]
  relevantMaterials: string[]
  imageClass?: string
}

export const materials: Material[] = [
  {
    id: 'biongel',
    name: 'BionGel',
    description: 'Description placeholder',
    properties: [
      'Property placeholder',
      'Property placeholder',
      'Property placeholder'
    ],
    keyAdvantages: [
      'Advantage placeholder',
      'Advantage placeholder',
      'Advantage placeholder'
    ],
    technicalDetails: 'Technical details placeholder',
    imageClass: 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20'
  },
  {
    id: 'elastibion',
    name: 'ElastiBion',
    description: 'Description placeholder',
    properties: [
      'Property placeholder',
      'Property placeholder',
      'Property placeholder'
    ],
    keyAdvantages: [
      'Advantage placeholder',
      'Advantage placeholder',
      'Advantage placeholder'
    ],
    technicalDetails: 'Technical details placeholder',
    imageClass: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
  },
  {
    id: 'elastisolder',
    name: 'ElastiSolder',
    description: 'Description placeholder',
    properties: [
      'Property placeholder',
      'Property placeholder',
      'Property placeholder'
    ],
    keyAdvantages: [
      'Advantage placeholder',
      'Advantage placeholder',
      'Advantage placeholder'
    ],
    technicalDetails: 'Technical details placeholder',
    imageClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
  }
]

export const applications: Application[] = [
  {
    id: 'elasticuff',
    name: 'ElastiCuff',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'elastarray',
    name: 'ElastArray',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'elastiwire',
    name: 'ElastiWire',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-teal-500/10 to-emerald-500/10'
  },
  {
    id: 'simpleeg',
    name: 'SimplEEG',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel'],
    imageClass: 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10'
  },
  {
    id: 'babeeg',
    name: 'BabEEG',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel'],
    imageClass: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10'
  },
  {
    id: 'inear-eeg',
    name: 'InEar EEG',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiWire'],
    imageClass: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
  },
  {
    id: 'custom-applications',
    name: 'Customer-Specific Applications',
    description: 'Description placeholder',
    benefits: [
      'Benefit placeholder',
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder',
      'Use case placeholder',
      'Use case placeholder'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  }
]
