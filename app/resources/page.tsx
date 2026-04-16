"use client"

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { SearchInput } from '@/components/resources/search-input'
import { FilterBar } from '@/components/resources/filter-bar'
import { ResourceCard } from '@/components/resources/resource-card'
import { Button } from '@/components/ui/button'
import { X, ArrowLeft } from 'lucide-react'
import type { ResourceType } from '@/lib/types'

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <AppShell title="Browse Resources">
        <div className="bg-card rounded-md shadow-sm p-16 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Loading...</p>
        </div>
      </AppShell>
    }>
      <BrowsePageContent />
    </Suspense>
  )
}

function BrowsePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getResourcesWithRelations, tags, badges, courses, colorVariants, getColorVariant } = useResources()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [starredOnly, setStarredOnly] = useState(false)

  // Handle URL search params for tag filtering
  const tagParam = searchParams.get('tag')
  
  useEffect(() => {
    if (tagParam) {
      setSelectedTags([tagParam])
    }
  }, [tagParam])

  // Get the active category tag for banner display
  const activeCategoryTag = tagParam ? tags.find(t => t.id === tagParam) : null
  const activeCategoryColor = activeCategoryTag ? getColorVariant(activeCategoryTag.colorVariantId) : null

  const clearCategoryFilter = () => {
    setSelectedTags([])
    router.push('/resources')
  }

  const resources = getResourcesWithRelations()

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Search query - matches title, description, tags, badges, courses
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = resource.title.toLowerCase().includes(query)
        const matchesDescription = resource.description.toLowerCase().includes(query)
        const matchesTags = resource.tags.some(tagId => {
          const tag = tags.find(t => t.id === tagId)
          return tag?.name.toLowerCase().includes(query)
        })
        const matchesBadges = resource.linkedBadges.some(badge => 
          badge.name.toLowerCase().includes(query)
        )
        const matchesCourses = resource.linkedCourses.some(course => 
          course.name.toLowerCase().includes(query) || 
          course.code.toLowerCase().includes(query)
        )
        
        if (!matchesTitle && !matchesDescription && !matchesTags && !matchesBadges && !matchesCourses) {
          return false
        }
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) {
        return false
      }

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(tagId => resource.tags.includes(tagId))) {
        return false
      }

      // Badge filter
      if (selectedBadges.length > 0 && !selectedBadges.some(badgeId => 
        resource.linkedBadges.some(b => b.id === badgeId)
      )) {
        return false
      }

      // Course filter
      if (selectedCourses.length > 0 && !selectedCourses.some(courseId => 
        resource.linkedCourses.some(c => c.id === courseId)
      )) {
        return false
      }

      // Starred filter
      if (starredOnly && !resource.isStarred) {
        return false
      }

      return true
    })
  }, [resources, searchQuery, selectedTypes, selectedTags, selectedBadges, selectedCourses, starredOnly, tags])

  // Sort to show starred items first
  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1
      if (!a.isStarred && b.isStarred) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [filteredResources])

  return (
    <AppShell title={activeCategoryTag ? `${activeCategoryTag.name} Resources` : "Browse Resources"}>
      <div className="space-y-6">
        {/* Category Filter Banner */}
        {activeCategoryTag && (
          <div 
            className="rounded-md p-4 flex flex-wrap items-center justify-between gap-3"
            style={{ 
              backgroundColor: activeCategoryColor?.background || '#3D5B78',
            }}
          >
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-white/20"
                  style={{ color: activeCategoryColor?.text || '#fff' }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h2 
                  className="font-bold text-sm uppercase tracking-wider"
                  style={{ color: activeCategoryColor?.text || '#fff' }}
                >
                  {activeCategoryTag.name}
                </h2>
                <p 
                  className="text-xs opacity-80"
                  style={{ color: activeCategoryColor?.text || '#fff' }}
                >
                  Showing all resources in this category
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCategoryFilter}
              className="gap-1 text-xs hover:bg-white/20"
              style={{ color: activeCategoryColor?.text || '#fff' }}
            >
              <X className="h-3 w-3" />
              Clear Filter
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-card rounded-md py-2 px-4 shadow-sm">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, tags, badges, courses..."
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-md py-2 px-4 shadow-sm">
          <FilterBar
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            selectedBadges={selectedBadges}
            onBadgesChange={setSelectedBadges}
            selectedCourses={selectedCourses}
            onCoursesChange={setSelectedCourses}
            starredOnly={starredOnly}
            onStarredOnlyChange={setStarredOnly}
            tags={tags}
            badges={badges}
            courses={courses}
            colorVariants={colorVariants}
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider text-[#8192A6]">
            {sortedResources.length} RESOURCES FOUND
            {searchQuery && (
              <span> FOR &ldquo;{searchQuery}&rdquo;</span>
            )}
          </p>
        </div>

        {/* Resource Grid */}
        {sortedResources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedResources.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                tags={tags}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-md shadow-sm p-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4 w-fit mx-auto">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-card-foreground">No resources found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
