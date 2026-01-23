/**
 * Search Browse Group
 * 
 * Renders a list of items for browse mode.
 * 
 * @module components/search/SearchBrowseGroup
 */

import { CommandGroup, CommandItem } from '@/components/ui/command'
import type { ReactNode } from 'react'

interface SearchBrowseGroupItem {
  id: string
  label: string
  onSelect: () => void
  icon: ReactNode
}

interface SearchBrowseGroupProps {
  heading: string
  items: SearchBrowseGroupItem[]
}

export function SearchBrowseGroup({ heading, items }: SearchBrowseGroupProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <CommandGroup heading={heading}>
      {items.map((item) => (
        <CommandItem key={item.id} value={item.label} onSelect={item.onSelect}>
          {item.icon}
          {item.label}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
