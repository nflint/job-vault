import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
  contentClassName?: string
}

/**
 *
 * @param root0
 * @param root0.children
 * @param root0.title
 * @param root0.description
 * @param root0.actions
 * @param root0.className
 * @param root0.contentClassName
 */
export function Section({
  children,
  title,
  description,
  actions,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-1">
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('space-y-4', contentClassName)}>{children}</div>
    </section>
  )
} 