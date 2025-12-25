import { useEffect, useMemo, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Users, Package, FileText, Newspaper, ArrowRight } from '@phosphor-icons/react'
import Fuse from 'fuse.js'
import { NAV_ITEMS } from '@/lib/constants'
import type { TeamMember, Product, Datasheet, NewsItem } from '@/lib/types'

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (page: string) => void
  products: Product[]
  team: TeamMember[]
  datasheets: Datasheet[]
  news: NewsItem[]
}

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

  type SearchType = 'nav' | 'product' | 'team' | 'datasheet' | 'news'

  const searchItems = useMemo(() => {
    const navItems = NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      subtitle: item.description,
      page: item.id,
      type: 'nav' as SearchType,
    }))

    const productItems = (products || []).map((product) => ({
      id: `product-${product.id}`,
      label: product.name,
      subtitle: product.category,
      page: 'products',
      type: 'product' as SearchType,
    }))

    const teamItems = (team || []).map((member) => ({
      id: `team-${member.id}`,
      label: member.name,
      subtitle: member.role,
      page: 'team',
      type: 'team' as SearchType,
    }))

    const datasheetItems = (datasheets || []).map((datasheet) => ({
      id: `datasheet-${datasheet.id}`,
      label: datasheet.title,
      subtitle: datasheet.category,
      page: 'datasheets',
      type: 'datasheet' as SearchType,
    }))

    const newsItems = (news || []).map((newsItem) => ({
      id: `news-${newsItem.id}`,
      label: newsItem.title,
      subtitle: newsItem.category,
      page: 'news',
      type: 'news' as SearchType,
    }))

    return [...navItems, ...productItems, ...teamItems, ...datasheetItems, ...newsItems]
  }, [datasheets, news, products, team])

  const fuse = useMemo(() => new Fuse(searchItems, {
    keys: [
      { name: 'label', weight: 0.6 },
      { name: 'subtitle', weight: 0.3 },
      { name: 'type', weight: 0.1 },
    ],
    threshold: 0.38,
    ignoreLocation: true,
  }), [searchItems])

  const fuseResults = useMemo(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      return []
    }
    return fuse.search(trimmed).slice(0, 12).map(result => result.item)
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
              {(products || []).slice(0, 8).map((product) => (
                <CommandItem key={product.id} value={product.name} onSelect={() => handleSelect('products')}>
                  <Package className="mr-2" size={16} weight="duotone" />
                  {product.name} – {product.category}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Team">
              {(team || []).slice(0, 8).map((member) => (
                <CommandItem key={member.id} value={member.name} onSelect={() => handleSelect('team')}>
                  <Users className="mr-2" size={16} weight="duotone" />
                  {member.name} – {member.role}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Datasheets">
              {(datasheets || []).slice(0, 8).map((datasheet) => (
                <CommandItem key={datasheet.id} value={datasheet.title} onSelect={() => handleSelect('datasheets')}>
                  <FileText className="mr-2" size={16} weight="duotone" />
                  {datasheet.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="News & Publications">
              {(news || []).slice(0, 8).map((newsItem) => (
                <CommandItem key={newsItem.id} value={newsItem.title} onSelect={() => handleSelect('news')}>
                  <Newspaper className="mr-2" size={16} weight="duotone" />
                  {newsItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

export default GlobalSearch
