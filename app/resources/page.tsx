"use client"

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { X, ArrowLeft, Search, Grid2X2, List } from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { SearchInput } from '@/components/resources/search-input'
import { FilterBar } from '@/components/resources/filter-bar'
import { ResourceCard } from '@/components/resources/resource-card'
import type { ResourceType } from '@/lib/types'

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Browse Resources">
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>Loading...</Typography>
          </Paper>
        </AppShell>
      }
    >
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const tagParam = searchParams.get('tag')
  const searchParam = searchParams.get('search')

  useEffect(() => {
    if (tagParam) setSelectedTags([tagParam])
  }, [tagParam])

  useEffect(() => {
    if (searchParam) setSearchQuery(searchParam)
  }, [searchParam])

  const activeCategoryTag = tagParam ? tags.find((t) => t.id === tagParam) : null
  const activeCategoryColor = activeCategoryTag ? getColorVariant(activeCategoryTag.colorVariantId) : null

  const clearCategoryFilter = () => {
    setSelectedTags([])
    router.push('/resources')
  }

  const resources = getResourcesWithRelations()

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const hitTitle = resource.title.toLowerCase().includes(q)
        const hitDesc = resource.description.toLowerCase().includes(q)
        const hitTag = resource.tags.some((tagId) => tags.find((t) => t.id === tagId)?.name.toLowerCase().includes(q))
        const hitBadge = resource.linkedBadges.some((b) => b.name.toLowerCase().includes(q))
        const hitCourse = resource.linkedCourses.some(
          (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        )
        if (!hitTitle && !hitDesc && !hitTag && !hitBadge && !hitCourse) return false
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) return false
      if (selectedTags.length > 0 && !selectedTags.some((id) => resource.tags.includes(id))) return false
      if (selectedBadges.length > 0 && !selectedBadges.some((id) => resource.linkedBadges.some((b) => b.id === id))) return false
      if (selectedCourses.length > 0 && !selectedCourses.some((id) => resource.linkedCourses.some((c) => c.id === id))) return false
      if (starredOnly && !resource.isStarred) return false
      return true
    })
  }, [resources, searchQuery, selectedTypes, selectedTags, selectedBadges, selectedCourses, starredOnly, tags])

  const sortedResources = useMemo(
    () =>
      [...filteredResources].sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1
        if (!a.isStarred && b.isStarred) return 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }),
    [filteredResources]
  )

  return (
    <AppShell title={activeCategoryTag ? `${activeCategoryTag.name} Resources` : 'Browse Resources'}>
      <Stack spacing={3}>
        <Paper sx={{ py: 1, px: 2 }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, tags, badges, courses..."
          />
        </Paper>

        <Paper sx={{ py: 1.5, px: 2 }}>
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
        </Paper>

        {activeCategoryTag && (
          <Box
            sx={{
              borderRadius: 1,
              p: 1.5,
              px: 2,
              bgcolor: activeCategoryColor?.background || '#3D5B78',
              color: activeCategoryColor?.text || '#fff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                component={Link}
                href="/"
                sx={{ color: 'inherit', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, p: 0.5 }}
                aria-label="Back home"
              >
                <ArrowLeft size={16} />
              </IconButton>
              <Box>
                <Typography variant="overline" component="h2" sx={{ color: 'inherit', display: 'block', fontSize: '0.65rem' }}>
                  {activeCategoryTag.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.7rem' }}>
                  Showing all resources in this category
                </Typography>
              </Box>
            </Stack>
            <Button
              size="small"
              variant="text"
              startIcon={<X size={12} />}
              onClick={clearCategoryFilter}
              sx={{ color: 'inherit', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, fontSize: '0.7rem', py: 0.5, px: 1 }}
            >
              Clear Filter
            </Button>
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'secondary.main',
            fontSize: '0.6875rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            {sortedResources.length} RESOURCES FOUND
            {searchQuery && ` FOR "${searchQuery}"`}
          </span>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                color: viewMode === 'list' ? 'accent.main' : 'text.secondary',
                border: '1px solid',
                borderColor: viewMode === 'list' ? 'accent.main' : 'divider',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
              }}
              aria-label="List view"
            >
              <List size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                color: viewMode === 'grid' ? 'accent.main' : 'text.secondary',
                border: '1px solid',
                borderColor: viewMode === 'grid' ? 'accent.main' : 'divider',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
              }}
              aria-label="Grid view"
            >
              <Grid2X2 size={16} />
            </IconButton>
          </Stack>
        </Typography>

        {sortedResources.length > 0 ? (
          viewMode === 'list' ? (
            <Stack spacing={1.5}>
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} tags={tags} variant="list" />
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                },
              }}
            >
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} tags={tags} variant="grid" />
              ))}
            </Box>
          )
        ) : (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Search size={32} color="var(--mui-palette-text-secondary)" />
            </Box>
            <Typography variant="overline" component="h3" sx={{ display: 'block', mb: 0.5 }}>
              No resources found
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: 360, mx: 'auto' }}>
              Try adjusting your search or filters to find what you&apos;re looking for.
            </Typography>
          </Paper>
        )}
      </Stack>
    </AppShell>
  )
}
