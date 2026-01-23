/**
 * team-data.ts Tests
 */

import { describe, it, expect } from 'vitest'
import { teamMembers } from '../team-data'
import type { TeamCategory } from '../constants'

describe('team-data', () => {
  describe('teamMembers array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(teamMembers)).toBe(true)
      expect(teamMembers.length).toBeGreaterThan(0)
    })

    it('all members have required fields', () => {
      teamMembers.forEach(member => {
        expect(member).toHaveProperty('id')
        expect(member).toHaveProperty('name')
        expect(member).toHaveProperty('title')
        expect(member).toHaveProperty('role')
        expect(member).toHaveProperty('category')
        expect(member).toHaveProperty('shortBio')
        
        expect(typeof member.id).toBe('string')
        expect(typeof member.name).toBe('string')
        expect(typeof member.title).toBe('string')
        expect(typeof member.role).toBe('string')
        expect(typeof member.category).toBe('string')
        expect(typeof member.shortBio).toBe('string')
      })
    })

    it('all members have unique IDs', () => {
      const ids = teamMembers.map(m => m.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all members have valid categories', () => {
      const validCategories: TeamCategory[] = [
        'founders',
        'management',
        'lab-management',
        'research-engineering',
        'research',
        'engineering',
        'advisory',
      ]
      
      teamMembers.forEach(member => {
        expect(validCategories).toContain(member.category)
      })
    })

    it('includes founders category', () => {
      const founders = teamMembers.filter(m => m.category === 'founders')
      
      expect(founders.length).toBeGreaterThan(0)
    })

    it('members have non-empty names', () => {
      teamMembers.forEach(member => {
        expect(member.name.trim().length).toBeGreaterThan(0)
      })
    })

    it('members have non-empty titles', () => {
      teamMembers.forEach(member => {
        expect(member.title.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('member data structure', () => {
    it('optional fields are correct types when present', () => {
      teamMembers.forEach(member => {
        if (member.fullBio !== undefined) {
          expect(typeof member.fullBio).toBe('string')
        }
        if (member.education !== undefined) {
          expect(Array.isArray(member.education)).toBe(true)
        }
        if (member.achievements !== undefined) {
          expect(Array.isArray(member.achievements)).toBe(true)
        }
        if (member.publications !== undefined) {
          expect(Array.isArray(member.publications)).toBe(true)
        }
        if (member.linkedin !== undefined) {
          expect(typeof member.linkedin).toBe('string')
        }
        if (member.scholar !== undefined) {
          expect(typeof member.scholar).toBe('string')
        }
        if (member.imageUrl !== undefined) {
          expect(typeof member.imageUrl).toBe('string')
        }
      })
    })

    it('linkedin URLs start with https when present', () => {
      teamMembers.forEach(member => {
        if (member.linkedin) {
          expect(member.linkedin.startsWith('https://')).toBe(true)
        }
      })
    })

    it('scholar URLs start with https when present', () => {
      teamMembers.forEach(member => {
        if (member.scholar) {
          expect(member.scholar.startsWith('https://')).toBe(true)
        }
      })
    })
  })

  describe('specific team members', () => {
    it('includes Prof Rylie Green as founder', () => {
      const rylie = teamMembers.find(m => m.id === 'rylie-green')
      
      expect(rylie).toBeDefined()
      expect(rylie?.category).toBe('founders')
      expect(rylie?.name).toContain('Rylie Green')
    })

    it('includes Ben Green as founder with Managing Director title', () => {
      const ben = teamMembers.find(m => m.id === 'ben-green')
      
      expect(ben).toBeDefined()
      expect(ben?.category).toBe('founders')
      expect(ben?.name).toContain('Ben Green')
      expect(ben?.title).toContain('Managing Director')
    })

    it('includes Dr Alexey Nonikov in lab management', () => {
      const alexey = teamMembers.find(m => m.id === 'alexey-nonikov')
      
      expect(alexey).toBeDefined()
      expect(alexey?.category).toBe('lab-management')
      expect(alexey?.name).toContain('Dr')
      expect(alexey?.name).toContain('Alexey Nonikov')
    })
  })
})
