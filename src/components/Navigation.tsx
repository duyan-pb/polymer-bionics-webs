import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, X } from '@phosphor-icons/react'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'team', label: 'Team' },
    { id: 'products', label: 'Products' },
    { id: 'media', label: 'Videos & Case Studies' },
    { id: 'datasheets', label: 'Datasheets' },
    { id: 'news', label: 'News & Publications' },
  ]

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('home')}
            className="text-2xl font-bold text-primary hover:text-accent transition-colors"
          >
            PolymerBionics
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => handleNavigate(item.id)}
                className="text-sm font-medium tracking-wide"
              >
                {item.label}
              </Button>
            ))}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <List size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => handleNavigate(item.id)}
                    className="justify-start text-base"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
