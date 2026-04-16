"use client"

import { useState, useMemo } from 'react'
import { List, Grid3X3, Star } from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { SearchInput } from '@/components/resources/search-input'
import { EventList } from '@/components/resources/event-list'
import { EventCalendar } from '@/components/resources/event-calendar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'calendar'

export default function CalendarPage() {
  const { getResourcesWithRelations, tags } = useResources()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [starredOnly, setStarredOnly] = useState(false)

  const allResources = getResourcesWithRelations()
  
  // Filter to only events
  const events = useMemo(() => {
    return allResources.filter(resource => {
      // Must be an event type
      if (resource.type !== 'event') return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = resource.title.toLowerCase().includes(query)
        const matchesDescription = resource.description.toLowerCase().includes(query)
        const matchesTags = resource.tags.some(tagId => {
          const tag = tags.find(t => t.id === tagId)
          return tag?.name.toLowerCase().includes(query)
        })
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false
        }
      }

      // Starred filter
      if (starredOnly && !resource.isStarred) {
        return false
      }

      return true
    })
  }, [allResources, searchQuery, starredOnly, tags])

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
      return aDate - bDate
    })
  }, [events])

  return (
    <AppShell title="Events Calendar">
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="bg-card rounded-md border border-border p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
            {/* Search */}
            <SearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search events..."
              className="w-full sm:w-80"
            />

            <div className="flex items-center gap-3 flex-wrap">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                    viewMode === 'list'
                      ? 'bg-[#3D5B78] text-white'
                      : 'text-muted-foreground hover:bg-[#8192A6] hover:text-white'
                  )}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                    viewMode === 'calendar'
                      ? 'bg-[#3D5B78] text-white'
                      : 'text-muted-foreground hover:bg-[#8192A6] hover:text-white'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Calendar
                </button>
              </div>

              {/* Starred Filter */}
              <div className="flex items-center gap-2">
                <Switch
                  id="starred-events"
                  checked={starredOnly}
                  onCheckedChange={setStarredOnly}
                />
                <Label htmlFor="starred-events" className="flex items-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer text-card-foreground">
                  <Star className={cn('h-4 w-4', starredOnly ? 'fill-[#3D5B78] text-[#3D5B78]' : 'text-muted-foreground')} />
                  Featured
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {events.length} event{events.length !== 1 ? 's' : ''} found
            {searchQuery && (
              <span> for &ldquo;{searchQuery}&rdquo;</span>
            )}
          </p>
        </div>

        {/* View Content */}
        {viewMode === 'list' ? (
          <EventList events={sortedEvents} tags={tags} />
        ) : (
          <EventCalendar events={sortedEvents} tags={tags} />
        )}
      </div>
    </AppShell>
  )
}
