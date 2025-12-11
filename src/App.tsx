import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Navigation } from '@/components/Navigation'
import { HomePage } from '@/components/HomePage'
import { TeamPage } from '@/components/TeamPage'
import { ProductsPage } from '@/components/ProductsPage'
import { MediaPage } from '@/components/MediaPage'
import { DatasheetsPage } from '@/components/DatasheetsPage'
import { NewsPage } from '@/components/NewsPage'
import type { TeamMember, Product, Video, CaseStudy, Datasheet, NewsItem, Publication } from '@/lib/types'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  const [team] = useKV<TeamMember[]>('team', [])
  const [products] = useKV<Product[]>('products', [])
  const [videos] = useKV<Video[]>('videos', [])
  const [caseStudies] = useKV<CaseStudy[]>('caseStudies', [])
  const [datasheets] = useKV<Datasheet[]>('datasheets', [])
  const [news] = useKV<NewsItem[]>('news', [])
  const [publications] = useKV<Publication[]>('publications', [])

  const renderPage = () => {
    switch (currentPage) {
      case 'team':
        return <TeamPage team={team || []} />
      case 'products':
        return <ProductsPage products={products || []} />
      case 'media':
        return <MediaPage videos={videos || []} caseStudies={caseStudies || []} />
      case 'datasheets':
        return <DatasheetsPage datasheets={datasheets || []} />
      case 'news':
        return <NewsPage news={news || []} publications={publications || []} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App