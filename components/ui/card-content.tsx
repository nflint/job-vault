import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CardContentProps {
  children: ReactNode
  title?: string
  description?: string
  footer?: ReactNode
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
 * @param root0.footer
 * @param root0.actions
 * @param root0.className
 * @param root0.contentClassName
 */
export function ContentCard({
  children,
  title,
  description,
  footer,
  actions,
  className,
  contentClassName,
}: CardContentProps) {
  return (
    <Card className={cn('', className)}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
            <div className="space-y-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn('space-y-4', contentClassName)}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
} 