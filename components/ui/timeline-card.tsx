import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ContentCard } from './card-content'

interface TimelineCardProps {
  children: ReactNode
  title?: string
  description?: string
  footer?: ReactNode
  actions?: ReactNode
  className?: string
  contentClassName?: string
  markerClassName?: string
  showMarker?: boolean
}

export function TimelineCard({
  children,
  title,
  description,
  footer,
  actions,
  className,
  contentClassName,
  markerClassName,
  showMarker = true,
}: TimelineCardProps) {
  return (
    <div className={cn('relative pl-8', className)}>
      {showMarker && (
        <div
          className={cn(
            'absolute left-0 top-4 w-4 h-4 rounded-full bg-primary',
            markerClassName
          )}
        />
      )}
      <div className="absolute left-[7px] top-8 bottom-0 w-[2px] bg-border" />
      <ContentCard
        title={title}
        description={description}
        footer={footer}
        actions={actions}
        contentClassName={contentClassName}
      >
        {children}
      </ContentCard>
    </div>
  )
} 