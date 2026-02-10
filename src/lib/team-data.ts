/**
 * Team Data
 * 
 * Seed data for team member profiles.
 * This data is used to initialize the KV store on first load.
 * 
 * @module lib/team-data
 */

import type { TeamMember } from './types'

// Team member images (web-optimized)
import rylieGreenImg from '@/assets/images/team/optimized/rylie_green.webp'
import benGreenImg from '@/assets/images/team/optimized/ben_green.webp'
import estelleCuttazImg from '@/assets/images/team/optimized/estelle_cuttaz.webp'
import joeGodingImg from '@/assets/images/team/optimized/josef_goding.webp'
import oliviaCauviImg from '@/assets/images/team/optimized/olivia_cauvi.webp'
import duyAnTranImg from '@/assets/images/team/optimized/duy_an_tran.webp'
import alexeyNovikovImg from '@/assets/images/team/optimized/alexey_novikov.webp'
import efeSenImg from '@/assets/images/team/optimized/efe_sen.webp'
import robertTothImg from '@/assets/images/team/optimized/robert_toth.webp'

// =============================================================================
// TODO: REPLACE ALL PLACEHOLDER CONTENT WITH REAL TEAM DATA
// =============================================================================
// Each team member needs:
// - shortBio: 1-2 sentence professional summary
// - fullBio: Detailed biography (2-3 paragraphs)
// - education: Array of degrees/certifications (e.g., "PhD Biomedical Engineering, Imperial College London, 2018")
// - achievements: Array of notable accomplishments (3-5 items)
// - publications: Array of key publications (for research staff)
// - scholar/linkedin: Update with real profile URLs
// =============================================================================

/**
 * Initial team members data.
 * 
 * Note: Placeholder content should be replaced with actual team information.
 * Team members are organized by category (founders, research-innovation, product-engineering, etc.)
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'rylie-green',
    name: 'Prof Rylie Green',
    title: 'Co-Founder & Chief Scientific Officer',
    role: 'CSO',
    category: 'founders',
    imageUrl: rylieGreenImg,
    shortBio: '[Short bio placeholder]', // TODO: Add real bio - CSO background and expertise
    fullBio: '[Full bio placeholder]', // TODO: Add detailed biography
    education: ['[Education placeholder]'], // TODO: Add education history
    achievements: ['[Achievement placeholder]'], // TODO: Add key achievements
    publications: ['[Publication placeholder]'], // TODO: Add publication list
    scholar: 'https://scholar.google.com', // TODO: Update with real Google Scholar URL
    linkedin: 'https://linkedin.com' // TODO: Update with real LinkedIn URL
  },
  {
    id: 'ben-green',
    name: 'Ben Green',
    title: 'Co-Founder & Managing Director',
    role: 'Managing Director',
    category: 'founders',
    imageUrl: benGreenImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'alexey-novikov',
    name: 'Dr Alexey Novikov',
    title: 'Design Engineer',
    role: 'Design Engineer',
    category: 'research-innovation',
    imageUrl: alexeyNovikovImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'estelle-cuttaz',
    name: 'Dr Estelle Cuttaz',
    title: 'Senior Design Engineer',
    role: 'Senior Design Engineer',
    category: 'product-engineering',
    imageUrl: estelleCuttazImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    scholar: 'https://scholar.google.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'joe-goding',
    name: 'Dr Joe Goding',
    title: 'Head of R&D',
    role: 'Head of R&D',
    category: 'research-innovation',
    imageUrl: joeGodingImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    scholar: 'https://scholar.google.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'olivia-cauvi',
    name: 'Olivia Cauvi',
    title: 'Project Manager',
    role: 'Project Manager',
    category: 'management',
    imageUrl: oliviaCauviImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'robert-toth',
    name: 'Dr Robert Toth',
    title: 'Senior Electrical Engineer',
    role: 'Senior Electrical Engineer',
    category: 'product-engineering',
    imageUrl: robertTothImg,
    imagePosition: 'center 65%',
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    scholar: 'https://scholar.google.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'efe-sen',
    name: 'Efe Sen',
    title: 'Research Engineer',
    role: 'Research Engineer',
    category: 'product-engineering',
    imageUrl: efeSenImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'duy-an-tran',
    name: 'Duy An Tran',
    title: 'Software Engineer',
    role: 'Software Engineer',
    category: 'product-engineering',
    imageUrl: duyAnTranImg,
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  }
]
