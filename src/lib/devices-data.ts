/**
 * Devices Data
 * 
 * Proprietary bioelectronic devices developed in-house.
 * Complete wearable or implantable systems built on core materials and electrode platforms.
 * 
 * @module lib/devices-data
 */

import type { Product } from './types'

// Device images (high-fidelity originals where available, optimized fallback otherwise)
import simpleegImg from '@/assets/images/devices/originals/SimplEEG/Picture 1headband.png'
import simpleegImg1 from '@/assets/images/devices/optimized/simpleeg_1.webp'
import simpleegImg2 from '@/assets/images/devices/optimized/simpleeg_2.webp'
import simpleegImg3 from '@/assets/images/devices/optimized/simpleeg_3.webp'
import babeegImg from '@/assets/images/devices/originals/BabEEG/BabEEG phantom.png'
import babeegImg1 from '@/assets/images/devices/originals/BabEEG/BabEEG with kid.png'

/**
 * Proprietary bioelectronic devices.
 * Complete wearable or implantable systems designed for clinical translation and commercial deployment.
 */
export const devices: Product[] = [
  {
    id: 'simpleeg',
    name: 'SimplEEG',
    imageUrl: simpleegImg,
    images: [simpleegImg, simpleegImg1, simpleegImg2, simpleegImg3],
    tagline: 'Silicone 5-electrode headband for accessible EEG monitoring',
    description: 'SimplEEG is a comfortable silicone headband featuring 5 soft electrodes for simplified EEG acquisition. Designed for ease of use in research and clinical screening applications.',
    technicalDescription: 'SimplEEG is a comfortable silicone headband featuring 5 soft electrodes for simplified EEG acquisition. The system is designed for rapid deployment and consistent electrode placement without specialised training.',
    category: 'eeg-devices',
    specifications: '5-channel EEG, silicone headband form factor',
    features: [
      'Comfortable silicone headband design',
      '5-channel soft electrode array',
      'Rapid, repeatable placement'
    ],
    applications: [
      'EEG research and screening',
      'Neurophysiology studies'
    ],
    regulatoryStatus: 'Research system. Regulatory pathway in progress.',
    datasheets: [
      { name: 'SimplEEG Headband Datasheet', pdfUrl: '/datasheets/SimplEEGheadband_PB_datasheet.pdf' },
    ],
  },
  {
    id: 'babeeg',
    name: 'BabEEG',
    imageUrl: babeegImg,
    images: [babeegImg, babeegImg1],
    tagline: 'Adaptive EEG cap for neonatal and infant monitoring',
    description: 'BabEEG is a soft, adaptive EEG cap designed specifically for neonatal and infant use. It uses auxetic structures and soft electrodes to accommodate rapid changes in head size while maintaining reliable signal quality.',
    technicalDescription: 'BabEEG is a soft, adaptive EEG cap designed specifically for neonatal and infant use. It uses auxetic structures and soft electrodes to accommodate rapid changes in head size while maintaining reliable signal quality.',
    category: 'eeg-devices',
    specifications: 'Adaptive auxetic structure, infant-specific sizing',
    features: [
      'Infant-specific adaptive fit',
      'Soft, comfortable electrode interfaces',
      'Rapid and repeatable placement'
    ],
    applications: [
      'Neonatal EEG monitoring',
      'Research and clinical feasibility studies'
    ],
    regulatoryStatus: 'Under development. Regulatory pathway in progress.'
  },
  {
    id: 'inear-eeg',
    name: 'In-Ear EEG',
    tagline: 'Compact EEG earbuds for distributed neural sensing',
    description: 'In-Ear EEG earbuds provide a compact, modular approach to ear-based neural sensing. Designed for scalability and integration with external platforms.',
    technicalDescription: 'In-ear EEG earbuds provide a compact, modular approach to ear-based neural sensing. Designed for scalability and integration with external platforms.',
    category: 'eeg-devices',
    specifications: 'Earbud form factor, modular sensor architecture',
    features: [
      'Earbud-style modular architecture',
      'Scalable sensing configurations',
      'Comfortable, low-profile design'
    ],
    applications: [
      'Wearable neurotechnology research',
      'Consumer-adjacent sensing platforms'
    ],
    regulatoryStatus: 'Early-stage development. Not approved for clinical use.'
  },
  {
    id: 'sports-eeg',
    name: 'Sports EEG',
    tagline: 'Multi-sensor in-ear bioelectronic monitoring system',
    description: 'The Sports EEG headset integrates soft electrodes with additional physiological sensors to enable discreet, continuous monitoring. The form factor supports stable electrode placement with minimal user intervention.',
    technicalDescription: 'This in-ear EEG headset integrates soft electrodes with additional physiological sensors to enable discreet, continuous monitoring. The form factor supports stable electrode placement with minimal user intervention.',
    category: 'eeg-devices',
    specifications: 'Multi-sensor integration, ear-based form factor',
    features: [
      'Integrated EEG and auxiliary sensors',
      'Discreet, ear-based form factor',
      'Suitable for long-duration wear'
    ],
    applications: [
      'Neurophysiology and sleep research',
      'Continuous health monitoring'
    ],
    regulatoryStatus: 'Prototype system. Research-use only.'
  }
]
