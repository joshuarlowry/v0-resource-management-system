"use client"

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  ExternalLink, 
  Download, 
  Award, 
  BookOpen,
  CalendarPlus
} from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { TagBadge } from '@/components/resources/tag-badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = use(params)
  const { getResourceWithRelations, tags } = useResources()
  
  const resource = getResourceWithRelations(id)
  
  if (!resource) {
    notFound()
  }

  const resourceTags = resource.tags
    .map(tagId => tags.find(t => t.id === tagId))
    .filter(Boolean)

  const formatEventDate = () => {
    if (resource.type !== 'event' || !resource.startDate) return null
    
    const start = new Date(resource.startDate)
    const end = resource.endDate ? new Date(resource.endDate) : null
    
    if (end && start.toDateString() !== end.toDateString()) {
      return {
        start: format(start, 'EEEE, MMMM d, yyyy'),
        end: format(end, 'EEEE, MMMM d, yyyy'),
        multiDay: true
      }
    }
    
    const startTime = format(start, 'h:mm a')
    const endTime = end ? format(end, 'h:mm a') : null
    
    return {
      date: format(start, 'EEEE, MMMM d, yyyy'),
      time: endTime ? `${startTime} - ${endTime}` : startTime,
      multiDay: false
    }
  }

  const eventDate = formatEventDate()

  const getActionUrl = () => {
    if (resource.url) return resource.url
    if (resource.fileUrl) return resource.fileUrl
    return null
  }

  const actionUrl = getActionUrl()

  return (
    <AppShell title="Resource Details">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Button>
        </Link>

        {/* Resource Header Card */}
        <div className={cn(
          'bg-card rounded-md shadow-sm overflow-hidden',
          resource.isStarred && 'ring-2 ring-[#3D5B78]'
        )}>
          {/* Card Header */}
          <div className="bg-[#8192A6] py-2 px-4 relative">
            <span className="text-white text-xs font-bold uppercase tracking-wider block text-center w-full">
              {getResourceTypeLabel(resource.type)}
            </span>
            {resource.isStarred && (
              <div className="flex items-center gap-1.5 absolute right-4 top-1/2 -translate-y-1/2">
                <Star className="h-3.5 w-3.5 fill-white text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-wider">Featured</span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className={cn(
            'p-4 sm:p-6',
            resource.isStarred && 'bg-[#A5CDE0]/10'
          )}>
            <div className="flex items-start gap-3 sm:gap-4">
              <ResourceTypeIcon type={resource.type} size="lg" />
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-card-foreground text-balance mb-2 sm:mb-3">
                  {resource.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            {resource.type === 'event' && eventDate && (
              <div className="bg-card rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#8192A6] py-2 px-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4" />
                    Event Details
                  </span>
                </div>
                <div className="p-4">
                  {eventDate.multiDay ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Starts:</span>
                        <p className="font-medium text-card-foreground">{eventDate.start}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Ends:</span>
                        <p className="font-medium text-card-foreground">{eventDate.end}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Date:</span>
                        <p className="font-medium text-card-foreground">{eventDate.date}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Time:</span>
                        <p className="font-medium text-card-foreground">{eventDate.time}</p>
                      </div>
                    </div>
                  )}
                  <Button 
                    className="mt-4 gap-2 text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md" 
                    variant="default"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            )}

            {/* Access Resource */}
            {actionUrl && (
              <div className="bg-card rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#8192A6] py-2 px-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider block text-center">
                    {resource.url ? 'External Link' : 'Download'}
                  </span>
                </div>
                <div className="p-4">
                  <a 
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="gap-2 text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md">
                      {resource.url ? (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          Open Link
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download File
                        </>
                      )}
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {actionUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Linked Badges */}
            {resource.linkedBadges.length > 0 && (
              <div className="bg-card rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#8192A6] py-2 px-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center">
                    <Award className="h-4 w-4" />
                    Linked Badges
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {resource.linkedBadges.map(badge => (
                      <div 
                        key={badge.id}
                        className="flex items-center gap-2 rounded-md px-3 py-2 bg-slate-100"
                      >
                        <span className="font-medium text-sm text-slate-600">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Linked Courses */}
            {resource.linkedCourses.length > 0 && (
              <div className="bg-card rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#8192A6] py-2 px-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center">
                    <BookOpen className="h-4 w-4" />
                    Linked Courses
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {resource.linkedCourses.map(course => (
                      <div 
                        key={course.id}
                        className="flex items-center justify-between rounded-md px-4 py-3 bg-slate-100"
                      >
                        <div>
                          <p className="font-medium text-slate-600">{course.name}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            {course.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {resourceTags.length > 0 && (
              <div className="bg-card rounded-md shadow-sm overflow-hidden">
                <div className="bg-[#8192A6] py-2 px-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider block text-center">Tags</span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {resourceTags.map(tag => tag && (
                      <TagBadge 
                        key={tag.id} 
                        name={tag.name} 
                        colorVariantId={tag.colorVariantId}
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-card rounded-md shadow-sm overflow-hidden">
              <div className="bg-[#8192A6] py-2 px-4">
                <span className="text-white text-xs font-bold uppercase tracking-wider block text-center">Details</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Created</span>
                  <p className="text-sm font-medium text-card-foreground">
                    {format(new Date(resource.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
                <Separator className="bg-border" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Last Updated</span>
                  <p className="text-sm font-medium text-card-foreground">
                    {format(new Date(resource.updatedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
                <Separator className="bg-border" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Type</span>
                  <p className="text-sm font-medium capitalize text-card-foreground">
                    {resource.type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
