/**
 * Innovation Data
 * 
 * Advanced bioelectronic innovations in development.
 * Emerging technologies and research platforms.
 * 
 * @module lib/innovation-data
 */

import type { Product } from './types'

/**
 * Innovation catalog.
 * Advanced bioelectronic technologies in development.
 */
export const innovations: Product[] = [
  {
    id: 'conformax',
    name: 'ConformaX Peripheral Nerve Interface',
    tagline: 'Self-conforming implantable nerve interface system',
    description: 'ConformaX is a self-conforming peripheral nerve interface designed to adapt dynamically to nerve geometry. It combines soft elastomeric electrodes with stretchable architectures to support stable stimulation and recording.',
    technicalDescription: 'ConformaX is a self-conforming peripheral nerve interface designed to adapt dynamically to nerve geometry. It combines soft elastomeric electrodes with stretchable architectures to support stable stimulation and recording.',
    category: 'neural-interfaces',
    specifications: 'Self-conforming architecture, stretchable electrode design',
    features: [
      'Adaptive, self-conforming design',
      'Supports stimulation and recording',
      'Designed for retrievable implantation'
    ],
    applications: [
      'Peripheral nerve interfaces',
      'Advanced prosthetic and neuromodulation systems'
    ],
    regulatoryStatus: 'Under development. Not yet approved for human use.'
  }
]
