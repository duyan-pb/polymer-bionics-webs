import { Breadcrumb, BreadcrumbItem as BreadcrumbItemUI, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export interface BreadcrumbItem {
  label: string
  page?: string
}

interface BreadcrumbsProps {
  trail: BreadcrumbItem[]
  onNavigate: (page: string) => void
}

export function Breadcrumbs({ trail, onNavigate }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {trail.map((item, idx) => (
          <BreadcrumbItemUI key={item.label}>
            {item.page ? (
              <BreadcrumbLink onClick={() => onNavigate(item.page!)} className="cursor-pointer text-primary hover:underline">
                {item.label}
              </BreadcrumbLink>
            ) : (
              <span className="text-muted-foreground">{item.label}</span>
            )}
            {idx < trail.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItemUI>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
