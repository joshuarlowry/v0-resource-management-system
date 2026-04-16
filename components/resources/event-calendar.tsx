"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'
import { cn } from '@/lib/utils'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns'

interface EventCalendarProps {
  events: ResourceWithRelations[]
  tags: Tag[]
  className?: string
}

export function EventCalendar({ events, tags, className }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date): ResourceWithRelations[] => {
    return events.filter(event => {
      if (!event.startDate) return false
      const start = new Date(event.startDate)
      const end = event.endDate ? new Date(event.endDate) : start
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString())
    })
  }

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  return (
    <div className={cn('', className)}>
      {/* Calendar Header */}
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-card-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousMonth}
              className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextMonth}
              className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-md shadow-sm overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-[#8192A6]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day}
              className="py-2 text-center text-xs font-bold uppercase tracking-wider text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const hasEvents = dayEvents.length > 0
            const hasStarredEvent = dayEvents.some(e => e.isStarred)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={index}
                className={cn(
                  'min-h-24 border-t border-l first:border-l-0 p-1',
                  !isCurrentMonth && 'bg-muted/30',
                  index % 7 === 0 && 'border-l-0'
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-md text-sm',
                      isCurrentDay && 'bg-[#3D5B78] text-white font-semibold',
                      !isCurrentMonth && 'text-muted-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {hasStarredEvent && (
                    <Star className="h-3 w-3 fill-[#3D5B78] text-[#3D5B78]" />
                  )}
                </div>

                {/* Event Indicators */}
                {hasEvents && (
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map(event => (
                      <Popover key={event.id}>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              'w-full text-left text-xs px-1 py-0.5 rounded-sm truncate',
                              event.isStarred 
                                ? 'bg-[#A5CDE0] text-[#1A2634] font-medium'
                                : 'bg-[#3D5B78]/10 text-[#3D5B78] hover:bg-[#3D5B78]/20'
                            )}
                          >
                            {event.title}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0 bg-card border-border rounded-md" align="start">
                          <EventPopoverContent event={event} tags={tags} />
                        </PopoverContent>
                      </Popover>
                    ))}
                    {dayEvents.length > 3 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-full text-left text-xs text-muted-foreground hover:text-card-foreground px-1">
                            +{dayEvents.length - 3} more
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-3 bg-card border-border rounded-md" align="start">
                          <div className="space-y-2">
                            {dayEvents.slice(3).map(event => (
                              <Link 
                                key={event.id} 
                                href={`/resources/${event.id}`}
                                className="block text-sm text-card-foreground hover:text-[#3D5B78]"
                              >
                                {event.title}
                              </Link>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EventPopoverContent({ 
  event, 
  tags 
}: { 
  event: ResourceWithRelations
  tags: Tag[]
}) {
  const eventTags = event.tags
    .map(tagId => tags.find(t => t.id === tagId))
    .filter(Boolean) as Tag[]

  const startDate = event.startDate ? new Date(event.startDate) : null
  const endDate = event.endDate ? new Date(event.endDate) : null

  const formatEventDate = () => {
    if (!startDate) return null
    
    if (endDate && startDate.toDateString() !== endDate.toDateString()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
    }
    
    const time = format(startDate, 'h:mm a')
    const endTime = endDate ? format(endDate, 'h:mm a') : null
    
    return endTime ? `${time} - ${endTime}` : time
  }

  return (
    <div className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium line-clamp-2 text-card-foreground">{event.title}</h4>
        {event.isStarred && (
          <Star className="h-4 w-4 fill-[#3D5B78] text-[#3D5B78] flex-shrink-0" />
        )}
      </div>
      
      {formatEventDate() && (
        <p className="text-xs text-muted-foreground mb-2">{formatEventDate()}</p>
      )}
      
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {event.description}
      </p>

      {eventTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {eventTags.map(tag => (
            <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <EntityLinks badges={event.linkedBadges} courses={event.linkedCourses} showLabels />
        <Link 
          href={`/resources/${event.id}`}
          className="text-xs uppercase tracking-wider text-[#3D5B78] hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  )
}
