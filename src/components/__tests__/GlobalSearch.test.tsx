import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock the command dialog components
vi.mock('@/components/ui/command', () => ({
  CommandDialog: ({ 
    children, 
    open, 
    title 
  }: React.PropsWithChildren<{ open: boolean; title?: string }>) => 
    open ? <div role="dialog" aria-label={title}>{children}</div> : null,
  CommandEmpty: ({ children }: React.PropsWithChildren) => (
    <div data-testid="command-empty">{children}</div>
  ),
  CommandGroup: ({ 
    heading, 
    children 
  }: React.PropsWithChildren<{ heading?: string }>) => (
    <div data-testid="command-group" data-heading={heading}>{children}</div>
  ),
  CommandInput: ({ 
    placeholder, 
    value, 
    onValueChange 
  }: { placeholder?: string; value?: string; onValueChange?: (v: string) => void }) => (
    <input 
      placeholder={placeholder} 
      value={value} 
      onChange={(e) => onValueChange?.(e.target.value)}
      data-testid="command-input"
    />
  ),
  CommandItem: ({ 
    children, 
    onSelect 
  }: React.PropsWithChildren<{ onSelect?: () => void }>) => (
    <div data-testid="command-item" onClick={onSelect}>{children}</div>
  ),
  CommandList: ({ children }: React.PropsWithChildren) => (
    <div data-testid="command-list">{children}</div>
  ),
}))

// Mock fuse.js
vi.mock('fuse.js', () => {
  return {
    default: class MockFuse {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(_items: unknown[], _options?: unknown) {}
      search() {
        return []
      }
    },
  }
})

import { GlobalSearch } from '../GlobalSearch'

describe('GlobalSearch', () => {
  const mockOnNavigate = vi.fn()
  const mockOnOpenChange = vi.fn()
  
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onNavigate: mockOnNavigate,
    products: [{ id: '1', name: 'Test Product', category: 'Test' }],
    team: [{ id: '1', name: 'John Doe', role: 'Developer' }],
    datasheets: [{ id: '1', title: 'Test Sheet', category: 'Tech' }],
    news: [{ id: '1', title: 'News Article', category: 'Updates' }],
  } as React.ComponentProps<typeof GlobalSearch>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders when open is true', () => {
      render(<GlobalSearch {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not render when open is false', () => {
      render(<GlobalSearch {...defaultProps} open={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders search input', () => {
      render(<GlobalSearch {...defaultProps} />)
      expect(screen.getByTestId('command-input')).toBeInTheDocument()
    })

    it('renders command list', () => {
      render(<GlobalSearch {...defaultProps} />)
      expect(screen.getByTestId('command-list')).toBeInTheDocument()
    })
  })

  describe('search functionality', () => {
    it('updates search query on input', () => {
      render(<GlobalSearch {...defaultProps} />)
      const input = screen.getByTestId('command-input')
      fireEvent.change(input, { target: { value: 'test search' } })
      expect(input).toHaveValue('test search')
    })
  })

  describe('keyboard shortcuts', () => {
    it('toggles on Cmd+K', () => {
      render(<GlobalSearch {...defaultProps} open={false} />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      expect(mockOnOpenChange).toHaveBeenCalledWith(true)
    })

    it('toggles on Ctrl+K', () => {
      render(<GlobalSearch {...defaultProps} open={false} />)
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
      expect(mockOnOpenChange).toHaveBeenCalledWith(true)
    })

    it('closes when already open on Cmd+K', () => {
      render(<GlobalSearch {...defaultProps} open={true} />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('cleanup', () => {
    it('cleans up keyboard listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const { unmount } = render(<GlobalSearch {...defaultProps} />)
      unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  describe('with empty data', () => {
    it('handles empty products array', () => {
      render(<GlobalSearch {...defaultProps} products={[]} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('handles empty team array', () => {
      render(<GlobalSearch {...defaultProps} team={[]} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('handles all empty arrays', () => {
      render(
        <GlobalSearch 
          {...defaultProps} 
          products={[]} 
          team={[]} 
          datasheets={[]} 
          news={[]} 
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
