/**
 * Product Data
 * 
 * Product catalog for FlexElec electrode products.
 * High-performance soft electrodes for bioelectronic interfaces.
 * 
 * @module lib/seed-data
 */

import type { Product } from './types'

// Product images (high-fidelity originals where available, optimized fallback otherwise)
import flexelecFoamImg from '@/assets/images/products/originals/FlexElec Foam Electrode/FlexElecFoam.jpg'
import flexelecFoamImg1 from '@/assets/images/products/optimized/flexelec_foam_1.webp'
import flexelecFoamImg2 from '@/assets/images/products/optimized/flexelec_foam_2.webp'
import flexelecSheetImg from '@/assets/images/products/originals/FlexElec Sheet Electrode/flat electrode alone1.png'
import flexelecProbeImg from '@/assets/images/products/originals/FlexElec Probe Electrode/FlexElec Probe Full.jpg'
import flexelecProbeImg1 from '@/assets/images/products/originals/FlexElec Probe Electrode/Picture_FlexElecProbe.jpg'
import flexelecCuffImg from '@/assets/images/products/originals/FlexElec Cuff/CE cuff.png'
import flexelecCuffImg1 from '@/assets/images/products/originals/FlexElec Cuff/IMG_8440_scale.png'
import flexelecCuffImg2 from '@/assets/images/products/originals/FlexElec Cuff/IMG_9191_scale.JPG'
import flexelecMeaImg from '@/assets/images/products/originals/FlexElec MEA/Panel MEA.png'
import flexelecMeaImg1 from '@/assets/images/products/originals/FlexElec MEA/MEA pic invitro.jpg'
import flexelecMeaImg2 from '@/assets/images/products/originals/FlexElec MEA/MEA zoom in.png'

/**
 * FlexElec product catalog.
 * High-performance soft electrodes for bioelectronic interfaces.
 */
