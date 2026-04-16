"use client"

import * as React from 'react'
import { Award, BookOpen } from 'lucide-react'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Badge, Course } from '@/lib/types'

interface EntityLinksProps {
  badges: Badge[]
  courses: Course[]
  showLabels?: boolean
  sx?: SxProps<Theme>
}

export function EntityLinks({ badges, courses, showLabels = false, sx }: EntityLinksProps) {
  if (badges.length === 0 && courses.length === 0) return null

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={sx}>
      {badges.length > 0 && (
        <Tooltip
          arrow
          placement="top"
          title={<BadgeTooltip badges={badges} />}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', cursor: 'default' }}>
            <Award size={14} />
            <Typography variant="caption">
              {showLabels ? `${badges.length} badge${badges.length !== 1 ? 's' : ''}` : badges.length}
            </Typography>
          </Stack>
        </Tooltip>
      )}
      {courses.length > 0 && (
        <Tooltip
          arrow
          placement="top"
          title={<CourseTooltip courses={courses} />}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', cursor: 'default' }}>
            <BookOpen size={14} />
            <Typography variant="caption">
              {showLabels ? `${courses.length} course${courses.length !== 1 ? 's' : ''}` : courses.length}
            </Typography>
          </Stack>
        </Tooltip>
      )}
    </Stack>
  )
}

function BadgeTooltip({ badges }: { badges: Badge[] }) {
  return (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="overline" sx={{ color: 'common.white', display: 'block', mb: 0.5 }}>
        Linked Badges
      </Typography>
      <Stack spacing={0.5}>
        {badges.map((b) => (
          <Stack key={b.id} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: b.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" sx={{ color: 'common.white' }}>{b.name}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function CourseTooltip({ courses }: { courses: Course[] }) {
  return (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="overline" sx={{ color: 'common.white', display: 'block', mb: 0.5 }}>
        Linked Courses
      </Typography>
      <Stack spacing={0.5}>
        {courses.map((c) => (
          <Typography key={c.id} variant="caption" sx={{ color: 'common.white' }}>
            <Box component="span" sx={{ fontFamily: 'var(--font-geist-mono), monospace' }}>{c.code}</Box>
            {' '}{c.name}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
