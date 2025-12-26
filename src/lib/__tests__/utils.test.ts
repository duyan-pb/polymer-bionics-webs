/**
 * Utils Tests
 */

import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles undefined values', () => {
    const result = cn('class1', undefined, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles null values', () => {
    const result = cn('class1', null, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles false values', () => {
    const result = cn('class1', false, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    const result = cn('base', isActive && 'active', isDisabled && 'disabled')
    expect(result).toBe('base active')
  })

  it('merges conflicting Tailwind classes correctly', () => {
    // twMerge should keep the last conflicting class
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('handles object syntax', () => {
    const result = cn({ 'class1': true, 'class2': false, 'class3': true })
    expect(result).toBe('class1 class3')
  })

  it('handles array syntax', () => {
    const result = cn(['class1', 'class2'])
    expect(result).toBe('class1 class2')
  })

  it('handles empty string', () => {
    const result = cn('')
    expect(result).toBe('')
  })

  it('handles no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles mixed Tailwind utilities', () => {
    const result = cn('bg-red-500', 'text-white', 'p-4', 'hover:bg-red-600')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
    expect(result).toContain('p-4')
    expect(result).toContain('hover:bg-red-600')
  })

  it('handles duplicate classes (clsx behavior)', () => {
    const result = cn('class1', 'class1')
    // clsx doesn't deduplicate, it just concatenates
    expect(result).toContain('class1')
  })
})
