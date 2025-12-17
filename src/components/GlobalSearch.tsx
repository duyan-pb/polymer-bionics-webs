import { useEffect } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { MagnifyingGlass, Users, Package, FileText, Newspaper, ArrowRight } from '@phosphor-icons/react'
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

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Search content">
      <CommandInput placeholder="Search pages, products, team, datasheets" autoFocus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {[
            { id: 'home', label: 'Home' },
            { id: 'products', label: 'Products' },
            { id: 'materials', label: 'Materials' },
            { id: 'applications', label: 'Applications' },
            { id: 'media', label: 'Videos & Case Studies' },
            { id: 'datasheets', label: 'Datasheets' },
            { id: 'news', label: 'News & Publications' },
            { id: 'team', label: 'Team' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <CommandItem key={item.id} value={item.label} onSelect={() => handleSelect(item.id)}>
              <ArrowRight className="mr-2" size={16} weight="bold" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Products">
          {products.slice(0, 8).map((p) => (
            <CommandItem key={p.id} value={p.name} onSelect={() => handleSelect('products')}>
              <Package className="mr-2" size={16} weight="duotone" />
              {p.name} – {p.category}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Team">
          {team.slice(0, 8).map((m) => (
            <CommandItem key={m.id} value={m.name} onSelect={() => handleSelect('team')}>
              <Users className="mr-2" size={16} weight="duotone" />
              {m.name} – {m.role}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Datasheets">
          {datasheets.slice(0, 8).map((d) => (
            <CommandItem key={d.id} value={d.title} onSelect={() => handleSelect('datasheets')}>
              <FileText className="mr-2" size={16} weight="duotone" />
              {d.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="News & Publications">
          {news.slice(0, 8).map((n) => (
            <CommandItem key={n.id} value={n.title} onSelect={() => handleSelect('news')}>
              <Newspaper className="mr-2" size={16} weight="duotone" />
              {n.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
