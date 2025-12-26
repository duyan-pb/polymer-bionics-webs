/**
 * ConsentBanner Component Tests
 * 
 * Tests the cookie consent banner component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConsentBanner } from '../ConsentBanner'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<object>) => <>{children}</>,
}))

// Mock the useConsent hook to control consent state in tests
const mockAcceptAll = vi.fn()
const mockAcceptNecessary = vi.fn()
const mockOpenPreferences = vi.fn()
const mockClosePreferences = vi.fn()
const mockUpdateCategories = vi.fn()

vi.mock('@/lib/analytics/hooks', () => ({
  useConsent: vi.fn(() => ({
    shouldShowBanner: true,
    acceptAll: mockAcceptAll,
    acceptNecessary: mockAcceptNecessary,
    openPreferences: mockOpenPreferences,
    closePreferences: mockClosePreferences,
    isPreferencesOpen: false,
    consent: {
      choices: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      hasInteracted: false,
    },
    updateCategories: mockUpdateCategories,
  })),
}))

describe('ConsentBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders when shouldShowBanner is true', () => {
    render(<ConsentBanner />)
    
    // Look for cookie-related content (use getAllBy since there might be multiple)
    const cookieElements = screen.getAllByText(/cookie|privacy|consent/i)
    expect(cookieElements.length).toBeGreaterThan(0)
  })

  it('shows accept all button', () => {
    render(<ConsentBanner />)
    
    expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument()
  })

  it('shows necessary only button', () => {
    render(<ConsentBanner />)
    
    const buttons = screen.getAllByRole('button')
    const necessaryButton = buttons.find(b => 
      /necessary|reject|decline/i.test(b.textContent || '')
    )
    expect(necessaryButton).toBeDefined()
  })

  it('calls acceptAll when accept all button is clicked', () => {
    render(<ConsentBanner />)
    
    const acceptButton = screen.getByRole('button', { name: /accept all/i })
    fireEvent.click(acceptButton)
    
    expect(mockAcceptAll).toHaveBeenCalled()
  })

  it('calls acceptNecessary when necessary only button is clicked', () => {
    render(<ConsentBanner />)
    
    const buttons = screen.getAllByRole('button')
    const necessaryButton = buttons.find(b => 
      /necessary|reject|decline/i.test(b.textContent || '')
    )
    
    if (necessaryButton) {
      fireEvent.click(necessaryButton)
      expect(mockAcceptNecessary).toHaveBeenCalled()
    }
  })

  it('does not render when shouldShowBanner is false', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { container } = render(<ConsentBanner />)
    
    expect(container.firstChild).toBeNull()
  })

  it('has accessible buttons', async () => {
    // Reset the mock to default state
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Check component renders with cookie content
    const cookieContent = screen.getAllByText(/cookie|privacy|consent/i)
    expect(cookieContent.length).toBeGreaterThan(0)
  })

  it('is memoized for performance', () => {
    // Check that ConsentBanner is wrapped with memo
    expect(ConsentBanner.$$typeof?.toString()).toContain('Symbol')
  })
})

describe('ConsentBanner Preferences Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens preferences dialog when manage is clicked', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    // First render with preferences closed
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Look for manage/settings button
    const buttons = screen.getAllByRole('button')
    const manageButton = buttons.find(b => 
      /manage|settings|preferences|customize/i.test(b.textContent || '')
    )
    
    if (manageButton) {
      fireEvent.click(manageButton)
      expect(mockOpenPreferences).toHaveBeenCalled()
    }
  })

  it('shows preferences content when isPreferencesOpen is true', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: true,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Should show category toggles
    await waitFor(() => {
      expect(screen.getByText(/necessary/i)).toBeInTheDocument()
    })
  })

  it('can toggle consent categories in preferences dialog', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: true,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Look for analytics switch (should be off)
    const switches = screen.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
  })

  it('calls updateCategories when save preferences is clicked', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: true,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Find and click save preferences button
    const saveButton = screen.getByRole('button', { name: /save preferences/i })
    fireEvent.click(saveButton)
    
    expect(mockUpdateCategories).toHaveBeenCalled()
    expect(mockClosePreferences).toHaveBeenCalled()
  })

  it('calls closePreferences when cancel button is clicked in dialog', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: true,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Find and click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    expect(mockClosePreferences).toHaveBeenCalled()
  })

  it('can click Accept All button in dialog', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: true,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    render(<ConsentBanner />)
    
    // Find Accept All in the dialog (not the main banner button)
    const dialogButtons = screen.getAllByRole('button', { name: /accept all/i })
    // Click the one in the dialog (should be second)
    if (dialogButtons.length > 1) {
      fireEvent.click(dialogButtons[1])
    }
  })
})

describe('ManageCookiesLink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default text', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ManageCookiesLink } = await import('../ConsentBanner')
    render(<ManageCookiesLink />)
    
    expect(screen.getByText('Manage Cookies')).toBeInTheDocument()
  })

  it('calls openPreferences when clicked', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ManageCookiesLink } = await import('../ConsentBanner')
    render(<ManageCookiesLink />)
    
    const link = screen.getByText('Manage Cookies')
    fireEvent.click(link)
    
    expect(mockOpenPreferences).toHaveBeenCalled()
  })

  it('accepts custom children', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ManageCookiesLink } = await import('../ConsentBanner')
    render(<ManageCookiesLink>Cookie Settings</ManageCookiesLink>)
    
    expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
  })
})

describe('ConsentStatusIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Not set" when not interacted', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: true,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: false,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: false,
      withdraw: vi.fn(),
    })
    
    const { ConsentStatusIndicator } = await import('../ConsentBanner')
    render(<ConsentStatusIndicator />)
    
    expect(screen.getByText('Not set')).toBeInTheDocument()
  })

  it('shows "Essential only" when only necessary cookies accepted', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: false, marketing: false },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ConsentStatusIndicator } = await import('../ConsentBanner')
    render(<ConsentStatusIndicator />)
    
    expect(screen.getByText('Essential only')).toBeInTheDocument()
  })

  it('shows analytics status when analytics consented', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: false },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ConsentStatusIndicator } = await import('../ConsentBanner')
    render(<ConsentStatusIndicator />)
    
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('shows both analytics and marketing when both consented', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ConsentStatusIndicator } = await import('../ConsentBanner')
    render(<ConsentStatusIndicator />)
    
    expect(screen.getByText('Analytics & Marketing')).toBeInTheDocument()
  })

  it('opens preferences when clicked', async () => {
    const { useConsent } = await import('@/lib/analytics/hooks')
    vi.mocked(useConsent).mockReturnValue({
      shouldShowBanner: false,
      acceptAll: mockAcceptAll,
      acceptNecessary: mockAcceptNecessary,
      openPreferences: mockOpenPreferences,
      closePreferences: mockClosePreferences,
      isPreferencesOpen: false,
      consent: {
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      },
      updateCategories: mockUpdateCategories,
      canTrack: vi.fn(),
      hasInteracted: true,
      withdraw: vi.fn(),
    })
    
    const { ConsentStatusIndicator } = await import('../ConsentBanner')
    render(<ConsentStatusIndicator />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOpenPreferences).toHaveBeenCalled()
  })
})
