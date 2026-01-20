/**
 * useLocalKV Hook Tests
 *
 * Tests for the localStorage-based KV hook used for static deployments
 * when GitHub Spark's backend is unavailable (e.g., Netlify, Vercel).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalKV } from '../use-kv'

const KV_PREFIX = 'spark_kv_'

describe('useLocalKV', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('returns initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalKV('test-key', 'default'))
      expect(result.current[0]).toBe('default')
    })

    it('returns initial value for arrays', () => {
      const initialArray = [{ id: 1, name: 'Item 1' }]
      const { result } = renderHook(() => useLocalKV('items', initialArray))
      expect(result.current[0]).toEqual(initialArray)
    })

    it('returns initial value for objects', () => {
      const initialObject = { theme: 'dark', locale: 'en' }
      const { result } = renderHook(() => useLocalKV('settings', initialObject))
      expect(result.current[0]).toEqual(initialObject)
    })

    it('reads stored value from localStorage', () => {
      const storedValue = { name: 'Test', value: 42 }
      localStorage.setItem(`${KV_PREFIX}existing`, JSON.stringify(storedValue))

      const { result } = renderHook(() => useLocalKV('existing', { name: '', value: 0 }))
      expect(result.current[0]).toEqual(storedValue)
    })

    it('handles invalid JSON in localStorage gracefully', () => {
      localStorage.setItem(`${KV_PREFIX}invalid`, 'not-valid-json{{{')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() => useLocalKV('invalid', 'fallback'))
      expect(result.current[0]).toBe('fallback')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('setValue', () => {
    it('updates the value in state', () => {
      const { result } = renderHook(() => useLocalKV('counter', 0))

      act(() => {
        result.current[1](5)
      })

      expect(result.current[0]).toBe(5)
    })

    it('persists the value to localStorage', () => {
      const { result } = renderHook(() => useLocalKV('persisted', 'initial'))

      act(() => {
        result.current[1]('updated')
      })

      const stored = localStorage.getItem(`${KV_PREFIX}persisted`)
      expect(stored).toBe(JSON.stringify('updated'))
    })

    it('handles complex objects', () => {
      interface TestData {
        items: Array<{ id: number; name: string }>
        metadata: { count: number }
      }
      const initial: TestData = { items: [], metadata: { count: 0 } }
      const { result } = renderHook(() => useLocalKV<TestData>('complex', initial))

      const newValue: TestData = {
        items: [{ id: 1, name: 'Item 1' }],
        metadata: { count: 1 }
      }

      act(() => {
        result.current[1](newValue)
      })

      expect(result.current[0]).toEqual(newValue)
      const stored = JSON.parse(localStorage.getItem(`${KV_PREFIX}complex`) || '{}')
      expect(stored).toEqual(newValue)
    })

    it('handles null values', () => {
      const { result } = renderHook(() => useLocalKV<string | null>('nullable', 'initial'))

      act(() => {
        result.current[1](null)
      })

      expect(result.current[0]).toBeNull()
    })

    it('handles array updates', () => {
      const { result } = renderHook(() => useLocalKV<string[]>('list', []))

      act(() => {
        result.current[1](['a', 'b', 'c'])
      })

      expect(result.current[0]).toEqual(['a', 'b', 'c'])
    })
  })

  describe('cross-tab synchronization', () => {
    it('updates value when storage event fires for the same key', async () => {
      const { result } = renderHook(() => useLocalKV('sync-test', 'initial'))

      // Simulate another tab updating the value
      const newValue = 'updated-from-other-tab'
      localStorage.setItem(`${KV_PREFIX}sync-test`, JSON.stringify(newValue))

      // Dispatch storage event as if from another tab
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: `${KV_PREFIX}sync-test`,
          newValue: JSON.stringify(newValue),
          storageArea: localStorage
        }))
      })

      await waitFor(() => {
        expect(result.current[0]).toBe(newValue)
      })
    })

    it('ignores storage events for different keys', async () => {
      const { result } = renderHook(() => useLocalKV('my-key', 'original'))

      act(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: `${KV_PREFIX}other-key`,
          newValue: JSON.stringify('different'),
          storageArea: localStorage
        }))
      })

      // Value should remain unchanged
      expect(result.current[0]).toBe('original')
    })

    it('ignores null newValue in storage event (key removed in other tab)', async () => {
      // The hook intentionally ignores key removal to prevent data loss
      // when another tab clears storage unexpectedly
      localStorage.setItem(`${KV_PREFIX}removable`, JSON.stringify('existing'))
      const { result } = renderHook(() => useLocalKV('removable', 'default'))

      expect(result.current[0]).toBe('existing')

      // Simulate key removal from another tab
      act(() => {
        localStorage.removeItem(`${KV_PREFIX}removable`)
        window.dispatchEvent(new StorageEvent('storage', {
          key: `${KV_PREFIX}removable`,
          newValue: null,
          storageArea: localStorage
        }))
      })

      // Value should remain unchanged (hook ignores null to prevent data loss)
      expect(result.current[0]).toBe('existing')
    })
  })

  describe('key prefixing', () => {
    it('prefixes keys with spark_kv_', () => {
      const { result } = renderHook(() => useLocalKV('prefixed', 'value'))

      act(() => {
        result.current[1]('new-value')
      })

      expect(localStorage.getItem('spark_kv_prefixed')).toBe(JSON.stringify('new-value'))
      expect(localStorage.getItem('prefixed')).toBeNull()
    })

    it('does not conflict with non-prefixed keys', () => {
      localStorage.setItem('shared-key', 'external-value')
      const { result } = renderHook(() => useLocalKV('shared-key', 'internal'))

      expect(result.current[0]).toBe('internal')
      expect(localStorage.getItem('shared-key')).toBe('external-value')
    })
  })

  describe('multiple hooks with same key', () => {
    it('returns same initial value for multiple hooks', () => {
      const { result: result1 } = renderHook(() => useLocalKV('shared', 'default'))
      const { result: result2 } = renderHook(() => useLocalKV('shared', 'default'))

      expect(result1.current[0]).toBe('default')
      expect(result2.current[0]).toBe('default')
    })

    it('reads same stored value for multiple hooks', () => {
      localStorage.setItem(`${KV_PREFIX}shared`, JSON.stringify('stored'))

      const { result: result1 } = renderHook(() => useLocalKV('shared', 'default'))
      const { result: result2 } = renderHook(() => useLocalKV('shared', 'default'))

      expect(result1.current[0]).toBe('stored')
      expect(result2.current[0]).toBe('stored')
    })
  })

  describe('type safety', () => {
    it('preserves type for primitives', () => {
      const { result: strResult } = renderHook(() => useLocalKV('str', 'hello'))
      const { result: numResult } = renderHook(() => useLocalKV('num', 42))
      const { result: boolResult } = renderHook(() => useLocalKV('bool', true))

      expect(typeof strResult.current[0]).toBe('string')
      expect(typeof numResult.current[0]).toBe('number')
      expect(typeof boolResult.current[0]).toBe('boolean')
    })

    it('preserves array types', () => {
      const initial: number[] = [1, 2, 3]
      const { result } = renderHook(() => useLocalKV('nums', initial))

      expect(Array.isArray(result.current[0])).toBe(true)
      expect(result.current[0]).toEqual([1, 2, 3])
    })
  })

  describe('edge cases', () => {
    it('handles empty string key', () => {
      const { result } = renderHook(() => useLocalKV('', 'empty-key'))
      expect(result.current[0]).toBe('empty-key')
    })

    it('handles special characters in key', () => {
      const { result } = renderHook(() => useLocalKV('key:with/special.chars', 'value'))
      
      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
    })

    it('handles undefined stored as JSON', () => {
      // Note: JSON.stringify(undefined) returns undefined, not 'undefined'
      // This tests the edge case handling
      const { result } = renderHook(() => useLocalKV<string | undefined>('undef', undefined))
      expect(result.current[0]).toBeUndefined()
    })

    it('handles large data', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: 'A'.repeat(100)
      }))

      const { result } = renderHook(() => useLocalKV('large', largeArray))
      expect(result.current[0]).toHaveLength(1000)
    })
  })
})

// Export for type-checking the useKV alias
describe('useKV alias', () => {
  it('exports useLocalKV as useKV', async () => {
    const module = await import('../use-kv')
    expect(module.useKV).toBeDefined()
    expect(module.useKV).toBe(module.useLocalKV)
  })
})
