export interface Material {
  id: string
  name: string
  description: string
  properties: string[]
  keyAdvantages: string[]
  technicalDetails: string
  imageClass?: string
  imageUrl?: string
}

export interface Application {
  id: string
  name: string
  description: string
  benefits: string[]
  useCases: string[]
  relevantMaterials: string[]
  imageClass?: string
  imageUrl?: string
}

import biongel1 from '@/assets/images/PXL_20251216_115711682.PORTRAIT.jpg'
import biongel2 from '@/assets/images/PXL_20251216_115728419.PORTRAIT.ORIGINAL.jpg'
import biongel3 from '@/assets/images/PXL_20251216_115737523.PORTRAIT.jpg'
import app1 from '@/assets/images/PXL_20251216_115759988.jpg'
import app2 from '@/assets/images/PXL_20251216_115810661.jpg'
import app3 from '@/assets/images/PXL_20251216_115825489.jpg'
import app4 from '@/assets/images/PXL_20251216_115836016.jpg'
import app5 from '@/assets/images/PXL_20251216_115843208.jpg'
import app6 from '@/assets/images/PXL_20251216_115854143.jpg'
import app7 from '@/assets/images/PXL_20251216_115905670.jpg'

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
    imageUrl: biongel1
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
    imageUrl: biongel2
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
    imageUrl: biongel3
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
    imageUrl: app1
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
    imageUrl: app2
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
    imageUrl: app3
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
    imageUrl: app4
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
    imageUrl: app5
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
    imageUrl: app6
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
    imageUrl: app7
  }
]
