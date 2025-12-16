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
    description: 'Soft, conductive gel coating for improving the performance of existing bionic devices',
    properties: [
      'High electrical conductivity',
      'Soft, tissue-compliant consistency',
      'Biocompatible formulation',
      'Reduces impedance at electrode-tissue interfaces',
      'Long-lasting performance'
    ],
    keyAdvantages: [
      'Significantly improves signal quality for existing devices',
      'Enhances electrode-tissue coupling',
      'Reduces irritation and inflammation',
      'Easy application to existing hardware',
      'Stable in physiological environments'
    ],
    technicalDetails: 'BionGel is formulated to create an optimal electrical interface between rigid electrodes and soft biological tissues. The gel maintains its conductive properties over extended periods while conforming to tissue surfaces, dramatically improving the performance of neural interfaces, cardiac monitors, and other bioelectronic devices.',
    imageClass: 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20'
  },
  {
    id: 'elastibion',
    name: 'ElastiBion',
    description: 'Flexible conductive material that can be fabricated into electrodes for both wearable and implantable devices',
    properties: [
      'Excellent electrical conductivity',
      'High mechanical flexibility and stretchability',
      'Biocompatible and biostable',
      'Can be patterned at high resolution',
      'Compatible with microfabrication techniques'
    ],
    keyAdvantages: [
      'Conforms to dynamic tissue surfaces',
      'Reduces mechanical mismatch with biological tissues',
      'Enables high-density electrode arrays',
      'Long-term chronic implantation stability',
      'Suitable for both wearable and implantable applications'
    ],
    technicalDetails: 'ElastiBion combines the electrical performance of traditional metal electrodes with the mechanical properties of soft elastomers. This unique material can be fabricated into flexible electrode arrays that maintain electrical performance while conforming to curved, moving biological surfaces. The material is optimized for neural recording, cardiac monitoring, and muscle stimulation applications.',
    imageClass: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
  },
  {
    id: 'elastisolder',
    name: 'ElastiSolder',
    description: 'Bonding material for creating connections to metallic hardware such as wires and control systems',
    properties: [
      'Electrically conductive',
      'Flexible and strain-tolerant',
      'Strong adhesion to metals and polymers',
      'Low-temperature processing',
      'Reliable electrical connections'
    ],
    keyAdvantages: [
      'Creates robust electrical connections that withstand flexing',
      'Eliminates failure points common with rigid solder joints',
      'Compatible with flexible electronics manufacturing',
      'Maintains conductivity under mechanical stress',
      'Biocompatible formulation for medical applications'
    ],
    technicalDetails: 'ElastiSolder is specifically engineered to solve the challenge of connecting flexible polymer electrodes to rigid metallic hardware such as wires, connectors, and control electronics. Traditional solder creates brittle joints that fail under flexing; ElastiSolder maintains electrical conductivity while accommodating the mechanical strain inherent in flexible bioelectronic devices.',
    imageClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
  }
]

