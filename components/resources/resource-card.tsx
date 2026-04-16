"use client"

import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import { ResourceTypeIcon, getResourceTypeLabel } from './resource-type-icon'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface ResourceCardProps {
  resource: ResourceWithRelations
  tags: Tag[]
  className?: string
}

export function ResourceCard({ resource, tags, className }: ResourceCardProps) {
  const resourceTags = resource.tags
    .map(tagId => tags.find(t => t.id === tagId))
    .filter(Boolean) as Tag[]

  const formatEventDate = () => {
    if (resource.type !== 'event' || !resource.startDate) return null
    
    const start = new Date(resource.startDate)
    const end = resource.endDate ? new Date(resource.endDate) : null
    
    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    }
    
    return format(start, 'MMM d, yyyy')
  }

  const eventDate = formatEventDate()

  return (
    <Link href={`/resources/${resource.id}`}>
      <div 
        className={cn(
          'bg-card rounded-md overflow-hidden h-full flex flex-col shadow-sm transition-all hover:shadow-md',
          resource.isStarred && 'ring-2 ring-[#3D5B78] bg-[#A5CDE0]/10',
          className
        )}
      >
        {/* Card Header */}
        <div className="bg-[#8192A6] py-2 px-3 relative">
          <span className="text-white text-xs font-bold uppercase tracking-wider block text-center w-full">
            {getResourceTypeLabel(resource.type)}
          </span>
          {resource.isStarred && (
            <Star className="h-3.5 w-3.5 fill-white text-white absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <ResourceTypeIcon type={resource.type} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-card-foreground">
                {resource.title}
              </h3>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {resource.description}
          </p>
          
          {eventDate && (
            <div className="flex items-center gap-1.5 text-xs text-[#3D5B78] mb-3">
              <Clock className="h-3 w-3" />
              <span>{eventDate}</span>
            </div>
          )}

          {resourceTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {resourceTags.slice(0, 3).map(tag => (
                <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
              ))}
              {resourceTags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{resourceTags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <EntityLinks 
              badges={resource.linkedBadges} 
              courses={resource.linkedCourses}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
