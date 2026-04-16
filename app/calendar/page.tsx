"use client"

import { useState, useMemo } from 'react'
import { List as ListIcon, Grid3X3, Star } from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { SearchInput } from '@/components/resources/search-input'
import { EventList } from '@/components/resources/event-list'
import { EventCalendar } from '@/components/resources/event-calendar'

type ViewMode = 'list' | 'calendar'

export default function CalendarPage() {
  const { getResourcesWithRelations, tags } = useResources()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [starredOnly, setStarredOnly] = useState(false)

  const allResources = getResourcesWithRelations()

  const events = useMemo(() => {
    return allResources.filter((resource) => {
      if (resource.type !== 'event') return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const hitTitle = resource.title.toLowerCase().includes(q)
        const hitDesc = resource.description.toLowerCase().includes(q)
        const hitTag = resource.tags.some((tagId) => tags.find((t) => t.id === tagId)?.name.toLowerCase().includes(q))
        if (!hitTitle && !hitDesc && !hitTag) return false
      }
      if (starredOnly && !resource.isStarred) return false
      return true
    })
  }, [allResources, searchQuery, starredOnly, tags])

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
        return aDate - bDate
      }),
    [events]
  )

  return (
    <AppShell title="Events Calendar">
      <Stack spacing={3}>
        <Paper sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            flexWrap="wrap"
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
          >
            <Box sx={{ width: { xs: '100%', sm: 320 } }}>
              <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search events..." />
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, v) => v && setViewMode(v as ViewMode)}
                size="small"
                sx={{
                  bgcolor: 'grey.100',
                  p: 0.5,
                  borderRadius: 1,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    textTransform: 'uppercase',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    fontWeight: 500,
                    color: 'text.secondary',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'accent.main',
                      color: 'common.white',
                      '&:hover': { bgcolor: 'accent.dark' },
                    },
                    '&:hover': { bgcolor: 'secondary.main', color: 'common.white' },
                  },
                }}
              >
                <ToggleButton value="list">
                  <ListIcon size={16} />
                  List
                </ToggleButton>
                <ToggleButton value="calendar">
                  <Grid3X3 size={16} />
                  Calendar
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                control={
                  <Switch
                    checked={starredOnly}
                    onChange={(_, v) => setStarredOnly(v)}
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Star
                      size={16}
                      fill={starredOnly ? '#3D5B78' : 'none'}
                      color={starredOnly ? '#3D5B78' : 'var(--mui-palette-text-secondary)'}
                    />
                    <Typography variant="overline">Featured</Typography>
                  </Stack>
                }
              />
            </Stack>
          </Stack>
        </Paper>

        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
          {events.length} event{events.length !== 1 ? 's' : ''} found
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>

        {viewMode === 'list' ? (
          <EventList events={sortedEvents} tags={tags} />
        ) : (
          <EventCalendar events={sortedEvents} tags={tags} />
        )}
      </Stack>
    </AppShell>
  )
}
