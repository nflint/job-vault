import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
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
export function PageLayout({
  children,
  title,
  description,
  actions,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn('container mx-auto p-6 space-y-6', className)}>
      {(title || description || actions) && (
        <header className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-1">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <main className={cn('space-y-6', contentClassName)}>{children}</main>
    </div>
  )
} 