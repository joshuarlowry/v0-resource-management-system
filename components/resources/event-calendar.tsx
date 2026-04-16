"use client"

import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'

interface EventCalendarProps {
  events: ResourceWithRelations[]
  tags: Tag[]
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export function EventCalendar({ events, tags }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date) =>
    events.filter((e) => {
      if (!e.startDate) return false
      const start = new Date(e.startDate)
      const end = e.endDate ? new Date(e.endDate) : start
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString())
    })

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="overline" component="h2">
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentMonth(new Date())}
              sx={{
                bgcolor: 'grey.100',
                color: 'text.secondary',
                borderColor: 'grey.200',
                '&:hover': { bgcolor: 'secondary.main', color: 'common.white', borderColor: 'secondary.main' },
              }}
            >
              Today
            </Button>
            <IconButton
              size="small"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Previous month"
              sx={{
                bgcolor: 'grey.100',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 1,
                '&:hover': { bgcolor: 'secondary.main', color: 'common.white' },
              }}
            >
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
              sx={{
                bgcolor: 'grey.100',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 1,
                '&:hover': { bgcolor: 'secondary.main', color: 'common.white' },
              }}
            >
              <ChevronRight size={16} />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Grid */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            bgcolor: 'cardHeader.main',
          }}
        >
          {WEEKDAYS.map((d) => (
            <Box key={d} sx={{ py: 1, textAlign: 'center' }}>
              <Typography variant="overline" sx={{ color: 'common.white' }}>{d}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days.map((day, idx) => {
            const dayEvents = getEventsForDay(day)
            const hasStarred = dayEvents.some((e) => e.isStarred)
            const inMonth = isSameMonth(day, currentMonth)
            const today = isToday(day)

            return (
              <Box
                key={idx}
                sx={{
                  minHeight: 96,
                  borderTop: '1px solid',
                  borderLeft: idx % 7 === 0 ? 'none' : '1px solid',
                  borderColor: 'divider',
                  p: 0.5,
                  bgcolor: inMonth ? 'background.paper' : 'rgba(232, 234, 237, 0.3)',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: today ? 600 : 400,
                      bgcolor: today ? 'accent.main' : 'transparent',
                      color: today ? 'common.white' : inMonth ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {format(day, 'd')}
                  </Box>
                  {hasStarred && <Star size={12} fill="#3D5B78" color="#3D5B78" />}
                </Stack>

                {dayEvents.length > 0 && (
                  <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventPopoverButton key={event.id} event={event} tags={tags} />
                    ))}
                    {dayEvents.length > 3 && (
                      <OverflowPopoverButton
                        extraEvents={dayEvents.slice(3)}
                      />
                    )}
                  </Stack>
                )}
              </Box>
            )
          })}
        </Box>
      </Paper>
    </Box>
  )
}

function EventPopoverButton({ event, tags }: { event: ResourceWithRelations; tags: Tag[] }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: '100%',
          textAlign: 'left',
          fontSize: '0.75rem',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          border: 'none',
          cursor: 'pointer',
          bgcolor: event.isStarred ? 'featured.main' : 'rgba(61, 91, 120, 0.1)',
          color: event.isStarred ? 'primary.main' : 'accent.main',
          fontWeight: event.isStarred ? 500 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '&:hover': {
            bgcolor: event.isStarred ? 'featured.dark' : 'rgba(61, 91, 120, 0.2)',
          },
        }}
      >
        {event.title}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 288 } } }}
      >
        <EventPopoverContent event={event} tags={tags} />
      </Popover>
    </>
  )
}

function OverflowPopoverButton({ extraEvents }: { extraEvents: ResourceWithRelations[] }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: '100%',
          textAlign: 'left',
          fontSize: '0.75rem',
          color: 'text.secondary',
          border: 'none',
          bgcolor: 'transparent',
          px: 0.5,
          cursor: 'pointer',
          '&:hover': { color: 'text.primary' },
        }}
      >
        +{extraEvents.length} more
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 288, p: 1.5 } } }}
      >
        <Stack spacing={1}>
          {extraEvents.map((e) => (
            <Box
              key={e.id}
              component={Link}
              href={`/resources/${e.id}`}
              sx={{
                display: 'block',
                fontSize: '0.875rem',
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'accent.main' },
              }}
            >
              {e.title}
            </Box>
          ))}
        </Stack>
      </Popover>
    </>
  )
}

function EventPopoverContent({ event, tags }: { event: ResourceWithRelations; tags: Tag[] }) {
  const eventTags = event.tags
    .map((tagId) => tags.find((t) => t.id === tagId))
    .filter(Boolean) as Tag[]
  const start = event.startDate ? new Date(event.startDate) : null
  const end = event.endDate ? new Date(event.endDate) : null

  const formatRange = () => {
    if (!start) return null
    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    }
    const t1 = format(start, 'h:mm a')
    const t2 = end ? format(end, 'h:mm a') : null
    return t2 ? `${t1} - ${t2}` : t1
  }

  return (
    <Box sx={{ p: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
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

      {formatRange() && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {formatRange()}
        </Typography>
      )}

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        {event.description}
      </Typography>

      {eventTags.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
          {eventTags.map((tag) => (
            <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
          ))}
        </Stack>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <EntityLinks badges={event.linkedBadges} courses={event.linkedCourses} showLabels />
        <Box
          component={Link}
          href={`/resources/${event.id}`}
          sx={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'accent.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View details
        </Box>
      </Stack>
    </Box>
  )
}
