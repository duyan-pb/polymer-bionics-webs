import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from '@phosphor-icons/react'

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400)
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-4 md:bottom-6 left-4 md:left-6 shadow-lg rounded-full h-10 w-10 md:h-12 md:w-12"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <ArrowUp size={20} weight="bold" className="md:w-[22px] md:h-[22px]" />
    </Button>
  )
}
