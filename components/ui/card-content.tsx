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