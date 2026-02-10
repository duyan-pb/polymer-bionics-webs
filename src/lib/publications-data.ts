/**
 * Publications and News Data
 * 
 * News, showcase events, talks, and scientific publications
 * featuring Polymer Bionics products and team.
 * 
 * @module lib/publications-data
 */

import type { Publication, NewsItem } from './types'

/**
 * Company news, grants, showcases and talks.
 */
export const placeholderNews: NewsItem[] = [
  {
    id: 'news-babeeg-nihr',
    title: 'BabEEG Receives NIHR Support',
    summary: 'The BabEEG neonatal EEG cap project has received support from the National Institute for Health and Care Research (NIHR).',
    content: 'The BabEEG neonatal EEG cap project has received support from the National Institute for Health and Care Research (NIHR), recognising its potential to improve neonatal neurological monitoring.',
    date: 'July 2025',
    category: 'grant',
    link: 'https://www.nihr.ac.uk/print/pdf/node/72266',
  },
  {
    id: 'news-babeeg-ukri',
    title: 'BabEEG Grant Announcement – UKRI Funded',
    summary: 'Polymer Bionics receives UKRI funding for the BabEEG adaptive neonatal EEG cap project.',
    content: 'Polymer Bionics has received funding from UK Research and Innovation (UKRI) for the development of BabEEG, an adaptive EEG cap designed specifically for neonatal and infant use.',
    date: 'September 2022',
    category: 'grant',
    link: 'https://gtr.ukri.org/projects?ref=10034462',
  },
  {
    id: 'news-showcase-bioeng',
    title: 'Bioengineering Industry Showcase',
    summary: 'Polymer Bionics presented at the Imperial College Bioengineering Industry Showcase in November 2025.',
    content: 'Polymer Bionics was featured at the Bioengineering Industry Showcase hosted by Imperial College London, presenting our flexible bioelectronics platform and clinical device pipeline.',
    date: 'November 2025',
    category: 'announcement',
    link: 'https://www.imperial.ac.uk/events/198976/bioengineering-industry-showcase/',
  },
  {
    id: 'news-talk-blrs',
    title: 'Bionic Limb Reconstruction Symposium – Vienna',
    summary: 'Polymer Bionics was featured at the Bionic Limb Reconstruction Symposium in Vienna, December 2025.',
    content: 'Polymer Bionics was represented at the Bionic Limb Reconstruction Symposium (BLRS) in Vienna, contributing to discussions on advanced bioelectronic interfaces for limb reconstruction.',
    date: 'December 2025',
    category: 'announcement',
    link: 'https://www.blrs2025.org/',
  },
  {
    id: 'news-talk-royce',
    title: 'Keynote at Royce National Conference',
    summary: 'Polymer Bionics delivered a keynote presentation at the Henry Royce Institute National Conference in September 2025.',
    content: 'Polymer Bionics delivered a keynote address at the Henry Royce Institute National Conference, highlighting advances in soft bioelectronic materials and devices.',
    date: 'September 2025',
    category: 'announcement',
    link: 'https://www.royce.ac.uk/events/henry-royce-institute-conference-2025/',
  },
  {
    id: 'news-talk-embs',
    title: 'EMBS Microelectrodes Symposium',
    summary: 'Polymer Bionics presented at the IEEE EMBS Microelectrodes Symposium in July 2025.',
    content: 'Polymer Bionics participated in the IEEE Engineering in Medicine and Biology Society (EMBS) Microelectrodes Symposium, presenting work on soft electrode technologies.',
    date: 'July 2025',
    category: 'research',
    link: 'https://embc.embs.org/2025/about/',
  },
  {
    id: 'news-talk-eureka',
    title: 'Eureka 2025! Physics for Security',
    summary: 'Polymer Bionics contributed to Eureka 2025! Physics for Security at the University of Bath in July 2025.',
    content: 'Polymer Bionics was featured at Eureka 2025! Physics for Security, an interdisciplinary event at the University of Bath exploring emerging technologies for health and security applications.',
    date: 'July 2025',
    category: 'research',
    link: 'https://www.bath.ac.uk/events/eureka-2025-physics-for-security/',
  },
  {
    id: 'news-talk-bioel',
    title: 'BioEL Cambridge Symposium',
    summary: 'Polymer Bionics presented at the Cambridge Bioelectronics Symposium in July 2024.',
    content: 'Polymer Bionics participated in the Cambridge Bioelectronics Symposium (BioEL), presenting advances in conductive elastomers and flexible electrode platforms for clinical bioelectronics.',
    date: 'July 2024',
    category: 'research',
    link: 'https://bioelectronics.eng.cam.ac.uk/cambridge-bioelectronics-symposium',
  },
]

/**
 * Scientific publications and studies using Polymer Bionics products.
 */
export const placeholderPublications: Publication[] = [
  {
    id: 'pub-zhu-2023',
    title: 'Temporal interference stimulation evoked neural local field potential oscillations in-vivo',
    authors: ['Xiaoqi Zhu', 'Jonathan Howard', 'Zack Bailey', 'Adam Williamson', 'Rylie A Green', 'Eric Daniel Glowacki', 'Nir Grossman'],
    journal: 'Brain Stimulation',
    year: 2023,
    date: '2023',
    type: 'journal',
    abstract: 'This study demonstrates temporal interference stimulation evoked neural local field potential oscillations in-vivo, utilising Polymer Bionics electrode technology.',
    tags: ['neural stimulation', 'temporal interference', 'in-vivo', 'bioelectronics'],
    doi: 'https://doi.org/10.1016/j.brs.2023.01.651',
  },
  {
    id: 'pub-rapeaux-2022',
    title: 'Preparation of rat sciatic nerve for ex vivo neurophysiology',
    authors: ['Adrien Rapeaux', 'Omaer Syed', 'Estelle Cuttaz', 'Christopher AR Chapman', 'Rylie A Green', 'Timothy G Constandinou'],
    journal: 'Journal of Visualized Experiments: JoVE',
    year: 2022,
    date: '2022',
    type: 'journal',
    abstract: 'This protocol describes the preparation of rat sciatic nerve for ex vivo neurophysiology experiments, using flexible electrode interfaces developed with Polymer Bionics materials.',
    tags: ['neurophysiology', 'sciatic nerve', 'ex vivo', 'bioelectronics'],
    doi: 'https://doi.org/10.3791/63838',
  },
]