export const applications: Application[] = [
  {
    id: 'elasticuff',
    name: 'ElastiCuff',
    description: 'Flexible cuff electrode for interfacing with peripheral nerves to enable advanced prosthetic control and sensory feedback',
    benefits: [
      'Conforms to nerve geometry without constriction',
      'High-resolution neural signal recording',
      'Enables bidirectional communication with nerves',
      'Reduced foreign body response',
      'Long-term chronic stability',
      'Suitable for multi-channel neural interfaces'
    ],
    useCases: [
      'Prosthetic limb control via peripheral nerve signals',
      'Sensory feedback restoration for amputees',
      'Functional electrical stimulation for paralysis',
      'Vagus nerve stimulation therapy',
      'Bladder and bowel control applications',
      'Chronic pain management'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'elastarray',
    name: 'ElastArray',
    description: 'Flexible electrode array for tissue surface diagnostics and therapies with superior conformability',
    benefits: [
      'Conforms to curved and dynamic tissue surfaces',
      'High-density electrode configurations',
      'Excellent signal-to-noise ratio',
      'Minimally invasive application',
      'Compatible with both recording and stimulation',
      'Reduced tissue damage and inflammation'
    ],
    useCases: [
      'Epicardial cardiac mapping and ablation',
      'Brain surface electrocorticography (ECoG)',
      'Spinal cord stimulation arrays',
      'Muscle activity mapping and stimulation',
      'Nerve repair and regeneration monitoring',
      'Tissue health diagnostics'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'elastiwire',
    name: 'ElastiWire',
    description: 'Flexible polymeric wires for reliable electrical connection between bioelectronic devices and external hardware',
    benefits: [
      'Maintains conductivity under repeated flexing',
      'Biocompatible for implantable applications',
      'Resistant to fatigue failure',
      'Compatible with minimally invasive deployment',
      'Reduces mechanical stress on tissue interfaces',
      'Lower impedance than traditional wire leads'
    ],
    useCases: [
      'Neural implant lead wires',
      'Cardiac pacemaker and defibrillator leads',
      'Deep brain stimulation connections',
      'Cochlear implant wiring',
      'Connections for wearable biosensors',
      'Linking flexible electrodes to rigid electronics'
    ],
    relevantMaterials: ['ElastiBion', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-teal-500/10 to-emerald-500/10'
  },
  {
    id: 'simpleeg',
    name: 'SimplEEG',
    description: 'Wearable and reusable sensors for electromyography (EMG) and electroencephalography (EEG) with hospital-grade performance',
    benefits: [
      'Easy application and removal',
      'Reusable for cost-effective monitoring',
      'High signal quality comparable to clinical systems',
      'Comfortable for extended wear',
      'Compatible with standard EEG/EMG systems',
      'Minimal skin preparation required'
    ],
    useCases: [
      'Clinical EEG monitoring for epilepsy',
      'Sleep disorder diagnostics',
      'Brain-computer interface research',
      'Muscle rehabilitation monitoring',
      'Sports performance analysis',
      'Neurofeedback therapy'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel'],
    imageClass: 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10'
  },
  {
    id: 'babeeg',
    name: 'BabEEG',
    description: 'Specialized sensors for continuous monitoring of infant biosignals with gentle, skin-safe design',
    benefits: [
      'Designed specifically for delicate infant skin',
      'Continuous monitoring without frequent repositioning',
      'Minimal disruption to infant comfort and sleep',
      'High signal quality for accurate diagnostics',
      'Easy application by clinical staff',
      'Reduced infection risk compared to traditional electrodes'
    ],
    useCases: [
      'Neonatal seizure monitoring',
      'Premature infant brain development tracking',
      'Sleep apnea detection in infants',
      'Cardiac monitoring in NICU settings',
      'Developmental milestone assessment',
      'Early detection of neurological disorders'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel'],
    imageClass: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10'
  },
  {
    id: 'inear-eeg',
    name: 'InEar EEG',
    description: 'Discreet in-ear EEG sensor for continuous brain activity monitoring with clinical-grade signal quality',
    benefits: [
      'Comfortable all-day wear without visible hardware',
      'High-quality EEG signal acquisition from ear canal',
      'Minimal interference with daily activities',
      'Secure fit for continuous monitoring during movement',
      'Reusable design for long-term studies',
      'Compatible with wireless data transmission systems'
    ],
    useCases: [
      'Continuous EEG monitoring in ambulatory settings',
      'Long-term epilepsy monitoring outside hospital',
      'Sleep disorder diagnostics and research',
      'Brain-computer interface applications',
      'Cognitive performance monitoring',
      'Remote neurological patient monitoring'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiWire'],
    imageClass: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
  },
  {
    id: 'custom-applications',
    name: 'Customer-Specific Applications',
    description: 'Tailored flexible bioelectronic solutions designed in collaboration with medical device partners for unique clinical needs',
    benefits: [
      'Customized electrode geometries and configurations',
      'Application-specific material formulations',
      'Optimized for manufacturing scalability',
      'Regulatory guidance and support',
      'Rapid prototyping and iteration',
      'Comprehensive technical documentation'
    ],
    useCases: [
      'Novel medical device development',
      'Custom research instrumentation',
      'Specialized clinical diagnostic tools',
      'Next-generation implantable devices',
      'Advanced wearable health monitors',
      'Veterinary and animal research applications'
    ],
    relevantMaterials: ['ElastiBion', 'BionGel', 'ElastiSolder'],
    imageClass: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  }
]
