import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface BreadcrumbsProps {
  trail: { label: string; page?: string }[]
  onNavigate: (page: string) => void
}

export function Breadcrumbs({ trail, onNavigate }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {trail.map((item, idx) => (
          <BreadcrumbItem key={item.label}>
            {item.page ? (
              <BreadcrumbLink onClick={() => onNavigate(item.page!)} className="cursor-pointer text-primary hover:underline">
                {item.label}
              </BreadcrumbLink>
            ) : (
              <span className="text-muted-foreground">{item.label}</span>
            )}
            {idx < trail.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
