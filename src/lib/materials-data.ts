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
    id: 'pedot-pss',
    name: 'PEDOT:PSS',
    description: 'Poly(3,4-ethylenedioxythiophene) polystyrene sulfonate - a highly conductive organic polymer for flexible bioelectronics',
    properties: [
      'High electrical conductivity (up to 1000 S/cm)',
      'Excellent mechanical flexibility',
      'Biocompatible and tissue-safe',
      'Solution-processable',
      'Transparent in thin films'
    ],
    keyAdvantages: [
      'Superior conformability to tissue surfaces',
      'Low impedance for high-quality signal recording',
      'Chemical stability in physiological environments',
      'Scalable manufacturing process'
    ],
    technicalDetails: 'Our proprietary PEDOT:PSS formulations are optimized for medical-grade applications with enhanced conductivity and mechanical durability. The material exhibits excellent electrochemical stability and can be patterned at high resolution for complex electrode geometries.',
    imageClass: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
  },
  {
    id: 'hydrogels',
    name: 'Biocompatible Hydrogels',
    description: 'Advanced hydrogel matrices designed for soft tissue interfacing and drug delivery applications',
    properties: [
      'Tunable mechanical properties (1-100 kPa)',
      'High water content (70-95%)',
      'Tissue-mimetic compliance',
      'Controlled degradation profiles',
      'Injectable formulations available'
    ],
    keyAdvantages: [
      'Minimizes foreign body response',
      'Enables sustained drug release',
      'Matches soft tissue mechanical properties',
      'Can incorporate bioactive molecules'
    ],
    technicalDetails: 'Our hydrogel platform includes both natural and synthetic polymer systems with precisely controlled crosslinking chemistry. Materials can be customized for specific applications with controlled swelling ratios, degradation kinetics, and mechanical properties.',
    imageClass: 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20'
  },
  {
    id: 'silicone-elastomers',
    name: 'Medical-Grade Silicone Elastomers',
    description: 'Ultra-soft silicone polymers for long-term implantable devices and wearable electronics',
    properties: [
      'Shore hardness: 00-10 to 00-50',
      'Elongation at break: >400%',
      'Excellent tear resistance',
      'Biostable for long-term implantation',
      'Gas permeable'
    ],
    keyAdvantages: [
      'Exceptional biocompatibility',
      'Maintains properties over years of implantation',
      'Resistant to body fluids and enzymes',
      'Can be molded into complex 3D shapes'
    ],
    technicalDetails: 'Our silicone formulations are specifically designed for medical device applications, meeting USP Class VI and ISO 10993 requirements. The materials offer excellent processability while maintaining ultra-soft mechanical properties critical for chronic implants.',
    imageClass: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
  },
  {
    id: 'parylene',
    name: 'Parylene-C Coatings',
    description: 'Ultra-thin conformal polymer coatings for device encapsulation and barrier protection',
    properties: [
      'Coating thickness: 0.1-50 μm',
      'Pinhole-free coverage',
      'Excellent barrier properties',
      'Optical transparency',
      'Chemical inertness'
    ],
    keyAdvantages: [
      'Uniform coating on complex geometries',
      'Superior moisture barrier',
      'Maintains device miniaturization',
      'Room temperature deposition process'
    ],
    technicalDetails: 'Parylene-C deposition via chemical vapor deposition provides molecular-level conformal coating without heat, UV, or catalysts. The coating process is compatible with temperature-sensitive materials and provides reliable long-term protection in harsh biological environments.',
    imageClass: 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20'
  },
  {
    id: 'polyimide',
    name: 'Flexible Polyimide Substrates',
    description: 'High-performance polymer substrates for flexible circuit boards and neural interfaces',
    properties: [
      'High temperature stability (>350°C)',
      'Low dielectric constant',
      'Excellent mechanical strength',
      'Chemical resistance',
      'Dimensional stability'
    ],
    keyAdvantages: [
      'Enables high-density interconnects',
      'Compatible with microfabrication processes',
      'Maintains flexibility at small bend radii',
      'Long-term reliability in vivo'
    ],
    technicalDetails: 'Our polyimide films are precision-engineered for medical device applications with controlled thickness uniformity and surface roughness. The material provides an ideal substrate for flexible electronics while maintaining the mechanical robustness required for surgical handling.',
    imageClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
  },
  {
    id: 'liquid-crystal-polymers',
    name: 'Liquid Crystal Polymers (LCP)',
    description: 'Ultra-thin, high-performance thermoplastics for hermetic encapsulation of active implants',
    properties: [
      'Extremely low moisture absorption',
      'High barrier to ions and gases',
      'Biocompatible and biostable',
      'Thermal stability',
      'Low dielectric loss'
    ],
    keyAdvantages: [
      'Superior hermetic sealing for electronics',
      'Enables ultra-miniaturized implants',
      'Long-term stability in saline environments',
      'Laser-weldable for secure seals'
    ],
    technicalDetails: 'LCP materials provide the gold standard for hermetic packaging of active implantable medical devices. Our processing techniques enable thin-film LCP structures that maintain barrier properties while allowing device miniaturization critical for minimally invasive procedures.',
    imageClass: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20'
  }
]

