import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, MagnifyingGlass, MoonStars, SunDim } from '@phosphor-icons/react'
import { NAV_ITEMS } from '@/lib/constants'
import logoPng from '@/assets/images/unnamed.png'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
  onOpenSearch: () => void
  isDark: boolean
  onToggleTheme: () => void
}

export function Navigation({ currentPage, onNavigate, onOpenSearch, isDark, onToggleTheme }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 md:py-4">
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

          <div className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.slice(1).map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => handleNavigate(item.id)}
                className="text-sm font-medium tracking-wide relative"
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-primary" />
                )}
              </Button>
            ))}
            <Button variant="ghost" size="icon" onClick={onOpenSearch} className="ml-2" aria-label="Open search">
              <MagnifyingGlass size={20} weight="bold" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
              {isDark ? <SunDim size={20} weight="duotone" /> : <MoonStars size={20} weight="duotone" />}
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <List size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-2 mt-8">
                <Button variant="secondary" onClick={onOpenSearch} className="justify-start" aria-label="Open search">
                  Quick Search (⌘K)
                </Button>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => handleNavigate(item.id)}
                    className="justify-start text-base"
                  >
                    {item.label}
                  </Button>
                ))}
                <Button variant="outline" size="icon" onClick={onToggleTheme} className="mt-2" aria-label="Toggle theme">
                  {isDark ? <SunDim size={20} weight="duotone" /> : <MoonStars size={20} weight="duotone" />}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
