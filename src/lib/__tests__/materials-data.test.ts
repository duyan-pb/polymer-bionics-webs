/**
 * materials-data.ts Tests
 */

import { describe, it, expect } from 'vitest'
import { materials } from '../materials-data'

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

    it('includes FlexElec material', () => {
      const flexelec = materials.find(m => m.id === 'flexelec')
      
      expect(flexelec).toBeDefined()
      expect(flexelec?.name).toBe('FlexElec')
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
})
