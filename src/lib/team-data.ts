/**
 * Team Data
 * 
 * Seed data for team member profiles.
 * This data is used to initialize the KV store on first load.
 * 
 * @module lib/team-data
 */

import type { TeamMember } from './types'

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
 * Team members are organized by category (founders, lab-management, etc.)
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'rylie-green',
    name: 'Prof Rylie Green',
    title: 'Chief Scientific Officer',
    role: 'CSO',
    category: 'founders',
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
    title: 'Managing Director',
    role: 'Managing Director',
    category: 'founders',
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'alexey-nonikov',
    name: 'Dr Alexey Nonikov',
    title: 'Design Engineer',
    role: 'Laboratory Management Team',
    category: 'lab-management',
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
    title: 'Design Engineer',
    role: 'Laboratory Management Team',
    category: 'lab-management',
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
    role: 'Laboratory Management Team',
    category: 'lab-management',
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
    role: 'Research/Engineering Team',
    category: 'research-engineering',
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
    role: 'Research/Engineering Team',
    category: 'research-engineering',
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
    role: 'Research/Engineering Team',
    category: 'research-engineering',
    shortBio: '[Short bio placeholder]',
    fullBio: '[Full bio placeholder]',
    education: ['[Education placeholder]'],
    achievements: ['[Achievement placeholder]'],
    publications: ['[Publication placeholder]'],
    linkedin: 'https://linkedin.com'
  }
]