export const initialProducts: Product[] = [
  {
    id: 'flexelec-foam',
    name: 'FlexElec Foam Electrode',
    imageUrl: flexelecFoamImg,
    images: [flexelecFoamImg, flexelecFoamImg1, flexelecFoamImg2],
    tagline: 'Comfort-first dry electrodes for long-duration wearable bioelectronics',
    description: 'FlexElec Foam dry electrodes are soft, memory-foam-based electrodes designed for wearable bioelectronic sensing without gels or skin preparation. They conform to body contours to maintain stable contact while minimising pressure and discomfort during prolonged use.',
    technicalDescription: 'FlexElec Foam dry electrodes are soft, memory-foam-based electrodes designed for wearable bioelectronic sensing without gels or skin preparation. They conform to body contours to maintain stable contact while minimising pressure and discomfort during prolonged use.',
    category: 'electrodes',
    specifications: 'Memory-foam substrate, dry electrode interface, body-conforming design',
    features: [
      'Comfortable, compliant dry electrode design',
      'Stable skin contact without gels or adhesives',
      'Suitable for long-term and repeated wear'
    ],
    applications: [
      'Wearable electrophysiology (EEG, EMG, ECG)',
      'Human–machine interaction research including stimulation'
    ],
    regulatoryStatus: 'Research-use product. Not certified for clinical diagnosis.',
    datasheets: [
      { name: 'SimplEEG Datasheet', pdfUrl: '/datasheets/SimplEEG_PB_datasheet.pdf' },
    ],
  },
  {
    id: 'flexelec-sheet',
    name: 'FlexElec Sheet Electrode',
    imageUrl: flexelecSheetImg,
    tagline: 'Adhesive, skin-conforming electrodes for high-fidelity wearable sensing',
    description: 'FlexElec Sheet electrodes combine soft conductive materials with a conformal adhesive layer to create low-profile wearable electrodes with strong skin coupling. They are designed to support stable signal acquisition during movement, as well as consistent and repeatable electrical stimulation over time.',
    technicalDescription: 'FlexElec Sheet electrodes combine soft conductive materials with a conformal adhesive layer to create low-profile wearable electrodes with strong skin coupling. They are designed to support stable signal acquisition during movement, as well as consistent and repeatable electrical stimulation over time.',
    category: 'electrodes',
    specifications: 'Conformal adhesive interface, low-profile flexible structure',
    features: [
      'Conformal adhesive interface for secure attachment',
      'Low-profile, flexible electrode structure',
      'Improved signal quality during motion'
    ],
    applications: [
      'Wearable biosignal monitoring',
      'Mobile health and rehabilitation devices including stimulation'
    ],
    regulatoryStatus: 'Research-use product. Skin-contact materials selected for biocompatibility.'
  },
  {
    id: 'flexelec-probe',
    name: 'FlexElec Probe Electrode',
    imageUrl: flexelecProbeImg,
    imagePosition: 'center 30%',
    images: [flexelecProbeImg, flexelecProbeImg1],
    tagline: 'Flexible stimulation and recording wire electrodes for bioelectronic research',
    description: 'FlexElec Probe electrodes are conventional metal wires coated with a compliant elastomer layer to reduce stiffness while maintaining electrical performance. They are designed for research applications requiring flexible stimulation and recording interfaces within bench setups or head-fixed research studies.',
    technicalDescription: 'FlexElec coated wires are conventional metal wires coated with a compliant elastomer layer to reduce stiffness while maintaining electrical performance. They are designed for research applications requiring flexible stimulation and recording interfaces within bench setups or head-fixed research studies.',
    category: 'electrodes',
    specifications: 'Elastomer-coated metal wire, flexible lead design',
    features: [
      'Elastomer-coated conductive leads',
      'Improved flexibility compared to bare metal wires',
      'Compatible with standard research electronics'
    ],
    applications: [
      'Neural stimulation and recording studies',
      'Peripheral nerve and muscle research'
    ],
    regulatoryStatus: 'Research-use product only.',
    datasheets: [
      { name: 'FlexElec Probe Datasheet', pdfUrl: '/datasheets/FlexElecProbe_PB_datasheet.pdf' },
    ],
  },
  {
    id: 'flexelec-cuff',
    name: 'FlexElec Cuff',
    imageUrl: flexelecCuffImg,
    images: [flexelecCuffImg, flexelecCuffImg1, flexelecCuffImg2],
    tagline: 'Self-conforming peripheral nerve interface electrodes',
    description: 'FlexElec Cuff electrodes are soft, flexible nerve cuff electrodes designed to wrap around peripheral nerves for recording and stimulation. The elastomeric design conforms to nerve geometry while minimising mechanical stress on delicate neural tissue.',
    technicalDescription: 'FlexElec Cuff electrodes are soft, flexible nerve cuff electrodes designed to wrap around peripheral nerves for recording and stimulation. The elastomeric design conforms to nerve geometry while minimising mechanical stress on delicate neural tissue.',
    category: 'electrodes',
    specifications: 'Self-conforming cuff design, multi-contact configurations available',
    features: [
      'Flexible, conforming cuff architecture',
      'Minimises mechanical stress on nerve tissue',
      'Available in multiple sizes and contact configurations'
    ],
    applications: [
      'Peripheral nerve stimulation and recording',
      'Preclinical neuromodulation research'
    ],
    regulatoryStatus: 'Research-use product. Not approved for human implantation.'
  },
  {
    id: 'flexelec-mea',
    name: 'FlexElec MEA',
    imageUrl: flexelecMeaImg2,
    images: [flexelecMeaImg2, flexelecMeaImg, flexelecMeaImg1],
    tagline: 'Soft, flexible implantable electrodes for stimulation and recording',
    description: 'FlexElec MEA (Multi-Electrode Array) electrodes are soft, conductive elastomer-based electrodes designed for use in implantable bioelectronic systems. They are available in scalable configurations ranging from single-channel reference electrodes to multi-channel electrode arrays, supporting both neural recording and electrical stimulation.',
    technicalDescription: 'FlexElec implantable electrodes are soft, conductive elastomer–based electrodes designed for use in implantable bioelectronic systems. They are available in scalable configurations ranging from single-channel reference electrodes to multi-channel electrode arrays, supporting both neural recording and electrical stimulation.',
    category: 'electrodes',
    specifications: 'Configurable 1-64 channels, soft elastomeric architecture',
    features: [
      'Flexible, elastomeric electrode architecture',
      'Configurable from 1 to 64 channels',
      'Suitable for both stimulation and recording'
    ],
    applications: [
      'Implantable neural and bioelectronic research',
      'Peripheral nerve and cortical interface development'
    ],
    regulatoryStatus: 'Research-use product. Not approved for human implantation.'
  }
]

/**
 * Generates products for async loading.
 * @returns Promise resolving to array of Product objects
 */
export async function generateBiomaterialsProducts(): Promise<Product[]> {
  return initialProducts
}
