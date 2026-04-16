export type ResourceType = 'document' | 'video' | 'link' | 'event' | 'image' | 'audio'

export interface ColorVariant {
  id: string
  name: string
  background: string
  text: string
  borderColor?: string
}

export interface Badge {
  id: string
  name: string
  color: string
}

export interface Course {
  id: string
  name: string
  code: string
}

export interface Tag {
  id: string
  name: string
  colorVariantId: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  url?: string
  fileUrl?: string
  tags: string[]
  linkedBadgeIds: string[]
  linkedCourseIds: string[]
  isStarred: boolean
  createdAt: Date
  updatedAt: Date
  startDate?: Date
  endDate?: Date
}

export interface ResourceWithRelations extends Omit<Resource, 'linkedBadgeIds' | 'linkedCourseIds'> {
  linkedBadges: Badge[]
  linkedCourses: Course[]
}

// Input types for API operations
export type CreateColorVariantInput = Omit<ColorVariant, 'id'>
export type UpdateColorVariantInput = Partial<Omit<ColorVariant, 'id'>>

export type CreateTagInput = Omit<Tag, 'id'>
export type UpdateTagInput = Partial<Omit<Tag, 'id'>>

export type CreateResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateResourceInput = Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>

// Site Settings
export interface SiteSettings {
  title: string
  description: string
}

export type UpdateSiteSettingsInput = Partial<SiteSettings>
