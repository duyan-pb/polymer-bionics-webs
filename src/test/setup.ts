import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

// Mock document.cookie
let cookieStore: Record<string, string> = {}
Object.defineProperty(document, 'cookie', {
  get: vi.fn(() => {
    return Object.entries(cookieStore)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  }),
  set: vi.fn((value: string) => {
    const [cookiePart] = value.split(';')
    const [key, val] = cookiePart.split('=')
    if (val === '' || value.includes('max-age=0')) {
      delete cookieStore[key]
    } else {
      cookieStore[key] = val
    }
  }),
})

// Mock window.location
const mockLocation = {
  href: 'https://polymerbionics.com/products',
  pathname: '/products',
  search: '',
  hash: '',
  origin: 'https://polymerbionics.com',
  protocol: 'https:',
  host: 'polymerbionics.com',
  hostname: 'polymerbionics.com',
  port: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

// Mock navigator
Object.defineProperty(navigator, 'sendBeacon', {
  value: vi.fn(() => true),
  writable: true,
})

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    getEntriesByType: vi.fn(() => []),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  },
  writable: true,
})

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
  } as Response)
)

// Mock crypto.randomUUID
Object.defineProperty(crypto, 'randomUUID', {
  value: vi.fn(() => '12345678-1234-1234-1234-123456789012'),
})

// Mock PerformanceObserver
class MockPerformanceObserver {
  callback: PerformanceObserverCallback
  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback
  }
  observe = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

Object.defineProperty(window, 'PerformanceObserver', {
  value: MockPerformanceObserver,
  writable: true,
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
  cookieStore = {}
  mockLocation.search = ''
  mockLocation.pathname = '/products'
  mockLocation.href = 'https://polymerbionics.com/products'
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Export mocks for use in tests
export {
  localStorageMock,
  sessionStorageMock,
  cookieStore,
  mockLocation,
}
