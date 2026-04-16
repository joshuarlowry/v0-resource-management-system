"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { 
  Resource, 
  Tag, 
  Badge, 
  Course, 
  ColorVariant,
  SiteSettings,
  ResourceWithRelations,
  CreateColorVariantInput,
  UpdateColorVariantInput,
  CreateTagInput,
  UpdateTagInput,
  CreateResourceInput,
  UpdateResourceInput,
  UpdateSiteSettingsInput,
} from './types'
import { 
  colorVariantsApi, 
  tagsApi, 
  resourcesApi, 
  badgesApi, 
  coursesApi,
  siteSettingsApi,
} from './api'

interface ResourcesContextType {
  // Data
  resources: Resource[]
  tags: Tag[]
  badges: Badge[]
  courses: Course[]
  colorVariants: ColorVariant[]
  siteSettings: SiteSettings
  isLoading: boolean
  
  // Relation helpers
  getResourceWithRelations: (id: string) => ResourceWithRelations | null
  getResourcesWithRelations: () => ResourceWithRelations[]
  getColorVariant: (id: string) => ColorVariant | undefined
  getTagWithColor: (tagId: string) => (Tag & { colorVariant: ColorVariant | undefined }) | null
  
  // Color Variant mutations
  addColorVariant: (data: CreateColorVariantInput) => Promise<ColorVariant>
  updateColorVariant: (id: string, data: UpdateColorVariantInput) => Promise<ColorVariant>
  deleteColorVariant: (id: string) => Promise<void>
  getColorVariantUsageCount: (id: string) => number
  
  // Tag mutations
  addTag: (data: CreateTagInput) => Promise<Tag>
  updateTag: (id: string, data: UpdateTagInput) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  getTagUsageCount: (id: string) => number
  
  // Resource mutations
  addResource: (data: CreateResourceInput) => Promise<Resource>
  updateResource: (id: string, data: UpdateResourceInput) => Promise<Resource>
  deleteResource: (id: string) => Promise<void>
  toggleStar: (id: string) => Promise<Resource>
  bulkStar: (ids: string[]) => Promise<void>
  bulkUnstar: (ids: string[]) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  
  // Site Settings mutations
  updateSiteSettings: (data: UpdateSiteSettingsInput) => Promise<SiteSettings>
}