export const applications: Application[] = [
  {
    id: 'neural-interfaces',
    name: 'Neural Interfaces & Brain-Computer Interfaces',
    description: 'High-density electrode arrays for neural recording and stimulation with minimal tissue damage',
    benefits: [
      'High-fidelity signal recording from individual neurons',
      'Chronic stability over months to years',
      'Reduced inflammatory response compared to rigid electrodes',
      'Scalable to thousands of channels',
      'Compatible with advanced signal processing'
    ],
    useCases: [
      'Intracortical brain-computer interfaces',
      'Peripheral nerve interfaces for prosthetic control',
      'Spinal cord stimulation for pain management',
      'Deep brain stimulation for movement disorders',
      'Electrocorticography (ECoG) arrays'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Flexible Polyimide Substrates', 'Parylene-C Coatings'],
    imageClass: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'wearable-biosensors',
    name: 'Wearable Biosensors & Health Monitoring',
    description: 'Comfortable, skin-conforming sensors for continuous physiological monitoring',
    benefits: [
      'Continuous real-time health data collection',
      'Minimal user discomfort during long-term wear',
      'High signal quality with motion artifacts reduction',
      'Wireless data transmission capabilities',
      'Integration with digital health platforms'
    ],
    useCases: [
      'Continuous glucose monitoring',
      'ECG and cardiac arrhythmia detection',
      'EEG for sleep and seizure monitoring',
      'Hydration and electrolyte tracking',
      'Temperature and inflammation monitoring'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Medical-Grade Silicone Elastomers', 'Biocompatible Hydrogels'],
    imageClass: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'drug-delivery',
    name: 'Smart Drug Delivery Systems',
    description: 'Controlled and responsive drug release platforms for targeted therapeutics',
    benefits: [
      'Precise spatial and temporal drug delivery',
      'Reduced systemic side effects',
      'Improved patient compliance',
      'Responsive release based on physiological triggers',
      'Combination therapy capabilities'
    ],
    useCases: [
      'Localized chemotherapy delivery',
      'Insulin delivery systems',
      'Pain management implants',
      'Ocular drug delivery',
      'Wound healing and tissue regeneration'
    ],
    relevantMaterials: ['Biocompatible Hydrogels', 'Medical-Grade Silicone Elastomers', 'PEDOT:PSS'],
    imageClass: 'bg-gradient-to-br from-teal-500/10 to-emerald-500/10'
  },
  {
    id: 'cardiac-devices',
    name: 'Cardiac Monitoring & Therapeutic Devices',
    description: 'Flexible electronics for cardiac diagnostics, mapping, and electrical therapy',
    benefits: [
      'Conformal contact with dynamic cardiac tissue',
      'High-resolution electrical mapping',
      'Reduced risk of perforation or tissue damage',
      'MRI-compatible designs possible',
      'Chronic stability in hemodynamic environment'
    ],
    useCases: [
      'Epicardial mapping arrays',
      'Leadless pacemaker technologies',
      'Cardiac ablation guidance',
      'Arrhythmia monitoring implants',
      'Hemodynamic sensors'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Parylene-C Coatings', 'Medical-Grade Silicone Elastomers'],
    imageClass: 'bg-gradient-to-br from-red-500/10 to-rose-500/10'
  },
  {
    id: 'surgical-tools',
    name: 'Smart Surgical Instruments',
    description: 'Sensor-integrated surgical tools for enhanced precision and real-time feedback',
    benefits: [
      'Real-time tissue characterization',
      'Force and pressure feedback',
      'Integration with robotic surgery systems',
      'Reduced surgical complications',
      'Enhanced training capabilities'
    ],
    useCases: [
      'Electrosurgical instruments with sensing',
      'Smart forceps and graspers',
      'Tissue differentiation tools',
      'Minimally invasive surgical robots',
      'Biopsy needles with integrated sensors'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Flexible Polyimide Substrates', 'Parylene-C Coatings'],
    imageClass: 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10'
  },
  {
    id: 'wound-care',
    name: 'Advanced Wound Care & Healing',
    description: 'Smart wound dressings with integrated sensors and therapeutic functions',
    benefits: [
      'Real-time wound condition monitoring',
      'Infection detection and prevention',
      'Accelerated healing through electrical stimulation',
      'Reduced dressing change frequency',
      'Improved patient outcomes'
    ],
    useCases: [
      'Chronic wound management',
      'Diabetic ulcer treatment',
      'Surgical site monitoring',
      'Burn treatment and monitoring',
      'Pressure ulcer prevention'
    ],
    relevantMaterials: ['Biocompatible Hydrogels', 'PEDOT:PSS', 'Medical-Grade Silicone Elastomers'],
    imageClass: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  },
  {
    id: 'organ-on-chip',
    name: 'Organ-on-Chip & In-Vitro Models',
    description: 'Microfluidic platforms with integrated sensors for advanced drug testing and disease modeling',
    benefits: [
      'More physiologically relevant than 2D cultures',
      'Real-time monitoring of cellular responses',
      'Reduced animal testing requirements',
      'High-throughput drug screening',
      'Patient-specific disease modeling'
    ],
    useCases: [
      'Drug toxicity screening',
      'Disease mechanism studies',
      'Personalized medicine development',
      'Environmental toxin assessment',
      'Tissue engineering research'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Biocompatible Hydrogels', 'Parylene-C Coatings'],
    imageClass: 'bg-gradient-to-br from-lime-500/10 to-green-500/10'
  },
  {
    id: 'prosthetics',
    name: 'Advanced Prosthetics & Rehabilitation',
    description: 'Sensor-embedded prosthetic interfaces for improved control and sensory feedback',
    benefits: [
      'Natural movement control through neural signals',
      'Sensory feedback restoration',
      'Reduced phantom limb pain',
      'Improved osseointegration',
      'Long-term biocompatibility'
    ],
    useCases: [
      'Myoelectric prosthetic limbs',
      'Neural-controlled prosthetics',
      'Sensory feedback systems',
      'Osseointegrated implant interfaces',
      'Rehabilitation monitoring devices'
    ],
    relevantMaterials: ['PEDOT:PSS', 'Medical-Grade Silicone Elastomers', 'Flexible Polyimide Substrates'],
    imageClass: 'bg-gradient-to-br from-sky-500/10 to-blue-500/10'
  }
]
