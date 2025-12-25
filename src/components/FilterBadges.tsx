import { Badge } from '@/components/ui/badge'

interface FilterBadgesProps {
  items: string[]
  selectedItem: string
  onSelect: (item: string) => void
  className?: string
}

export function FilterBadges({ 
  items, 
  selectedItem, 
  onSelect,
  className = 'flex flex-wrap gap-2'
}: FilterBadgesProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <Badge
          key={item}
          variant={selectedItem === item ? 'default' : 'outline'}
          className="cursor-pointer px-4 md:px-5 py-2 md:py-2.5 text-sm capitalize font-semibold"
          onClick={() => onSelect(item)}
        >
          {item}
        </Badge>
      ))}
    </div>
  )
}
