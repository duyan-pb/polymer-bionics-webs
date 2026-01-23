/**
 * Global Search Component
 * 
 * Command palette for quick navigation and content search.
 * Activated via Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 * 
 * @module components/GlobalSearch
 */

import { useEffect } from 'react'
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command'
import type { TeamMember, Product, Datasheet, NewsItem } from '@/lib/types'
import { SearchResultsGroup } from '@/components/search/SearchResultsGroup'
import { SearchBrowseGroup } from '@/components/search/SearchBrowseGroup'
import { useGlobalSearchData } from '@/hooks/use-global-search'

/**
 * Props for the GlobalSearch component.
 */
interface GlobalSearchProps {
  /** Whether the search dialog is open */
  open: boolean
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void
  /** Navigation handler for selected items */
  onNavigate: (page: string) => void
  /** Products to include in search */
  products: Product[]
  /** Team members to include in search */
  team: TeamMember[]
  /** Datasheets to include in search */
  datasheets: Datasheet[]
  /** News items to include in search */
  news: NewsItem[]
}

/**
 * Global search command palette.
 * 
 * Features:
 * - Keyboard shortcut activation (Cmd/Ctrl+K)
 * - Fuzzy search across all content types
 * - Grouped results by type (navigation, products, team, etc.)
 * - Keyboard navigation with arrow keys
 * 
 * @example
 * ```tsx
 * <GlobalSearch
 *   open={searchOpen}
 *   onOpenChange={setSearchOpen}
 *   onNavigate={handleNavigate}
 *   products={products}
 *   team={team}
 *   datasheets={datasheets}
 *   news={news}
 * />
 * ```
 */
export function GlobalSearch({ open, onOpenChange, onNavigate, products, team, datasheets, news }: GlobalSearchProps) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [open, onOpenChange])

  const handleSelect = (page: string) => {
    onNavigate(page)
    onOpenChange(false)
  }

  const {
    searchQuery,
    setSearchQuery,
    hasQuery,
    resultsGroupItems,
    browseGroups,
  } = useGlobalSearchData({
    onSelect: handleSelect,
    products,
    team,
    datasheets,
    news,
  })

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Search content">
      <CommandInput
        placeholder="Search pages, products, team, datasheets"
        autoFocus
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {hasQuery ? (
          <SearchResultsGroup heading="Results" items={resultsGroupItems} />
        ) : (
          <>
            {browseGroups.map((group) => (
              <SearchBrowseGroup key={group.heading} heading={group.heading} items={group.items} />
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
