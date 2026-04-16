"use client"

import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { format, isToday, isTomorrow, isThisWeek, isThisYear } from 'date-fns'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'

interface EventListProps {
  events: ResourceWithRelations[]
  tags: Tag[]
}

function groupEventsByDate(events: ResourceWithRelations[]): Map<string, ResourceWithRelations[]> {
  const groups = new Map<string, ResourceWithRelations[]>()
  const sorted = [...events].sort((a, b) => {
    const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
    const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
    return aDate - bDate
  })
  sorted.forEach((event) => {
    if (!event.startDate) return
    const key = format(new Date(event.startDate), 'yyyy-MM-dd')
    groups.set(key, [...(groups.get(key) || []), event])
  })
  return groups
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isThisWeek(date)) return format(date, 'EEEE')
  if (isThisYear(date)) return format(date, 'EEEE, MMMM d')
  return format(date, 'EEEE, MMMM d, yyyy')
}

export function EventList({ events, tags }: EventListProps) {
  const groups = groupEventsByDate(events)

  if (events.length === 0) {
    return (
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
          <Clock size={32} color="var(--mui-palette-text-secondary)" />
        </Box>
        <Typography variant="overline" component="h3" sx={{ display: 'block', mb: 0.5 }}>
          No events found
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: 360, mx: 'auto' }}>
          There are no events matching your current filters.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack spacing={3}>
      {Array.from(groups.entries()).map(([dateKey, dateEvents]) => (
        <Box key={dateKey}>
          <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2, borderRadius: 1, mb: 1.5 }}>
            <Typography
              variant="overline"
              component="h3"
              sx={{ color: 'common.white', display: 'block', textAlign: 'center' }}
            >
              {formatDateHeader(dateKey)}
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            {dateEvents.map((event) => {
              const eventTags = event.tags
                .map((tagId) => tags.find((t) => t.id === tagId))
                .filter(Boolean) as Tag[]
              const startTime = event.startDate ? format(new Date(event.startDate), 'h:mm a') : null
              const endTime =
                event.endDate
                && event.startDate
                && new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString()
                  ? format(new Date(event.endDate), 'h:mm a')
                  : null

              return (
                <Card
                  key={event.id}
                  sx={{
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 12px rgba(26, 38, 52, 0.1)' },
                    ...(event.isStarred && {
                      outline: '2px solid',
                      outlineColor: 'accent.main',
                      outlineOffset: -2,
                      bgcolor: 'rgba(165, 205, 224, 0.1)',
                    }),
                  }}
                >
                  <CardActionArea component={Link} href={`/resources/${event.id}`} sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="flex-start">
                      <Box sx={{ width: { xs: 64, sm: 80 }, flexShrink: 0, textAlign: 'right' }}>
                        {startTime && (
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {startTime}
                          </Typography>
                        )}
                        {endTime && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {endTime}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ width: '1px', height: 56, bgcolor: 'divider', flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {event.title}
                          </Typography>
                          {event.isStarred && (
                            <Box sx={{ flexShrink: 0 }}>
                              <Star size={16} fill="#3D5B78" color="#3D5B78" />
                            </Box>
                          )}
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 0.25,
                          }}
                        >
                          {event.description}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                          {eventTags.length > 0 && (
                            <Stack direction="row" spacing={0.5}>
                              {eventTags.slice(0, 2).map((tag) => (
                                <TagBadge
                                  key={tag.id}
                                  name={tag.name}
                                  colorVariantId={tag.colorVariantId}
                                  size="sm"
                                />
                              ))}
                            </Stack>
                          )}
                          <EntityLinks badges={event.linkedBadges} courses={event.linkedCourses} />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardActionArea>
                </Card>
              )
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
