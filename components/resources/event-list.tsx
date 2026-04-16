"use client"

import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format, isToday, isTomorrow, isThisWeek, isThisYear } from 'date-fns'

interface EventListProps {
  events: ResourceWithRelations[]
  tags: Tag[]
  className?: string
}

function groupEventsByDate(events: ResourceWithRelations[]): Map<string, ResourceWithRelations[]> {
  const groups = new Map<string, ResourceWithRelations[]>()
  
  const sortedEvents = [...events].sort((a, b) => {
    const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
    const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
    return aDate - bDate
  })
  
  sortedEvents.forEach(event => {
    if (!event.startDate) return
    const dateKey = format(new Date(event.startDate), 'yyyy-MM-dd')
    const existing = groups.get(dateKey) || []
    groups.set(dateKey, [...existing, event])
  })
  
  return groups
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr)
  
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isThisWeek(date)) return format(date, 'EEEE')
  if (isThisYear(date)) return format(date, 'EEEE, MMMM d')
  return format(date, 'EEEE, MMMM d, yyyy')
}

export function EventList({ events, tags, className }: EventListProps) {
  const groupedEvents = groupEventsByDate(events)
  
  if (events.length === 0) {
    return (
      <div className={cn('bg-card rounded-md shadow-sm p-16 text-center', className)}>
        <div className="rounded-full bg-muted p-4 mb-4 w-fit mx-auto">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-card-foreground">No events found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          There are no events matching your current filters.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Array.from(groupedEvents.entries()).map(([dateKey, dateEvents]) => (
        <div key={dateKey}>
          <div className="bg-[#8192A6] py-2 px-4 rounded-md mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white text-center">
              {formatDateHeader(dateKey)}
            </h3>
          </div>
          <div className="space-y-3">
            {dateEvents.map(event => {
              const eventTags = event.tags
                .map(tagId => tags.find(t => t.id === tagId))
                .filter(Boolean) as Tag[]
              
              const startTime = event.startDate 
                ? format(new Date(event.startDate), 'h:mm a')
                : null
              const endTime = event.endDate && event.startDate && 
                new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString()
                ? format(new Date(event.endDate), 'h:mm a')
                : null

              return (
                <Link key={event.id} href={`/resources/${event.id}`}>
                  <div className={cn(
                    'bg-card rounded-md shadow-sm overflow-hidden transition-all hover:shadow-md',
                    event.isStarred && 'ring-2 ring-[#3D5B78] bg-[#A5CDE0]/10'
                  )}>
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Time */}
                        <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                          {startTime && (
                            <div className="text-xs sm:text-sm font-medium text-card-foreground">{startTime}</div>
                          )}
                          {endTime && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground">{endTime}</div>
                          )}
                        </div>
                        
                        {/* Divider */}
                        <div className="w-px h-14 bg-border flex-shrink-0" />
                        
                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-card-foreground line-clamp-1">
                              {event.title}
                            </h4>
                            {event.isStarred && (
                              <Star className="h-4 w-4 fill-[#3D5B78] text-[#3D5B78] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {eventTags.length > 0 && (
                              <div className="flex gap-1">
                                {eventTags.slice(0, 2).map(tag => (
                                  <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
                                ))}
                              </div>
                            )}
                            <EntityLinks badges={event.linkedBadges} courses={event.linkedCourses} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
