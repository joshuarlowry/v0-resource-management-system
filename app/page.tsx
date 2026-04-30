"use client"

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { SearchInput } from '@/components/resources/search-input'

export default function HomePage() {
  const { getResourcesWithRelations, tags, getColorVariant } = useResources()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allResources = getResourcesWithRelations()

  const featuredResources = useMemo(
    () =>
      allResources
        .filter((r) => r.isStarred)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [allResources]
  )

  const allCategoriesWithResources = useMemo(() => {
    return tags
      .map((tag) => {
        const tagResources = allResources.filter((r) => r.tags.includes(tag.id))
        return { tag, resources: tagResources, count: tagResources.length }
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [tags, allResources])

  const topCategories = useMemo(() => {
    return allCategoriesWithResources.slice(0, 4)
  }, [allCategoriesWithResources])

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      })
    }
  }

  return (
    <AppShell title="Home">
      <Stack spacing={4}>
        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all resources..."
        />

        {/* Category Filter Menu - Show All Categories */}
        {allCategoriesWithResources.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component={Link}
              href="/resources"
              sx={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'accent.main',
                fontWeight: 500,
                textDecoration: 'none',
                px: 1.5,
                py: 0.75,
                borderRadius: 0.5,
                border: '1px solid',
                borderColor: 'accent.main',
                bgcolor: 'rgba(61, 91, 120, 0.08)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'accent.main',
                  color: 'common.white',
                  borderColor: 'accent.main',
                },
              }}
            >
              All Categories
            </Box>
            {allCategoriesWithResources.map(({ tag }) => (
              <Box
                key={tag.id}
                component={Link}
                href={`/resources?tag=${tag.id}`}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                  fontWeight: 500,
                  textDecoration: 'none',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'text.primary',
                    color: 'text.primary',
                    bgcolor: 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                {tag.name}
              </Box>
            ))}
          </Box>
        )}

        {/* Featured */}
        {featuredResources.length > 0 && (
          <Box component="section">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Star size={16} fill="#3D5B78" color="#3D5B78" />
                <Typography variant="overline" component="h2">Featured Resources</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll featured left"
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll featured right"
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <ChevronRight size={16} />
                </IconButton>
              </Stack>
            </Stack>

            <Box
              ref={carouselRef}
              className="scrollbar-hide"
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 0.5,
                scrollSnapType: 'x mandatory',
              }}
            >
              {featuredResources.map((resource) => (
                <Box
                  key={resource.id}
                  component={Link}
                  href={`/resources/${resource.id}`}
                  sx={{
                    flexShrink: 0,
                    width: { xs: 180, sm: 220 },
                    scrollSnapAlign: 'start',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Paper
                    sx={{
                      height: '100%',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: '0 4px 12px rgba(26, 38, 52, 0.1)' },
                    }}
                  >
                    <Box
                      sx={{
                        height: { xs: 112, sm: 128 },
                        background: 'linear-gradient(135deg, #3D5B78 0%, #8192A6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      <ResourceTypeIcon type={resource.type} size="lg" showBackground={false} color="rgba(255,255,255,0.8)" />
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Star size={16} fill="#ffffff" color="#ffffff" />
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 0.5, fontSize: { xs: '0.625rem', sm: '0.6875rem' } }}>
                        {getResourceTypeLabel(resource.type)}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {resource.title}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Browse Categories */}
        <Box component="section">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="overline" component="h2">Browse Categories</Typography>
            <Box
              component={Link}
              href="/resources"
              sx={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'accent.main',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { color: 'accent.light' },
              }}
            >
              See All
              <ArrowRight size={12} />
            </Box>
          </Stack>

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
            {topCategories.map(({ tag, resources: catResources, count }) => {
              const colorVariant = getColorVariant(tag.colorVariantId)
              const previewResources = catResources
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 4)

              return (
                <Paper key={tag.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Header */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor: colorVariant?.background || '#3D5B78',
                      color: colorVariant?.text || '#fff',
                    }}
                  >
                    <Box
                      sx={{
                        height: 36,
                        width: 36,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'inherit' }}>
                        {tag.name.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="overline"
                        component="h3"
                        sx={{
                          display: 'block',
                          color: 'inherit',
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tag.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'inherit',
                          opacity: 0.8,
                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                        }}
                      >
                        {count} resource{count !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Body */}
                  <Stack sx={{ p: { xs: 1.5, sm: 2 }, flex: 1 }}>
                    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0, flex: 1 }}>
                      {previewResources.map((resource) => (
                        <Box component="li" key={resource.id}>
                          <Stack
                            component={Link}
                            href={`/resources/${resource.id}`}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              textDecoration: 'none',
                              color: 'text.secondary',
                              '&:hover': { color: 'text.primary' },
                            }}
                          >
                            <ResourceTypeIcon type={resource.type} size="sm" />
                            <Typography
                              variant="caption"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                color: 'inherit',
                              }}
                            >
                              {resource.title}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                    <Divider sx={{ mt: 1.5, mb: 1.5 }} />
                    <Box
                      component={Link}
                      href={`/resources?tag=${tag.id}`}
                      sx={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'accent.main',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': { color: 'accent.light' },
                      }}
                    >
                      See All Resources
                    </Box>
                  </Stack>
                </Paper>
              )
            })}
          </Box>

          {topCategories.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                No categories with resources yet
              </Typography>
            </Paper>
          )}
        </Box>

        {/* See All */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <Button
            component={Link}
            href="/resources"
            variant="outlined"
            endIcon={<ArrowRight size={16} />}
            sx={{
              bgcolor: 'background.paper',
              borderColor: 'divider',
              color: 'text.secondary',
              px: 4,
              '&:hover': {
                bgcolor: 'accent.main',
                color: 'common.white',
                borderColor: 'accent.main',
              },
            }}
          >
            See All Categories
          </Button>
        </Box>
      </Stack>
    </AppShell>
  )
}
