/**
 * Materials and Applications Data
 * 
 * Seed data for the materials catalog and clinical applications.
 * Contains biomaterial specifications and medical application use cases.
 * 
 * @module lib/materials-data
 */

import type { Material, Application } from './types'

// =============================================================================
// TODO: REPLACE ALL PLACEHOLDER MATERIAL AND APPLICATION DATA
// =============================================================================
// Materials need:
// - description: Technical description of the material (50-100 words)
// - properties: Array of key physical/chemical properties with values
// - keyAdvantages: Array of 3-5 competitive advantages
// - technicalDetails: Detailed specs paragraph
//
// Applications need:
// - description: Clinical application description (50-100 words)
// - benefits: Array of 3-5 clinical benefits
// - useCases: Array of specific use cases
// - relevantMaterials: Which materials are used
// =============================================================================

/**
 * Biomaterials catalog.
 * 
 * Each material represents a unique polymer or composite developed
 * by Polymer Bionics for medical device applications.
 */
export const materials: Material[] = [
  // TODO: Add real content for all materials below
  {
    id: 'biongel',
    name: 'BionGel',
    description: 'Description placeholder', // TODO: Add technical description
    properties: [
      'Property placeholder', // TODO: Add real properties with values
      'Property placeholder',
      'Property placeholder'
    ],
    keyAdvantages: [
      'Advantage placeholder', // TODO: Add competitive advantages
      'Advantage placeholder',
      'Advantage placeholder'
    ],
    technicalDetails: 'Technical details placeholder', // TODO: Add detailed specs
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
  // TODO: Add real content for all applications below
  {
    id: 'elasticuff',
    name: 'ElastiCuff',
    description: 'Description placeholder', // TODO: Add clinical description
    benefits: [
      'Benefit placeholder', // TODO: Add clinical benefits
      'Benefit placeholder',
      'Benefit placeholder'
    ],
    useCases: [
      'Use case placeholder', // TODO: Add specific use cases
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
    id: 'sport-eeg',
    name: 'Sport EEG',
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
    imageClass: 'bg-gradient-to-br from-primary/15 to-accent/20'
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
