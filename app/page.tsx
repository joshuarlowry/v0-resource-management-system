"use client"

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { getResourcesWithRelations, tags, getColorVariant } = useResources()
  const carouselRef = useRef<HTMLDivElement>(null)

  const allResources = getResourcesWithRelations()

  // Get starred/featured resources for carousel
  const featuredResources = useMemo(() => {
    return allResources
      .filter(r => r.isStarred)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [allResources])

  // Group resources by tag for category view
  const categoriesWithResources = useMemo(() => {
    return tags.map(tag => {
      const tagResources = allResources.filter(r => r.tags.includes(tag.id))
      return {
        tag,
        resources: tagResources,
        count: tagResources.length,
      }
    }).filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Show top 8 categories
  }, [tags, allResources])

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <AppShell title="Home">
      <div className="space-y-8">
        {/* Featured Resources Section */}
        {featuredResources.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-card-foreground flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#3D5B78] text-[#3D5B78]" />
                Featured Resources
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-card border-border hover:bg-muted rounded-full"
                  onClick={() => scrollCarousel('left')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-card border-border hover:bg-muted rounded-full"
                  onClick={() => scrollCarousel('right')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Carousel */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredResources.map(resource => (
                <Link 
                  key={resource.id} 
                  href={`/resources/${resource.id}`}
                  className="flex-shrink-0 w-[180px] sm:w-[220px] snap-start"
                >
                  <div className="bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                    {/* Image placeholder / Type header */}
                    <div className="h-28 sm:h-32 bg-gradient-to-br from-[#3D5B78] to-[#8192A6] flex items-center justify-center relative">
                      <ResourceTypeIcon type={resource.type} size="lg" showBackground={false} className="text-white/80" />
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 fill-white text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {getResourceTypeLabel(resource.type)}
                      </p>
                      <h3 className="font-medium text-xs sm:text-sm line-clamp-2 text-card-foreground">
                        {resource.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Browse Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-card-foreground">
              Browse Categories
            </h2>
            <Link 
              href="/resources" 
              className="text-xs uppercase tracking-wider text-[#3D5B78] hover:text-[#4B6785] font-medium flex items-center gap-1"
            >
              See All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Category Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoriesWithResources.map(({ tag, resources: catResources, count }) => {
              const colorVariant = getColorVariant(tag.colorVariantId)
              // Get preview resources for this category (top 4)
              const previewResources = catResources
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 4)

              return (
                <div 
                  key={tag.id}
                  className="bg-card rounded-md shadow-sm overflow-hidden h-full flex flex-col"
                >
                  {/* Category Header */}
                  <div 
                    className="py-3 px-4 flex items-center gap-3"
                    style={{ 
                      backgroundColor: colorVariant?.background || '#3D5B78',
                    }}
                  >
                    <div 
                      className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <span 
                        className="text-base font-bold"
                        style={{ color: colorVariant?.text || '#fff' }}
                      >
                        {tag.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 
                        className="font-bold text-xs sm:text-sm uppercase tracking-wider truncate"
                        style={{ color: colorVariant?.text || '#fff' }}
                      >
                        {tag.name}
                      </h3>
                      <p 
                        className="text-[10px] sm:text-xs opacity-80"
                        style={{ color: colorVariant?.text || '#fff' }}
                      >
                        {count} resource{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Category Body - Resource preview list */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <ul className="space-y-2 flex-1">
                      {previewResources.map(resource => (
                        <li key={resource.id}>
                          <Link 
                            href={`/resources/${resource.id}`}
                            className="flex items-center gap-2 group"
                          >
                            <ResourceTypeIcon type={resource.type} size="sm" className="flex-shrink-0" />
                            <span className="text-xs text-muted-foreground group-hover:text-card-foreground transition-colors line-clamp-1">
                              {resource.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Link 
                        href={`/resources?tag=${tag.id}`}
                        className="text-xs uppercase tracking-wider text-[#3D5B78] font-medium hover:text-[#4B6785] transition-colors"
                      >
                        See All Resources
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* No categories state */}
          {categoriesWithResources.length === 0 && (
            <div className="bg-card rounded-md shadow-sm p-12 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                No categories with resources yet
              </p>
            </div>
          )}
        </section>

        {/* See All Categories Button */}
        <div className="flex justify-center pt-4">
          <Link href="/resources">
            <Button 
              variant="outline" 
              className="gap-2 text-xs uppercase tracking-wider bg-card border-border hover:bg-[#3D5B78] hover:text-white hover:border-[#3D5B78] rounded-md px-8"
            >
              See All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
