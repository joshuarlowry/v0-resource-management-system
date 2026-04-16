"use client"

import { X, Star, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ResourceTypeIcon, getResourceTypeLabel } from './resource-type-icon'
import type { ResourceType, Tag, Badge as BadgeType, Course, ColorVariant } from '@/lib/types'
import { cn } from '@/lib/utils'

const RESOURCE_TYPES: ResourceType[] = ['document', 'video', 'link', 'event', 'image', 'audio']

interface FilterBarProps {
  selectedTypes: ResourceType[]
  onTypesChange: (types: ResourceType[]) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  selectedBadges: string[]
  onBadgesChange: (badges: string[]) => void
  selectedCourses: string[]
  onCoursesChange: (courses: string[]) => void
  starredOnly: boolean
  onStarredOnlyChange: (value: boolean) => void
  tags: Tag[]
  badges: BadgeType[]
  courses: Course[]
  colorVariants: ColorVariant[]
  className?: string
}

export function FilterBar({
  selectedTypes,
  onTypesChange,
  selectedTags,
  onTagsChange,
  selectedBadges,
  onBadgesChange,
  selectedCourses,
  onCoursesChange,
  starredOnly,
  onStarredOnlyChange,
  tags,
  badges,
  courses,
  colorVariants,
  className,
}: FilterBarProps) {
  const toggleType = (type: ResourceType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const toggleBadge = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      onBadgesChange(selectedBadges.filter(b => b !== badgeId))
    } else {
      onBadgesChange([...selectedBadges, badgeId])
    }
  }

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      onCoursesChange(selectedCourses.filter(c => c !== courseId))
    } else {
      onCoursesChange([...selectedCourses, courseId])
    }
  }

  const hasActiveFilters = 
    selectedTypes.length > 0 || 
    selectedTags.length > 0 || 
    selectedBadges.length > 0 || 
    selectedCourses.length > 0 || 
    starredOnly

  const clearAllFilters = () => {
    onTypesChange([])
    onTagsChange([])
    onBadgesChange([])
    onCoursesChange([])
    onStarredOnlyChange(false)
  }

  const activeFilterCount = 
    selectedTypes.length + 
    selectedTags.length + 
    selectedBadges.length + 
    selectedCourses.length + 
    (starredOnly ? 1 : 0)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
                selectedTypes.includes(type)
                  ? 'bg-[#3D5B78] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-[#8192A6] hover:text-white'
              )}
            >
              <ResourceTypeIcon type={type} size="sm" showBackground={false} className={cn(
                selectedTypes.includes(type) ? 'text-white' : 'text-muted-foreground'
              )} />
              {getResourceTypeLabel(type)}
            </button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block bg-border" />

        {/* Advanced Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md">
              <Filter className="h-4 w-4" />
              <span className="uppercase text-xs tracking-wider">More Filters</span>
              {activeFilterCount > selectedTypes.length && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-[#3D5B78] text-white rounded-md">
                  {activeFilterCount - selectedTypes.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card border-border rounded-md" align="start">
            <div className="space-y-4">
              {/* Starred Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#3D5B78]" />
                  <Label htmlFor="starred-only" className="text-xs uppercase tracking-wider">Featured only</Label>
                </div>
                <Switch
                  id="starred-only"
                  checked={starredOnly}
                  onCheckedChange={onStarredOnlyChange}
                />
              </div>

              <Separator className="bg-border" />

              {/* Tags */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-card-foreground">Tags</h4>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {tags.map((tag) => {
                    const variant = colorVariants.find(v => v.id === tag.colorVariantId)
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                          selectedTags.includes(tag.id)
                            ? 'ring-2 ring-offset-1 ring-[#3D5B78]'
                            : 'hover:opacity-80'
                        )}
                        style={{
                          backgroundColor: variant?.background || '#E2E8F0',
                          color: variant?.text || '#475569',
                          border: variant?.borderColor ? `1px solid ${variant.borderColor}` : undefined,
                        }}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Badges */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-card-foreground">Linked Badges</h4>
                <div className="space-y-2">
                  {badges.map(badge => (
                    <div key={badge.id} className="flex items-center gap-2">
                      <Checkbox
                        id={badge.id}
                        checked={selectedBadges.includes(badge.id)}
                        onCheckedChange={() => toggleBadge(badge.id)}
                      />
                      <Label htmlFor={badge.id} className="flex items-center gap-2 text-xs cursor-pointer text-card-foreground">
                        <span 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: badge.color }}
                        />
                        {badge.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Courses */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-card-foreground">Linked Courses</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center gap-2">
                      <Checkbox
                        id={course.id}
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <Label htmlFor={course.id} className="text-xs cursor-pointer text-card-foreground">
                        <span className="font-mono text-muted-foreground">{course.code}</span>
                        {' '}{course.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Starred Toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Switch
            id="starred-desktop"
            checked={starredOnly}
            onCheckedChange={onStarredOnlyChange}
          />
          <Label htmlFor="starred-desktop" className="flex items-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer text-card-foreground">
            <Star className={cn('h-4 w-4', starredOnly ? 'fill-[#3D5B78] text-[#3D5B78]' : 'text-muted-foreground')} />
            Featured
          </Label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-card-foreground hover:bg-card"
          >
            <X className="h-4 w-4 mr-1" />
            <span className="uppercase text-xs tracking-wider">Clear</span>
          </Button>
        )}
      </div>

      {/* Active Tag/Badge/Course Filters */}
      {(selectedTags.length > 0 || selectedBadges.length > 0 || selectedCourses.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map(tagId => {
            const tag = tags.find(t => t.id === tagId)
            if (!tag) return null
            return (
              <Badge
                key={tagId}
                className="gap-1 cursor-pointer rounded-md bg-[#3D5B78] text-white hover:bg-[#3D5B78]/90"
                onClick={() => toggleTag(tagId)}
              >
                {tag.name}
                <X className="h-3 w-3" />
              </Badge>
            )
          })}
          {selectedBadges.map(badgeId => {
            const badge = badges.find(b => b.id === badgeId)
            if (!badge) return null
            return (
              <Badge
                key={badgeId}
                className="gap-1 cursor-pointer rounded-md bg-[#8192A6] text-white hover:bg-[#8192A6]/90"
                onClick={() => toggleBadge(badgeId)}
              >
                {badge.name}
                <X className="h-3 w-3" />
              </Badge>
            )
          })}
          {selectedCourses.map(courseId => {
            const course = courses.find(c => c.id === courseId)
            if (!course) return null
            return (
              <Badge
                key={courseId}
                className="gap-1 cursor-pointer rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                onClick={() => toggleCourse(courseId)}
              >
                {course.code}
                <X className="h-3 w-3" />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
