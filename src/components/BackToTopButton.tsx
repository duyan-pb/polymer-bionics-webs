import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from '@phosphor-icons/react'

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-6 right-6 shadow-lg rounded-full h-12 w-12"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <ArrowUp size={22} weight="bold" />
    </Button>
  )
}
