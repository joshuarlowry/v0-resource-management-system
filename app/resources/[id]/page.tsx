"use client"

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Clock, ExternalLink, Download, Award, BookOpen, CalendarPlus } from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { format } from 'date-fns'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { TagBadge } from '@/components/resources/tag-badge'

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        <Typography variant="overline" sx={{ color: 'common.white', display: 'block' }}>
          {children}
        </Typography>
      </Stack>
    </Box>
  )
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = use(params)
  const { getResourceWithRelations, tags } = useResources()
  const resource = getResourceWithRelations(id)
  if (!resource) notFound()

  const resourceTags = resource.tags
    .map((tagId) => tags.find((t) => t.id === tagId))
    .filter(Boolean)

  const formatEventDate = () => {
    if (resource.type !== 'event' || !resource.startDate) return null
    const start = new Date(resource.startDate)
    const end = resource.endDate ? new Date(resource.endDate) : null

    if (end && start.toDateString() !== end.toDateString()) {
      return {
        start: format(start, 'EEEE, MMMM d, yyyy'),
        end: format(end, 'EEEE, MMMM d, yyyy'),
        multiDay: true as const,
      }
    }
    const startTime = format(start, 'h:mm a')
    const endTime = end ? format(end, 'h:mm a') : null
    return {
      date: format(start, 'EEEE, MMMM d, yyyy'),
      time: endTime ? `${startTime} - ${endTime}` : startTime,
      multiDay: false as const,
    }
  }

  const eventDate = formatEventDate()
  const actionUrl = resource.url ?? resource.fileUrl ?? null

  return (
    <AppShell title="Resource Details">
      <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Box>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              size="small"
              startIcon={<ArrowLeft size={16} />}
              sx={{
                bgcolor: 'grey.100',
                color: 'text.secondary',
                borderColor: 'grey.200',
                '&:hover': { bgcolor: 'secondary.main', color: 'common.white', borderColor: 'secondary.main' },
              }}
            >
              Back to Browse
            </Button>
          </Box>

          {/* Header card */}
          <Paper
            sx={{
              overflow: 'hidden',
              ...(resource.isStarred && { outline: '2px solid', outlineColor: 'accent.main', outlineOffset: -2 }),
            }}
          >
            <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2, position: 'relative' }}>
              <Typography variant="overline" sx={{ color: 'common.white', display: 'block', textAlign: 'center' }}>
                {getResourceTypeLabel(resource.type)}
              </Typography>
              {resource.isStarred && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <Star size={14} fill="#ffffff" color="#ffffff" />
                  <Typography variant="overline" sx={{ color: 'common.white' }}>Featured</Typography>
                </Stack>
              )}
            </Box>
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: resource.isStarred ? 'rgba(165, 205, 224, 0.1)' : 'transparent' }}>
              <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="flex-start">
                <ResourceTypeIcon type={resource.type} size="lg" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700, mb: { xs: 1, sm: 1.5 }, textWrap: 'balance' as 'balance' }}
                  >
                    {resource.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {resource.description}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            }}
          >
            {/* Main column */}
            <Stack spacing={3}>
              {resource.type === 'event' && eventDate && (
                <Paper sx={{ overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: 'common.white' }}>
                      <Clock size={16} />
                      <Typography variant="overline" sx={{ color: 'inherit' }}>Event Details</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {eventDate.multiDay ? (
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Starts:</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{eventDate.start}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Ends:</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{eventDate.end}</Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Date:</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{eventDate.date}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Time:</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{eventDate.time}</Typography>
                        </Box>
                      </Stack>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<CalendarPlus size={16} />}
                      sx={{ mt: 2, bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
                    >
                      Add to Calendar
                    </Button>
                  </Box>
                </Paper>
              )}

              {actionUrl && (
                <Paper sx={{ overflow: 'hidden' }}>
                  <SectionHeader>{resource.url ? 'External Link' : 'Download'}</SectionHeader>
                  <Box sx={{ p: 2 }}>
                    <Button
                      component="a"
                      href={actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={resource.url ? <ExternalLink size={16} /> : <Download size={16} />}
                      sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
                    >
                      {resource.url ? 'Open Link' : 'Download File'}
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary', mt: 1, wordBreak: 'break-all' }}
                    >
                      {actionUrl}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {resource.linkedBadges.length > 0 && (
                <Paper sx={{ overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: 'common.white' }}>
                      <Award size={16} />
                      <Typography variant="overline" sx={{ color: 'inherit' }}>Linked Badges</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" flexWrap="wrap" gap={1.5}>
                      {resource.linkedBadges.map((badge) => (
                        <Box
                          key={badge.id}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {badge.name}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              )}

              {resource.linkedCourses.length > 0 && (
                <Paper sx={{ overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: 'common.white' }}>
                      <BookOpen size={16} />
                      <Typography variant="overline" sx={{ color: 'inherit' }}>Linked Courses</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                      {resource.linkedCourses.map((course) => (
                        <Box
                          key={course.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1.5,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                              {course.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'grey.500', fontFamily: 'var(--font-geist-mono), monospace' }}
                            >
                              {course.code}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              )}
            </Stack>

            {/* Sidebar */}
            <Stack spacing={3}>
              {resourceTags.length > 0 && (
                <Paper sx={{ overflow: 'hidden' }}>
                  <SectionHeader>Tags</SectionHeader>
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {resourceTags.map(
                        (tag) =>
                          tag && (
                            <TagBadge
                              key={tag.id}
                              name={tag.name}
                              colorVariantId={tag.colorVariantId}
                              size="md"
                            />
                          )
                      )}
                    </Stack>
                  </Box>
                </Paper>
              )}

              <Paper sx={{ overflow: 'hidden' }}>
                <SectionHeader>Details</SectionHeader>
                <Stack sx={{ p: 2 }} spacing={2}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>Created</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {format(new Date(resource.createdAt), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>Last Updated</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {format(new Date(resource.updatedAt), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {resource.type}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </AppShell>
  )
}
