/**
 * Constants Tests
 */

import { describe, it, expect } from 'vitest'
import {
  NAV_ITEMS,
  TEAM_CATEGORIES,
  PAGE_TRANSITION,
  CARD_HOVER_CLASSES,
  HERO_SECTION_CLASSES,
  CONTENT_SECTION_CLASSES,
  CONTENT_MAX_WIDTH,
} from '../constants'

describe('NAV_ITEMS', () => {
  it('is defined and is an array', () => {
    expect(NAV_ITEMS).toBeDefined()
    expect(Array.isArray(NAV_ITEMS)).toBe(true)
  })

  it('contains home as the first item', () => {
    expect(NAV_ITEMS[0]?.id).toBe('home')
  })

  it('each item has id and label', () => {
    NAV_ITEMS.forEach(item => {
      expect(item.id).toBeDefined()
      expect(typeof item.id).toBe('string')
      expect(item.label).toBeDefined()
      expect(typeof item.label).toBe('string')
    })
  })

  it('contains expected navigation pages', () => {
    const ids = NAV_ITEMS.map(item => item.id)
    expect(ids).toContain('home')
    expect(ids).toContain('team')
    expect(ids).toContain('contact')
  })

  it('each item has a description', () => {
    NAV_ITEMS.forEach(item => {
      expect(item.description).toBeDefined()
      expect(typeof item.description).toBe('string')
    })
  })
})

describe('TEAM_CATEGORIES', () => {
  it('is defined and is an object', () => {
    expect(TEAM_CATEGORIES).toBeDefined()
    expect(typeof TEAM_CATEGORIES).toBe('object')
  })

  it('contains founders category', () => {
    expect(TEAM_CATEGORIES.founders).toBe('Founders')
  })

  it('contains management category', () => {
    expect(TEAM_CATEGORIES.management).toBe('Project Management Team')
  })

  it('contains advisory category', () => {
    expect(TEAM_CATEGORIES.advisory).toBe('Scientific Advisory Board')
  })

  it('all values are non-empty strings', () => {
    Object.values(TEAM_CATEGORIES).forEach(value => {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    })
  })
})

describe('PAGE_TRANSITION', () => {
  it('is defined and is an object', () => {
    expect(PAGE_TRANSITION).toBeDefined()
    expect(typeof PAGE_TRANSITION).toBe('object')
  })

  it('has initial animation state', () => {
    expect(PAGE_TRANSITION.initial).toBeDefined()
    expect(PAGE_TRANSITION.initial.opacity).toBe(0)
    expect(typeof PAGE_TRANSITION.initial.y).toBe('number')
  })

  it('has animate state', () => {
    expect(PAGE_TRANSITION.animate).toBeDefined()
    expect(PAGE_TRANSITION.animate.opacity).toBe(1)
    expect(PAGE_TRANSITION.animate.y).toBe(0)
  })

  it('has exit animation state', () => {
    expect(PAGE_TRANSITION.exit).toBeDefined()
    expect(PAGE_TRANSITION.exit.opacity).toBe(0)
  })

  it('has transition config', () => {
    expect(PAGE_TRANSITION.transition).toBeDefined()
    expect(typeof PAGE_TRANSITION.transition.duration).toBe('number')
    expect(PAGE_TRANSITION.transition.ease).toBeDefined()
  })
})

describe('CSS Class Constants', () => {
  describe('CARD_HOVER_CLASSES', () => {
    it('is defined and contains hover styles', () => {
      expect(CARD_HOVER_CLASSES).toBeDefined()
      expect(typeof CARD_HOVER_CLASSES).toBe('string')
      expect(CARD_HOVER_CLASSES).toContain('hover:')
    })

    it('contains transition styles', () => {
      expect(CARD_HOVER_CLASSES).toContain('transition')
    })
  })

  describe('HERO_SECTION_CLASSES', () => {
    it('is defined and contains background class', () => {
      expect(HERO_SECTION_CLASSES).toBeDefined()
      expect(typeof HERO_SECTION_CLASSES).toBe('string')
      expect(HERO_SECTION_CLASSES).toContain('bg-background')
    })
  })

  describe('CONTENT_SECTION_CLASSES', () => {
    it('is defined and contains padding', () => {
      expect(CONTENT_SECTION_CLASSES).toBeDefined()
      expect(typeof CONTENT_SECTION_CLASSES).toBe('string')
      expect(CONTENT_SECTION_CLASSES).toContain('py-')
    })
  })

  describe('CONTENT_MAX_WIDTH', () => {
    it('is defined and contains max-width', () => {
      expect(CONTENT_MAX_WIDTH).toBeDefined()
      expect(typeof CONTENT_MAX_WIDTH).toBe('string')
      expect(CONTENT_MAX_WIDTH).toContain('max-w-')
    })

    it('contains centering class', () => {
      expect(CONTENT_MAX_WIDTH).toContain('mx-auto')
    })
  })
})
