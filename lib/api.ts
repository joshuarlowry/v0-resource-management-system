import type { 
  ColorVariant, 
  Tag, 
  Resource, 
  Badge, 
  Course,
  SiteSettings,
  CreateColorVariantInput,
  UpdateColorVariantInput,
  CreateTagInput,
  UpdateTagInput,
  CreateResourceInput,
  UpdateResourceInput,
  UpdateSiteSettingsInput,
} from './types'
import { 
  initialColorVariants, 
  initialTags, 
  initialResources, 
  badges as initialBadges, 
  courses as initialCourses,
  initialSiteSettings,
} from './data'

// In-memory stores - reset on page refresh
let colorVariants = [...initialColorVariants]
let tags = [...initialTags]
let resources = [...initialResources]
let badges = [...initialBadges]
let courses = [...initialCourses]
let siteSettings = { ...initialSiteSettings }

// Simulated network delay for realistic async behavior
const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ============================================
// Color Variants API
// ============================================
export const colorVariantsApi = {
  getAll: async (): Promise<ColorVariant[]> => {
    await delay(50)
    return [...colorVariants]
  },

  getById: async (id: string): Promise<ColorVariant | null> => {
    await delay(50)
    return colorVariants.find(v => v.id === id) || null
  },

  create: async (data: CreateColorVariantInput): Promise<ColorVariant> => {
    await delay(100)
    const newVariant: ColorVariant = {
      ...data,
      id: generateId('cv'),
    }
    colorVariants = [...colorVariants, newVariant]
    return newVariant
  },

  update: async (id: string, data: UpdateColorVariantInput): Promise<ColorVariant> => {
    await delay(100)
    const index = colorVariants.findIndex(v => v.id === id)
    if (index === -1) throw new Error('Color variant not found')
    
    colorVariants = colorVariants.map(v => 
      v.id === id ? { ...v, ...data } : v
    )
    return colorVariants[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay(100)
    // Check if variant is in use by any tags
    const inUse = tags.some(t => t.colorVariantId === id)
    if (inUse) {
      throw new Error('Cannot delete color variant that is in use by tags')
    }
    colorVariants = colorVariants.filter(v => v.id !== id)
  },

  // Get usage count for a variant
  getUsageCount: async (id: string): Promise<number> => {
    await delay(50)
    return tags.filter(t => t.colorVariantId === id).length
  },
}

// ============================================
// Tags API
// ============================================
export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    await delay(50)
    return [...tags]
  },

  getById: async (id: string): Promise<Tag | null> => {
    await delay(50)
    return tags.find(t => t.id === id) || null
  },

  create: async (data: CreateTagInput): Promise<Tag> => {
    await delay(100)
    // Validate that the color variant exists
    const variantExists = colorVariants.some(v => v.id === data.colorVariantId)
    if (!variantExists) {
      throw new Error('Invalid color variant ID')
    }
    
    const newTag: Tag = {
      ...data,
      id: generateId('tag'),
    }
    tags = [...tags, newTag]
    return newTag
  },

  update: async (id: string, data: UpdateTagInput): Promise<Tag> => {
    await delay(100)
    const index = tags.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Tag not found')
    
    // Validate color variant if being updated
    if (data.colorVariantId) {
      const variantExists = colorVariants.some(v => v.id === data.colorVariantId)
      if (!variantExists) {
        throw new Error('Invalid color variant ID')
      }
    }
    
    tags = tags.map(t => 
      t.id === id ? { ...t, ...data } : t
    )
    return tags.find(t => t.id === id)!
  },

  delete: async (id: string): Promise<void> => {
    await delay(100)
    // Check if tag is in use by any resources
    const inUse = resources.some(r => r.tags.includes(id))
    if (inUse) {
      throw new Error('Cannot delete tag that is in use by resources')
    }
    tags = tags.filter(t => t.id !== id)
  },

  // Get usage count for a tag
  getUsageCount: async (id: string): Promise<number> => {
    await delay(50)
    return resources.filter(r => r.tags.includes(id)).length
  },
}

// ============================================
// Resources API
// ============================================
export const resourcesApi = {
  getAll: async (): Promise<Resource[]> => {
    await delay(50)
    return [...resources]
  },

  getById: async (id: string): Promise<Resource | null> => {
    await delay(50)
    return resources.find(r => r.id === id) || null
  },

  create: async (data: CreateResourceInput): Promise<Resource> => {
    await delay(100)
    const now = new Date()
    const newResource: Resource = {
      ...data,
      id: generateId('res'),
      createdAt: now,
      updatedAt: now,
    }
    resources = [...resources, newResource]
    return newResource
  },

  update: async (id: string, data: UpdateResourceInput): Promise<Resource> => {
    await delay(100)
    const index = resources.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Resource not found')
    
    resources = resources.map(r => 
      r.id === id ? { ...r, ...data, updatedAt: new Date() } : r
    )
    return resources.find(r => r.id === id)!
  },

  delete: async (id: string): Promise<void> => {
    await delay(100)
    resources = resources.filter(r => r.id !== id)
  },

  toggleStar: async (id: string): Promise<Resource> => {
    await delay(100)
    const resource = resources.find(r => r.id === id)
    if (!resource) throw new Error('Resource not found')
    
    resources = resources.map(r => 
      r.id === id ? { ...r, isStarred: !r.isStarred, updatedAt: new Date() } : r
    )
    return resources.find(r => r.id === id)!
  },

  bulkStar: async (ids: string[]): Promise<void> => {
    await delay(100)
    resources = resources.map(r => 
      ids.includes(r.id) ? { ...r, isStarred: true, updatedAt: new Date() } : r
    )
  },

  bulkUnstar: async (ids: string[]): Promise<void> => {
    await delay(100)
    resources = resources.map(r => 
      ids.includes(r.id) ? { ...r, isStarred: false, updatedAt: new Date() } : r
    )
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await delay(100)
    resources = resources.filter(r => !ids.includes(r.id))
  },
}

// ============================================
// Badges API (Read-only for now)
// ============================================
export const badgesApi = {
  getAll: async (): Promise<Badge[]> => {
    await delay(50)
    return [...badges]
  },

  getById: async (id: string): Promise<Badge | null> => {
    await delay(50)
    return badges.find(b => b.id === id) || null
  },
}

// ============================================
// Courses API (Read-only for now)
// ============================================
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    await delay(50)
    return [...courses]
  },

  getById: async (id: string): Promise<Course | null> => {
    await delay(50)
    return courses.find(c => c.id === id) || null
  },
}

// ============================================
// Site Settings API
// ============================================
export const siteSettingsApi = {
  get: async (): Promise<SiteSettings> => {
    await delay(50)
    return { ...siteSettings }
  },

  update: async (data: UpdateSiteSettingsInput): Promise<SiteSettings> => {
    await delay(100)
    siteSettings = { ...siteSettings, ...data }
    return { ...siteSettings }
  },
}

// ============================================
// Reset function (for testing)
// ============================================
export const resetAllData = async (): Promise<void> => {
  await delay(50)
  colorVariants = [...initialColorVariants]
  tags = [...initialTags]
  resources = [...initialResources]
  badges = [...initialBadges]
  courses = [...initialCourses]
  siteSettings = { ...initialSiteSettings }
}
