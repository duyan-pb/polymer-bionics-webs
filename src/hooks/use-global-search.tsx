/**
 * Global Search Hook
 * 
 * Builds search items and browse groups for GlobalSearch.
 * 
 * @module hooks/use-global-search
 */

import { useMemo, useState, type ReactNode } from 'react'
import Fuse from 'fuse.js'
import { ArrowRight, FileText, Newspaper, Package, Users } from '@phosphor-icons/react'
import { NAV_ITEMS } from '@/lib/constants'
import type { Datasheet, NewsItem, Product, TeamMember } from '@/lib/types'

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

interface SearchItem {
  id: string
  label: string
  subtitle?: string
  page: string
  type: SearchType
}

interface SearchResultsGroupItem {
  id: string
  label: string
  subtitle?: string
  onSelect: () => void
  icon: ReactNode
}

interface SearchBrowseGroupItem {
  id: string
  label: string
  onSelect: () => void
  icon: ReactNode
}

interface SearchBrowseGroup {
  heading: string
  items: SearchBrowseGroupItem[]
}

interface UseGlobalSearchDataProps {
  onSelect: (page: string) => void
  products: Product[]
  team: TeamMember[]
  datasheets: Datasheet[]
  news: NewsItem[]
}

export function useGlobalSearchData({ onSelect, products, team, datasheets, news }: UseGlobalSearchDataProps) {
  const [searchQuery, setSearchQuery] = useState('')

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

  const resultsGroupItems: SearchResultsGroupItem[] = fuseResults.map((item) => ({
    id: item.id,
    label: item.label,
    subtitle: item.subtitle,
    onSelect: () => onSelect(item.page),
    icon: renderIcon(item.type),
  }))

  const browseGroups: SearchBrowseGroup[] = [
    {
      heading: 'Navigate',
      items: NAV_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
        onSelect: () => onSelect(item.id),
        icon: <ArrowRight className="mr-2" size={16} weight="bold" />,
      })),
    },
    {
      heading: 'Products',
      items: (products || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((p) => ({
        id: p.id,
        label: `${p.name} – ${p.category}`,
        onSelect: () => onSelect('products'),
        icon: <Package className="mr-2" size={16} weight="duotone" />,
      })),
    },
    {
      heading: 'Team',
      items: (team || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((m) => ({
        id: m.id,
        label: `${m.name} – ${m.role}`,
        onSelect: () => onSelect('team'),
        icon: <Users className="mr-2" size={16} weight="duotone" />,
      })),
    },
    {
      heading: 'Datasheets',
      items: (datasheets || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((d) => ({
        id: d.id,
        label: d.title,
        onSelect: () => onSelect('datasheets'),
        icon: <FileText className="mr-2" size={16} weight="duotone" />,
      })),
    },
    {
      heading: 'News & Publications',
      items: (news || []).slice(0, MAX_RESULTS_PER_CATEGORY).map((n) => ({
        id: n.id,
        label: n.title,
        onSelect: () => onSelect('news'),
        icon: <Newspaper className="mr-2" size={16} weight="duotone" />,
      })),
    },
  ]

  return {
    searchQuery,
    setSearchQuery,
    hasQuery,
    resultsGroupItems,
    browseGroups,
  }
}
