import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, X } from '@phosphor-icons/react'
import logoPng from '@/assets/images/unnamed.png'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'team', label: 'Team' },
    { id: 'materials', label: 'Materials' },
    { id: 'products', label: 'Products' },
    { id: 'applications', label: 'Applications' },
    { id: 'media', label: 'Videos & Case Studies' },
    { id: 'datasheets', label: 'Datasheets' },
    { id: 'news', label: 'News & Publications' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              whileHover={{ 
                rotate: [0, -2, 2, -2, 0],
                transition: { 
                  duration: 0.4,
                  ease: "easeInOut"
                }
              }}
            >
              <img 
                src={logoPng} 
                alt="Polymer Bionics" 
                className="h-11 w-auto transition-all duration-300 group-hover:brightness-110"
              />
            </motion.div>
            <span className="text-xl font-semibold text-foreground tracking-tight">
              polymerbionics
            </span>
          </motion.button>

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
