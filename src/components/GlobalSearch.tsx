/**
 * Global Search Component
 * 
 * Command palette for quick navigation and content search.
 * Activated via Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 * 
 * @module components/GlobalSearch
 */

import { useEffect, useMemo, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Users, Package, FileText, Newspaper, ArrowRight } from '@phosphor-icons/react'
import Fuse from 'fuse.js'
import { NAV_ITEMS } from '@/lib/constants'
import type { TeamMember, Product, Datasheet, NewsItem } from '@/lib/types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum number of results to display per category */
const MAX_RESULTS_PER_CATEGORY = 8

/** Maximum total search results to show */
const MAX_SEARCH_RESULTS = 12

/** Fuse.js search threshold (lower = stricter matching) */
const SEARCH_THRESHOLD = 0.38

type SearchType = 'nav' | 'product' | 'team' | 'datasheet' | 'news'

/**
 * Search item structure for unified search.
 */
interface SearchItem {
  id: string
  label: string
  subtitle?: string
  page: string
  type: SearchType
}

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
  const [searchQuery, setSearchQuery] = useState('')

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

  const searchItems = useMemo((): SearchItem[] => {
    const navItems: SearchItem[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      subtitle: item.description,
      page: item.id,
      type: 'nav',
    }))

    const productItems: SearchItem[] = (products || []).map((p) => ({
      id: `product-${p.id}`,
      label: p.name,
      subtitle: p.category,
      page: 'products',
      type: 'product',
    }))

    const teamItems: SearchItem[] = (team || []).map((m) => ({
      id: `team-${m.id}`,
      label: m.name,
      subtitle: m.role,
      page: 'team',
      type: 'team',
    }))

    const datasheetItems: SearchItem[] = (datasheets || []).map((d) => ({
      id: `datasheet-${d.id}`,
      label: d.title,
      subtitle: d.category,
      page: 'datasheets',
      type: 'datasheet',
    }))

    const newsItems: SearchItem[] = (news || []).map((n) => ({
      id: `news-${n.id}`,
      label: n.title,
      subtitle: n.category,
      page: 'news',
      type: 'news',
    }))

    return [...navItems, ...productItems, ...teamItems, ...datasheetItems, ...newsItems]
  }, [datasheets, news, products, team])

  const fuse = useMemo(() => new Fuse(searchItems, {
    keys: [
      { name: 'label', weight: 0.6 },
      { name: 'subtitle', weight: 0.3 },
      { name: 'type', weight: 0.1 },
    ],
    threshold: SEARCH_THRESHOLD,
    ignoreLocation: true,
  }), [searchItems])

  const fuseResults = useMemo(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      return []
    }
    return fuse.search(trimmed).slice(0, MAX_SEARCH_RESULTS).map(result => result.item)
  }, [fuse, searchQuery])

  const hasQuery = searchQuery.trim().length > 0

  const handleSelect = (page: string) => {
    onNavigate(page)
    onOpenChange(false)
  }

  const renderIcon = (type: SearchType) => {
    switch (type) {
      case 'product':
        return <Package className="mr-2" size={16} weight="duotone" />
      case 'team':
        return <Users className="mr-2" size={16} weight="duotone" />
      case 'datasheet':
        return <FileText className="mr-2" size={16} weight="duotone" />
      case 'news':
        return <Newspaper className="mr-2" size={16} weight="duotone" />
      default:
        return <ArrowRight className="mr-2" size={16} weight="bold" />
    }
  }

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
          <CommandGroup heading="Results">
            {fuseResults.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item.page)}
              >
                {renderIcon(item.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.subtitle && (
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : (
          <>
            <CommandGroup heading="Navigate">
              {NAV_ITEMS.map((item) => (
                <CommandItem key={item.id} value={item.label} onSelect={() => handleSelect(item.id)}>
                  <ArrowRight className="mr-2" size={16} weight="bold" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Products">
              {(products || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((p) => (
                <CommandItem key={p.id} value={p.name} onSelect={() => handleSelect('products')}>
                  <Package className="mr-2" size={16} weight="duotone" />
                  {p.name} – {p.category}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Team">
              {(team || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((m) => (
                <CommandItem key={m.id} value={m.name} onSelect={() => handleSelect('team')}>
                  <Users className="mr-2" size={16} weight="duotone" />
                  {m.name} – {m.role}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Datasheets">
              {(datasheets || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((d) => (
                <CommandItem key={d.id} value={d.title} onSelect={() => handleSelect('datasheets')}>
                  <FileText className="mr-2" size={16} weight="duotone" />
                  {d.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="News & Publications">
              {(news || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((n) => (
                <CommandItem key={n.id} value={n.title} onSelect={() => handleSelect('news')}>
                  <Newspaper className="mr-2" size={16} weight="duotone" />
                  {n.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
