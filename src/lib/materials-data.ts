/**
 * Materials and Applications Data
 * 
 * Seed data for the materials catalog and clinical applications.
 * Contains biomaterial specifications and medical application use cases.
 * 
 * @module lib/materials-data
 */

import type { Material, Application } from './types'

/**
 * Biomaterials catalog.
 * 
 * Each material represents a unique polymer or composite developed
 * by Polymer Bionics for medical device applications.
 */
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
    imageClass: 'bg-gradient-to-br from-primary/20 to-accent/10'
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
    imageClass: 'bg-gradient-to-br from-accent/20 to-primary/10'
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
    imageClass: 'bg-gradient-to-br from-primary/10 to-accent/20'
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
    imageClass: 'bg-gradient-to-br from-primary/20 to-accent/10'
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
    imageClass: 'bg-gradient-to-br from-accent/20 to-primary/10'
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
    imageClass: 'bg-gradient-to-br from-primary/10 to-accent/20'
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
    imageClass: 'bg-gradient-to-br from-accent/10 to-primary/20'
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
    imageClass: 'bg-gradient-to-br from-primary/15 to-accent/15'
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
    imageClass: 'bg-gradient-to-br from-accent/15 to-primary/15'
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
    imageClass: 'bg-gradient-to-br from-primary/20 to-accent/20'
  }
]
