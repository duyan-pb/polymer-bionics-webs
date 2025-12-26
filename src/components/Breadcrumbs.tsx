/**
 * Breadcrumbs Component
 * 
 * Navigation breadcrumb trail for showing page hierarchy.
 * Built on top of shadcn/ui Breadcrumb components.
 * 
 * @module components/Breadcrumbs
 */

import { Breadcrumb, BreadcrumbItem as BreadcrumbItemUI, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

/**
 * Single breadcrumb item in the navigation trail.
 */
export interface BreadcrumbItem {
  /** Display text for the breadcrumb */
  label: string
  /** Target page ID (if clickable) */
  page?: string
}

/**
 * Props for the Breadcrumbs component.
 */
interface BreadcrumbsProps {
  /** Array of breadcrumb items forming the trail */
  trail: BreadcrumbItem[]
  /** Navigation handler when a breadcrumb is clicked */
  onNavigate: (page: string) => void
}

/**
 * Breadcrumb navigation component.
 * 
 * Renders a trail of navigation links showing the page hierarchy.
 * The last item (current page) is displayed as non-clickable text.
 * 
 * @example
 * ```tsx
 * <Breadcrumbs
 *   trail={[
 *     { label: 'Home', page: 'home' },
 *     { label: 'Products', page: 'products' },
 *     { label: 'Product Details' }
 *   ]}
 *   onNavigate={handleNavigate}
 * />
 * ```
 */
export function Breadcrumbs({ trail, onNavigate }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {trail.map((item, idx) => (
          <BreadcrumbItemUI key={item.label}>
            {item.page ? (
              <BreadcrumbLink onClick={() => onNavigate(item.page ?? '')} className="cursor-pointer text-primary hover:underline">
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