const ResourcesContext = createContext<ResourcesContextType | null>(null)

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ title: 'CAREER', description: '' })
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [
          loadedColorVariants,
          loadedTags,
          loadedResources,
          loadedBadges,
          loadedCourses,
          loadedSiteSettings,
        ] = await Promise.all([
          colorVariantsApi.getAll(),
          tagsApi.getAll(),
          resourcesApi.getAll(),
          badgesApi.getAll(),
          coursesApi.getAll(),
          siteSettingsApi.get(),
        ])
        
        setColorVariants(loadedColorVariants)
        setTags(loadedTags)
        setResources(loadedResources)
        setBadges(loadedBadges)
        setCourses(loadedCourses)
        setSiteSettings(loadedSiteSettings)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Helper functions
  const getBadgeById = useCallback((id: string) => badges.find(b => b.id === id), [badges])
  const getCourseById = useCallback((id: string) => courses.find(c => c.id === id), [courses])
  
  const getColorVariant = useCallback((id: string) => {
    return colorVariants.find(v => v.id === id)
  }, [colorVariants])

  const getTagWithColor = useCallback((tagId: string) => {
    const tag = tags.find(t => t.id === tagId)
    if (!tag) return null
    return {
      ...tag,
      colorVariant: colorVariants.find(v => v.id === tag.colorVariantId),
    }
  }, [tags, colorVariants])

  const getResourceWithRelations = useCallback((id: string): ResourceWithRelations | null => {
    const resource = resources.find(r => r.id === id)
    if (!resource) return null

    const { linkedBadgeIds, linkedCourseIds, ...rest } = resource
    return {
      ...rest,
      linkedBadges: linkedBadgeIds.map(getBadgeById).filter(Boolean) as Badge[],
      linkedCourses: linkedCourseIds.map(getCourseById).filter(Boolean) as Course[],
    }
  }, [resources, getBadgeById, getCourseById])

  const getResourcesWithRelations = useCallback((): ResourceWithRelations[] => {
    return resources.map(resource => {
      const { linkedBadgeIds, linkedCourseIds, ...rest } = resource
      return {
        ...rest,
        linkedBadges: linkedBadgeIds.map(getBadgeById).filter(Boolean) as Badge[],
        linkedCourses: linkedCourseIds.map(getCourseById).filter(Boolean) as Course[],
      }
    })
  }, [resources, getBadgeById, getCourseById])

  // Usage count helpers
  const getColorVariantUsageCount = useCallback((id: string) => {
    return tags.filter(t => t.colorVariantId === id).length
  }, [tags])

  const getTagUsageCount = useCallback((id: string) => {
    return resources.filter(r => r.tags.includes(id)).length
  }, [resources])

  // Color Variant mutations
  const addColorVariant = useCallback(async (data: CreateColorVariantInput) => {
    const newVariant = await colorVariantsApi.create(data)
    setColorVariants(prev => [...prev, newVariant])
    return newVariant
  }, [])

  const updateColorVariant = useCallback(async (id: string, data: UpdateColorVariantInput) => {
    const updated = await colorVariantsApi.update(id, data)
    setColorVariants(prev => prev.map(v => v.id === id ? updated : v))
    return updated
  }, [])

  const deleteColorVariant = useCallback(async (id: string) => {
    await colorVariantsApi.delete(id)
    setColorVariants(prev => prev.filter(v => v.id !== id))
  }, [])

  // Tag mutations
  const addTag = useCallback(async (data: CreateTagInput) => {
    const newTag = await tagsApi.create(data)
    setTags(prev => [...prev, newTag])
    return newTag
  }, [])

  const updateTag = useCallback(async (id: string, data: UpdateTagInput) => {
    const updated = await tagsApi.update(id, data)
    setTags(prev => prev.map(t => t.id === id ? updated : t))
    return updated
  }, [])

  const deleteTag = useCallback(async (id: string) => {
    await tagsApi.delete(id)
    setTags(prev => prev.filter(t => t.id !== id))
    // Also remove the tag from all resources
    setResources(prev => prev.map(r => ({
      ...r,
      tags: r.tags.filter(tagId => tagId !== id)
    })))
  }, [])

  // Resource mutations
  const addResource = useCallback(async (data: CreateResourceInput) => {
    const newResource = await resourcesApi.create(data)
    setResources(prev => [...prev, newResource])
    return newResource
  }, [])

  const updateResource = useCallback(async (id: string, data: UpdateResourceInput) => {
    const updated = await resourcesApi.update(id, data)
    setResources(prev => prev.map(r => r.id === id ? updated : r))
    return updated
  }, [])

  const deleteResource = useCallback(async (id: string) => {
    await resourcesApi.delete(id)
    setResources(prev => prev.filter(r => r.id !== id))
  }, [])

  const toggleStar = useCallback(async (id: string) => {
    const updated = await resourcesApi.toggleStar(id)
    setResources(prev => prev.map(r => r.id === id ? updated : r))
    return updated
  }, [])

  const bulkStar = useCallback(async (ids: string[]) => {
    await resourcesApi.bulkStar(ids)
    setResources(prev => prev.map(r => 
      ids.includes(r.id) ? { ...r, isStarred: true } : r
    ))
  }, [])

  const bulkUnstar = useCallback(async (ids: string[]) => {
    await resourcesApi.bulkUnstar(ids)
    setResources(prev => prev.map(r => 
      ids.includes(r.id) ? { ...r, isStarred: false } : r
    ))
  }, [])

  const bulkDelete = useCallback(async (ids: string[]) => {
    await resourcesApi.bulkDelete(ids)
    setResources(prev => prev.filter(r => !ids.includes(r.id)))
  }, [])

  // Site Settings mutations
  const updateSiteSettings = useCallback(async (data: UpdateSiteSettingsInput) => {
    const updated = await siteSettingsApi.update(data)
    setSiteSettings(updated)
    return updated
  }, [])

  return (
    <ResourcesContext.Provider value={{
      resources,
      tags,
      badges,
      courses,
      colorVariants,
      siteSettings,
      isLoading,
      getResourceWithRelations,
      getResourcesWithRelations,
      getColorVariant,
      getTagWithColor,
      addColorVariant,
      updateColorVariant,
      deleteColorVariant,
      getColorVariantUsageCount,
      addTag,
      updateTag,
      deleteTag,
      getTagUsageCount,
      addResource,
      updateResource,
      deleteResource,
      toggleStar,
      bulkStar,
      bulkUnstar,
      bulkDelete,
      updateSiteSettings,
    }}>
      {children}
    </ResourcesContext.Provider>
  )
}

export function useResources() {
  const context = useContext(ResourcesContext)
  if (!context) {
    throw new Error('useResources must be used within a ResourcesProvider')
  }
  return context
}
