/**
 * media-data.ts Tests
 */

import { describe, it, expect } from 'vitest'
import { placeholderVideos, placeholderCaseStudies, placeholderDatasheets } from '../media-data'

describe('media-data', () => {
  describe('placeholderVideos array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(placeholderVideos)).toBe(true)
      expect(placeholderVideos.length).toBeGreaterThan(0)
    })

    it('all videos have required fields', () => {
      placeholderVideos.forEach(video => {
        expect(video).toHaveProperty('id')
        expect(video).toHaveProperty('title')
        expect(video).toHaveProperty('description')
        expect(video).toHaveProperty('videoUrl')
        expect(video).toHaveProperty('category')
        
        expect(typeof video.id).toBe('string')
        expect(typeof video.title).toBe('string')
        expect(typeof video.description).toBe('string')
        expect(typeof video.videoUrl).toBe('string')
        expect(typeof video.category).toBe('string')
      })
    })

    it('all videos have unique IDs', () => {
      const ids = placeholderVideos.map(v => v.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all videos have non-empty titles', () => {
      placeholderVideos.forEach(video => {
        expect(video.title.trim().length).toBeGreaterThan(0)
      })
    })

    it('video URLs are valid HTTP URLs', () => {
      placeholderVideos.forEach(video => {
        expect(video.videoUrl.startsWith('http')).toBe(true)
      })
    })

    it('optional fields are correct types when present', () => {
      placeholderVideos.forEach(video => {
        if (video.thumbnailUrl !== undefined) {
          expect(typeof video.thumbnailUrl).toBe('string')
        }
        if (video.duration !== undefined) {
          expect(typeof video.duration).toBe('string')
        }
      })
    })
  })

  describe('placeholderCaseStudies array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(placeholderCaseStudies)).toBe(true)
      expect(placeholderCaseStudies.length).toBeGreaterThan(0)
    })

    it('all case studies have required fields', () => {
      placeholderCaseStudies.forEach(study => {
        expect(study).toHaveProperty('id')
        expect(study).toHaveProperty('title')
        expect(study).toHaveProperty('description')
        expect(study).toHaveProperty('problem')
        expect(study).toHaveProperty('solution')
        expect(study).toHaveProperty('results')
        expect(study).toHaveProperty('category')
        
        expect(typeof study.id).toBe('string')
        expect(typeof study.title).toBe('string')
        expect(typeof study.description).toBe('string')
        expect(typeof study.problem).toBe('string')
        expect(typeof study.solution).toBe('string')
        expect(typeof study.results).toBe('string')
        expect(typeof study.category).toBe('string')
      })
    })

    it('all case studies have unique IDs', () => {
      const ids = placeholderCaseStudies.map(s => s.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all case studies have non-empty titles', () => {
      placeholderCaseStudies.forEach(study => {
        expect(study.title.trim().length).toBeGreaterThan(0)
      })
    })

    it('optional fields are correct types when present', () => {
      placeholderCaseStudies.forEach(study => {
        if (study.pdfUrl !== undefined) {
          expect(typeof study.pdfUrl).toBe('string')
        }
        if (study.publishedDate !== undefined) {
          expect(typeof study.publishedDate).toBe('string')
        }
        if (study.datasheetId !== undefined) {
          expect(typeof study.datasheetId).toBe('string')
        }
      })
    })
  })

  describe('placeholderDatasheets array', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(placeholderDatasheets)).toBe(true)
      expect(placeholderDatasheets.length).toBeGreaterThan(0)
    })

    it('all datasheets have required fields', () => {
      placeholderDatasheets.forEach(sheet => {
        expect(sheet).toHaveProperty('id')
        expect(sheet).toHaveProperty('name')
        expect(sheet).toHaveProperty('title')
        expect(sheet).toHaveProperty('description')
        expect(sheet).toHaveProperty('category')
        
        expect(typeof sheet.id).toBe('string')
        expect(typeof sheet.name).toBe('string')
        expect(typeof sheet.title).toBe('string')
        expect(typeof sheet.description).toBe('string')
        expect(typeof sheet.category).toBe('string')
      })
    })

    it('all datasheets have unique IDs', () => {
      const ids = placeholderDatasheets.map(d => d.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all datasheets have non-empty names', () => {
      placeholderDatasheets.forEach(sheet => {
        expect(sheet.name.trim().length).toBeGreaterThan(0)
      })
    })

    it('optional fields are correct types when present', () => {
      placeholderDatasheets.forEach(sheet => {
        if (sheet.version !== undefined) {
          expect(typeof sheet.version).toBe('string')
        }
        if (sheet.lastUpdated !== undefined) {
          expect(typeof sheet.lastUpdated).toBe('string')
        }
        if (sheet.pdfUrl !== undefined) {
          expect(typeof sheet.pdfUrl).toBe('string')
        }
        if (sheet.technicalSpecs !== undefined) {
          expect(typeof sheet.technicalSpecs).toBe('object')
        }
      })
    })

    it('technical specs have valid key-value pairs', () => {
      placeholderDatasheets.forEach(sheet => {
        if (sheet.technicalSpecs) {
          Object.entries(sheet.technicalSpecs).forEach(([key, value]) => {
            expect(typeof key).toBe('string')
            expect(typeof value).toBe('string')
          })
        }
      })
    })
  })

  describe('cross-references', () => {
    it('case study datasheetIds reference existing datasheets', () => {
      const datasheetIds = placeholderDatasheets.map(d => d.id)
      
      placeholderCaseStudies.forEach(study => {
        if (study.datasheetId) {
          expect(datasheetIds).toContain(study.datasheetId)
        }
      })
    })
  })
})
