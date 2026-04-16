"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TagBadge } from './tag-badge'
import type { Resource, ResourceType, Tag, Badge, Course } from '@/lib/types'
import { getResourceTypeLabel } from './resource-type-icon'

const RESOURCE_TYPES: ResourceType[] = ['document', 'video', 'link', 'event', 'image', 'audio']

interface ResourceFormProps {
  resource?: Resource
  tags: Tag[]
  badges: Badge[]
  courses: Course[]
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function ResourceForm({
  resource,
  tags,
  badges,
  courses,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const [title, setTitle] = useState(resource?.title ?? '')
  const [description, setDescription] = useState(resource?.description ?? '')
  const [type, setType] = useState<ResourceType>(resource?.type ?? 'document')
  const [url, setUrl] = useState(resource?.url ?? '')
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(resource?.tags ?? [])
  const [selectedBadges, setSelectedBadges] = useState<string[]>(resource?.linkedBadgeIds ?? [])
  const [selectedCourses, setSelectedCourses] = useState<string[]>(resource?.linkedCourseIds ?? [])
  const [isStarred, setIsStarred] = useState(resource?.isStarred ?? false)
  const [startDate, setStartDate] = useState(
    resource?.startDate ? new Date(resource.startDate).toISOString().slice(0, 16) : ''
  )
  const [endDate, setEndDate] = useState(
    resource?.endDate ? new Date(resource.endDate).toISOString().slice(0, 16) : ''
  )

  const showUrlField = ['video', 'link', 'audio'].includes(type)
  const showFileField = ['document', 'image', 'audio'].includes(type)
  const showEventFields = type === 'event'

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges(prev =>
      prev.includes(badgeId)
        ? prev.filter(b => b !== badgeId)
        : [...prev, badgeId]
    )
  }

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSubmit({
      title,
      description,
      type,
      url: showUrlField ? url : undefined,
      fileUrl: showFileField ? fileUrl : undefined,
      tags: selectedTags,
      linkedBadgeIds: selectedBadges,
      linkedCourseIds: selectedCourses,
      isStarred,
      startDate: showEventFields && startDate ? new Date(startDate) : undefined,
      endDate: showEventFields && endDate ? new Date(endDate) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter resource description"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  {getResourceTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* URL/File Fields */}
      <div className="space-y-4">
        {showUrlField && (
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/resource"
            />
          </div>
        )}

        {showFileField && (
          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="/files/document.pdf"
            />
            <p className="text-xs text-muted-foreground">
              Enter the path to the file (file upload coming soon)
            </p>
          </div>
        )}
      </div>

      {/* Event Fields */}
      {showEventFields && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Event Details</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Tags */}
      <div className="space-y-3">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className="transition-transform hover:scale-105"
            >
              <TagBadge 
                name={tag.name} 
                colorVariantId={tag.colorVariantId}
                size="md"
                className={selectedTags.includes(tag.id) ? 'ring-2 ring-offset-1' : 'opacity-60'}
              />
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Linked Badges */}
      <div className="space-y-3">
        <Label>Link to Badges</Label>
        <div className="space-y-2">
          {badges.map(badge => (
            <div key={badge.id} className="flex items-center gap-2">
              <Checkbox
                id={`badge-${badge.id}`}
                checked={selectedBadges.includes(badge.id)}
                onCheckedChange={() => toggleBadge(badge.id)}
              />
              <Label 
                htmlFor={`badge-${badge.id}`} 
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <span 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: badge.color }}
                />
                {badge.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Linked Courses */}
      <div className="space-y-3">
        <Label>Link to Courses</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {courses.map(course => (
            <div key={course.id} className="flex items-center gap-2">
              <Checkbox
                id={`course-${course.id}`}
                checked={selectedCourses.includes(course.id)}
                onCheckedChange={() => toggleCourse(course.id)}
              />
              <Label 
                htmlFor={`course-${course.id}`} 
                className="text-sm cursor-pointer"
              >
                <span className="font-mono text-muted-foreground">{course.code}</span>
                {' '}{course.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Featured Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="starred">Featured Resource</Label>
          <p className="text-sm text-muted-foreground">
            Featured resources are highlighted in search results
          </p>
        </div>
        <Switch
          id="starred"
          checked={isStarred}
          onCheckedChange={setIsStarred}
        />
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {resource ? 'Save Changes' : 'Create Resource'}
        </Button>
      </div>
    </form>
  )
}
