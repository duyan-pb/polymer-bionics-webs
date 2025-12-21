import type { Video, CaseStudy, Datasheet } from './types'

export const placeholderVideos: Video[] = [
  {
    id: 'vid-1',
    title: 'Polymer Bionics Platform Overview',
    description: 'High-level walkthrough of our flexible bioelectronics platform, material stack, and core clinical applications.',
    videoUrl: 'https://example.com/video/platform-overview.mp4',
    category: 'overview',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091215367-59ab6b68d1d5',
    duration: '3:12',
  },
  {
    id: 'vid-2',
    title: 'Conductive Elastomer Reliability Test',
    description: 'Bench testing showing fatigue resistance and impedance stability across 10k flex cycles.',
    videoUrl: 'https://example.com/video/elastomer-test.mp4',
    category: 'validation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530023367847-a683933f4177',
    duration: '2:08',
  },
]

export const placeholderCaseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Wearable Cardiac Monitor Patch',
    description: 'Soft, skin-conforming ECG patch enabling multi-day continuous monitoring.',
    problem: 'Traditional rigid electrodes degrade signal quality during movement and cause skin irritation over multi-day wear.',
    solution: 'Conductive hydrogel electrodes on stretchable substrates with breathable encapsulation.',
    results: 'Reduced motion artefact by 38% and improved patient comfort scores by 2.1x versus rigid patches.',
    pdfUrl: 'https://example.com/case-studies/cardiac-monitor.pdf',
    category: 'cardiology',
    publishedDate: 'November 2024',
    datasheetId: 'datasheet-biongel',
  },
  {
    id: 'case-2',
    title: 'Peripheral Nerve Interface Array',
    description: 'Stretchable microelectrode array for peripheral nerve stimulation in a pre-clinical model.',
    problem: 'Conventional arrays delaminate under strain and lose conductivity over time.',
    solution: 'PEDOT:PSS-coated stretchable conductors with silicone encapsulation and low-modulus interconnects.',
    results: 'Maintained <2 kΩ impedance after 5k flex cycles; no observable delamination.',
    pdfUrl: 'https://example.com/case-studies/nerve-array.pdf',
    category: 'neuro',
    publishedDate: 'September 2024',
    datasheetId: 'datasheet-elastarray',
  },
]

export const placeholderDatasheets: Datasheet[] = [
  {
    id: 'datasheet-biongel',
    name: 'BionGel Conductive Hydrogel',
    title: 'BionGel Conductive Hydrogel Datasheet',
    description: 'Hydrogel formulation optimized for low-impedance skin contact and long-wear comfort.',
    category: 'Advanced Materials',
    version: 'v1.1',
    lastUpdated: 'December 2024',
    pdfUrl: 'https://example.com/datasheets/biongel.pdf',
    technicalSpecs: {
      'Base Polymer': 'PEDOT:PSS hydrogel composite',
      'Sheet Resistance': '< 50 Ω/sq',
      'Elongation': '150% before yield',
      'Biocompatibility': 'ISO 10993 Part 5/10 passed',
      'Sterilization': 'EtO, gamma compatible',
    },
  },
  {
    id: 'datasheet-elastarray',
    name: 'ElastArray Stretchable Electrode',
    title: 'ElastArray Stretchable Electrode Datasheet',
    description: 'Stretchable electrode array with low-modulus conductors for neural and cardiac sensing.',
    category: 'Clinical Applications',
    version: 'v0.9',
    lastUpdated: 'October 2024',
    pdfUrl: 'https://example.com/datasheets/elastarray.pdf',
    technicalSpecs: {
      'Substrate': 'Medical grade silicone',
      'Electrode Coating': 'PEDOT:PSS',
      'Impedance @1kHz': '< 1.5 kΩ',
      'Cyclic Bend Life': '> 10k cycles at 20% strain',
      'Connector': 'ZIF-compatible tail',
    },
  },
]
