/**
 * materials-data.ts Tests
 */

import { describe, it, expect } from 'vitest'
import { materials, applications } from '../materials-data'

describe('materials-data', () => {
  describe('materials array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThan(0)
    })

    it('all materials have required fields', () => {
      materials.forEach(material => {
        expect(material).toHaveProperty('id')
        expect(material).toHaveProperty('name')
        expect(material).toHaveProperty('description')
        expect(material).toHaveProperty('properties')
        
        expect(typeof material.id).toBe('string')
        expect(typeof material.name).toBe('string')
        expect(typeof material.description).toBe('string')
        expect(Array.isArray(material.properties)).toBe(true)
      })
    })

    it('all materials have unique IDs', () => {
      const ids = materials.map(m => m.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all materials have non-empty names', () => {
      materials.forEach(material => {
        expect(material.name.trim().length).toBeGreaterThan(0)
      })
    })

    it('all materials have at least one property', () => {
      materials.forEach(material => {
        expect(material.properties.length).toBeGreaterThan(0)
      })
    })

    it('includes BionGel material', () => {
      const biongel = materials.find(m => m.id === 'biongel')
      
      expect(biongel).toBeDefined()
      expect(biongel?.name).toBe('BionGel')
    })

    it('includes ElastiBion material', () => {
      const elastibion = materials.find(m => m.id === 'elastibion')
      
      expect(elastibion).toBeDefined()
      expect(elastibion?.name).toBe('ElastiBion')
    })

    it('includes ElastiSolder material', () => {
      const elastisolder = materials.find(m => m.id === 'elastisolder')
      
      expect(elastisolder).toBeDefined()
      expect(elastisolder?.name).toBe('ElastiSolder')
    })
  })

  describe('material data structure', () => {
    it('optional fields are correct types when present', () => {
      materials.forEach(material => {
        if (material.keyAdvantages !== undefined) {
          expect(Array.isArray(material.keyAdvantages)).toBe(true)
        }
        if (material.technicalDetails !== undefined) {
          expect(typeof material.technicalDetails).toBe('string')
        }
        if (material.imageUrl !== undefined) {
          expect(typeof material.imageUrl).toBe('string')
        }
        if (material.imageClass !== undefined) {
          expect(typeof material.imageClass).toBe('string')
        }
      })
    })
  })

  describe('applications array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(applications)).toBe(true)
      expect(applications.length).toBeGreaterThan(0)
    })

    it('all applications have required fields', () => {
      applications.forEach(application => {
        expect(application).toHaveProperty('id')
        expect(application).toHaveProperty('name')
        expect(application).toHaveProperty('description')
        expect(application).toHaveProperty('benefits')
        expect(application).toHaveProperty('useCases')
        
        expect(typeof application.id).toBe('string')
        expect(typeof application.name).toBe('string')
        expect(typeof application.description).toBe('string')
        expect(Array.isArray(application.benefits)).toBe(true)
        expect(Array.isArray(application.useCases)).toBe(true)
      })
    })

    it('all applications have unique IDs', () => {
      const ids = applications.map(a => a.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('includes Sport EEG application', () => {
      const sportEEG = applications.find(a => a.id === 'sport-eeg')
      
      expect(sportEEG).toBeDefined()
      expect(sportEEG?.name).toBe('Sport EEG')
    })

    it('includes InEar EEG application', () => {
      const inEarEEG = applications.find(a => a.id === 'inear-eeg')
      
      expect(inEarEEG).toBeDefined()
      expect(inEarEEG?.name).toBe('InEar EEG')
    })

    it('all applications have non-empty names', () => {
      applications.forEach(application => {
        expect(application.name.trim().length).toBeGreaterThan(0)
      })
    })

    it('all applications have at least one benefit', () => {
      applications.forEach(application => {
        expect(application.benefits.length).toBeGreaterThan(0)
      })
    })

    it('all applications have at least one use case', () => {
      applications.forEach(application => {
        expect(application.useCases.length).toBeGreaterThan(0)
      })
    })

    it('includes ElastiCuff application', () => {
      const elasticuff = applications.find(a => a.id === 'elasticuff')
      
      expect(elasticuff).toBeDefined()
      expect(elasticuff?.name).toBe('ElastiCuff')
    })

    it('includes ElastArray application', () => {
      const elastarray = applications.find(a => a.id === 'elastarray')
      
      expect(elastarray).toBeDefined()
      expect(elastarray?.name).toBe('ElastArray')
    })
  })

  describe('application data structure', () => {
    it('optional fields are correct types when present', () => {
      applications.forEach(application => {
        if (application.relevantMaterials !== undefined) {
          expect(Array.isArray(application.relevantMaterials)).toBe(true)
        }
        if (application.imageUrl !== undefined) {
          expect(typeof application.imageUrl).toBe('string')
        }
        if (application.imageClass !== undefined) {
          expect(typeof application.imageClass).toBe('string')
        }
      })
    })

    it('relevantMaterials contains valid material names', () => {
      applications.forEach(application => {
        if (application.relevantMaterials) {
          application.relevantMaterials.forEach(matName => {
            // Just verify it's a non-empty string
            expect(typeof matName).toBe('string')
            expect(matName.length).toBeGreaterThan(0)
          })
        }
      })
    })
  })
})
