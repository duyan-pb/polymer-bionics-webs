/**
 * Search Results Group
 * 
 * Renders a list of search results with icons.
 * 
 * @module components/search/SearchResultsGroup
 */

import { CommandGroup, CommandItem } from '@/components/ui/command'
import type { ReactNode } from 'react'

interface SearchResultsGroupItem {
  id: string
  label: string
  subtitle?: string
  onSelect: () => void
  icon: ReactNode
}

interface SearchResultsGroupProps {
  heading: string
  items: SearchResultsGroupItem[]
}

export function SearchResultsGroup({ heading, items }: SearchResultsGroupProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <CommandGroup heading={heading}>
      {items.map((item) => (
        <CommandItem key={item.id} value={item.label} onSelect={item.onSelect}>
          {item.icon}
          <div className="flex flex-col">
            <span className="font-medium">{item.label}</span>
            {item.subtitle && (
              <span className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</span>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
