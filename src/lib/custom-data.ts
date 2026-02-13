/**
 * Custom Solutions Data
 * 
 * Custom electrode and system solutions for partner-specific applications.
 * We support partners at multiple stages of product development.
 * 
 * @module lib/custom-data
 */

import type { Product } from './types'

// Custom solution images (high-fidelity originals)
import wearableSystemsImg from '@/assets/images/custom/originals/Wearable Systems/IMG_2906.JPG'
import wearableGarmentsImg from '@/assets/images/custom/originals/Wearable Garment Systems/EEG textile wearables.png'
import adhesiveMonitoringImg from '@/assets/images/custom/originals/Adhesive Monitoring Systems/FlexElec sheet vid.png'
import adhesiveMonitoringImg1 from '@/assets/images/custom/originals/Adhesive Monitoring Systems/FlexElecsheet electrode.png'
import customImplantableImg from '@/assets/images/custom/originals/Custom Implantable Electrode Arrays/Hexa array noscale.png'
import customImplantableImg1 from '@/assets/images/custom/originals/Custom Implantable Electrode Arrays/HExa array.png'
import customImplantableImg2 from '@/assets/images/custom/originals/Custom Implantable Electrode Arrays/RPNI.png'

/**
 * Custom solutions catalog.
 * Electrodes embedded within customer-specific device architectures.
 */
export const customSolutions: Product[] = [
  {
    id: 'custom-electrodes',
    name: 'Custom Embedded Electrodes',
    tagline: 'Electrodes embedded within customer-specific device architectures',
    description: 'Electrodes integrated with substrates, housings, or form factors designed to interface with partner electronics and systems. Suitable for wearable and implantable applications.',
    technicalDescription: 'Electrodes integrated with substrates, housings, or form factors designed to interface with partner electronics and systems. Suitable for wearable and implantable applications.',
    category: 'custom-electrodes',
    specifications: 'Custom geometry, partner-specified integration',
    features: [
      'Electrodes integrated with substrates, housings, or form factors',
      'Designed to interface with partner electronics and systems',
      'Suitable for wearable and implantable applications'
    ],
    applications: [
      'Custom bioelectronic device development',
      'Partner integration projects'
    ],
    regulatoryStatus: 'Configuration-dependent. Research-use unless otherwise specified.'
  },
  {
    id: 'wearable-systems',
    name: 'Wearable Systems',
    imageUrl: wearableSystemsImg,
    tagline: 'Customer-integrated bioelectronic devices for wearable sensing and stimulation',
    description: 'Polymer Bionics integrates its soft electrodes, adaptive materials, and electronics into customer-specific devices for comfortable, human-scale form factors. These systems are designed to maintain stable signal quality across extended wear and movement.',
    technicalDescription: 'Polymer Bionics integrates its soft electrodes, adaptive materials, and electronics into customer-specific devices for comfortable, human-scale form factors. These systems are designed to maintain stable signal quality across extended wear and movement.',
    category: 'wearable-systems',
    specifications: 'Integrated electrodes, wiring, and electronics in adaptive form factors',
    features: [
      'Integrated electrodes, wiring, and electronics',
      'Comfortable, adaptive form factors',
      'Scalable for sensing and stimulation'
    ],
    applications: [
      'EEG and neurophysiology monitoring',
      'Human–machine interaction research'
    ],
    regulatoryStatus: 'Configuration-dependent. Contact for details.'
  },
  {
    id: 'wearable-garments',
    name: 'Wearable Garment Systems',
    imageUrl: wearableGarmentsImg,
    tagline: 'Bioelectronic garments with integrated soft electrodes',
    description: 'Wearable garment systems integrate soft electrodes directly into textiles and flexible substrates, enabling distributed sensing across the body. Designs prioritise comfort, washability, and repeatable electrode placement.',
    technicalDescription: 'Wearable garment systems integrate soft electrodes directly into textiles and flexible substrates, enabling distributed sensing across the body. Designs prioritise comfort, washability, and repeatable electrode placement.',
    category: 'wearable-systems',
    specifications: 'Textile-integrated electrodes, distributed sensing capability',
    features: [
      'Textile-integrated soft electrodes',
      'Distributed sensing across large body areas',
      'Designed for comfort and repeat use'
    ],
    applications: [
      'EMG and physiological monitoring',
      'Rehabilitation and movement analysis'
    ],
    regulatoryStatus: 'Research and development systems. Not approved for clinical use.'
  },
  {
    id: 'adhesive-monitoring',
    name: 'Adhesive Monitoring Systems',
    imageUrl: adhesiveMonitoringImg,
    images: [adhesiveMonitoringImg, adhesiveMonitoringImg1],
    tagline: 'Skin-adherent wearable systems with integrated electronics',
    description: 'These systems combine conformal adhesive electrodes with embedded electronics for compact, body-worn monitoring. Designed for motion tolerance and rapid deployment without external hardware.',
    technicalDescription: 'These systems combine conformal adhesive electrodes with embedded electronics for compact, body-worn monitoring. Designed for motion tolerance and rapid deployment without external hardware.',
    category: 'wearable-systems',
    specifications: 'Adhesive electrode-electronics integration, body-conformal design',
    features: [
      'Adhesive electrode–electronics integration',
      'Low-profile, body-conformal designs',
      'Supports sensing and stimulation'
    ],
    applications: [
      'Ambulatory physiological monitoring',
      'Mobile health and remote sensing'
    ],
    regulatoryStatus: 'Prototype systems. Regulatory status depends on final configuration.'
  },
  {
    id: 'custom-implantable-arrays',
    name: 'Custom Implantable Electrode Arrays',
    imageUrl: customImplantableImg,
    images: [customImplantableImg, customImplantableImg1, customImplantableImg2],
    tagline: 'Bespoke soft electrode arrays for implantable bioelectronics',
    description: 'Polymer Bionics designs custom implantable electrode arrays tailored to partner-specific anatomical, electrical, and mechanical requirements. Arrays are based on soft elastomeric materials and can be configured for recording, stimulation, or both.',
    technicalDescription: 'Polymer Bionics designs custom implantable electrode arrays tailored to partner-specific anatomical, electrical, and mechanical requirements. Arrays are based on soft elastomeric materials and can be configured for recording, stimulation, or both.',
    category: 'implantable-systems',
    specifications: 'Custom channel count and geometry, soft compliant materials',
    features: [
      'Custom channel count and geometry',
      'Soft, compliant implantable materials',
      'Compatible with partner electronics'
    ],
    applications: [
      'Neural and bioelectronic implants',
      'Research and preclinical device development'
    ],
    regulatoryStatus: 'Research-use systems. Not approved for human implantation.'
  }
]
