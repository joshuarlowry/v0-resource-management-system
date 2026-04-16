"use client"

import * as React from 'react'
import { X, Star, Filter } from 'lucide-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import { ResourceTypeIcon, getResourceTypeLabel } from './resource-type-icon'
import type { ResourceType, Tag, Badge as BadgeType, Course, ColorVariant } from '@/lib/types'

const RESOURCE_TYPES: ResourceType[] = ['document', 'video', 'link', 'event', 'image', 'audio']

interface FilterBarProps {
  selectedTypes: ResourceType[]
  onTypesChange: (types: ResourceType[]) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  selectedBadges: string[]
  onBadgesChange: (badges: string[]) => void
  selectedCourses: string[]
  onCoursesChange: (courses: string[]) => void
  starredOnly: boolean
  onStarredOnlyChange: (value: boolean) => void
  tags: Tag[]
  badges: BadgeType[]
  courses: Course[]
  colorVariants: ColorVariant[]
}

export function FilterBar({
  selectedTypes,
  onTypesChange,
  selectedTags,
  onTagsChange,
  selectedBadges,
  onBadgesChange,
  selectedCourses,
  onCoursesChange,
  starredOnly,
  onStarredOnlyChange,
  tags,
  badges,
  courses,
  colorVariants,
}: FilterBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const popoverOpen = Boolean(anchorEl)

  const toggle = <T,>(list: T[], value: T, onChange: (next: T[]) => void) => {
    if (list.includes(value)) onChange(list.filter((v) => v !== value))
    else onChange([...list, value])
  }

  const hasActiveFilters =
    selectedTypes.length > 0
    || selectedTags.length > 0
    || selectedBadges.length > 0
    || selectedCourses.length > 0
    || starredOnly

  const activeFilterCount =
    selectedTypes.length
    + selectedTags.length
    + selectedBadges.length
    + selectedCourses.length
    + (starredOnly ? 1 : 0)
  const extraFilterCount = activeFilterCount - selectedTypes.length

  const clearAllFilters = () => {
    onTypesChange([])
    onTagsChange([])
    onBadgesChange([])
    onCoursesChange([])
    onStarredOnlyChange(false)
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
        {/* Type pills */}
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {RESOURCE_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <Chip
                key={type}
                icon={
                  <ResourceTypeIcon
                    type={type}
                    size="sm"
                    showBackground={false}
                    color={isSelected ? '#ffffff' : undefined}
                  />
                }
                label={getResourceTypeLabel(type)}
                onClick={() => toggle(selectedTypes, type, onTypesChange)}
                sx={{
                  height: 30,
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  bgcolor: isSelected ? 'accent.main' : 'grey.100',
                  color: isSelected ? 'common.white' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isSelected ? 'accent.dark' : 'secondary.main',
                    color: 'common.white',
                  },
                  '& .MuiChip-icon': {
                    ml: 1,
                    color: 'inherit',
                  },
                }}
              />
            )
          })}
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, height: 24, alignSelf: 'center' }} />

        {/* More filters popover */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<Filter size={16} />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            bgcolor: 'grey.100',
            color: 'text.secondary',
            borderColor: 'grey.200',
            '&:hover': {
              bgcolor: 'secondary.main',
              color: 'common.white',
              borderColor: 'secondary.main',
            },
          }}
        >
          More Filters
          {extraFilterCount > 0 && (
            <Badge
              badgeContent={extraFilterCount}
              color="primary"
              sx={{ ml: 1.5, '& .MuiBadge-badge': { position: 'static', transform: 'none', bgcolor: 'accent.main' } }}
            />
          )}
        </Button>

        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { width: 320, p: 2 } } }}
        >
          <Stack spacing={2}>
            {/* Featured */}
            <FormControlLabel
              control={
                <Switch
                  checked={starredOnly}
                  onChange={(_, checked) => onStarredOnlyChange(checked)}
                  size="small"
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Star size={14} color="#3D5B78" />
                  <Typography variant="overline">Featured only</Typography>
                </Stack>
              }
              sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { flex: 1 } }}
              labelPlacement="start"
            />

            <Divider />

            {/* Tags */}
            <Box>
              <Typography variant="overline" component="h4" sx={{ mb: 1 }}>Tags</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ maxHeight: 128, overflowY: 'auto' }}>
                {tags.map((tag) => {
                  const variant = colorVariants.find((v) => v.id === tag.colorVariantId)
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      onClick={() => toggle(selectedTags, tag.id, onTagsChange)}
                      sx={{
                        bgcolor: variant?.background || '#E2E8F0',
                        color: variant?.text || '#475569',
                        border: variant?.borderColor ? `1px solid ${variant.borderColor}` : 'none',
                        fontWeight: 500,
                        outline: isSelected ? '2px solid #3D5B78' : 'none',
                        outlineOffset: 1,
                        '&:hover': { opacity: 0.85, bgcolor: variant?.background || '#E2E8F0' },
                      }}
                    />
                  )
                })}
              </Stack>
            </Box>

            <Divider />

            {/* Badges */}
            <Box>
              <Typography variant="overline" component="h4" sx={{ mb: 1 }}>Linked Badges</Typography>
              <Stack spacing={0.5}>
                {badges.map((b) => (
                  <FormControlLabel
                    key={b.id}
                    control={
                      <Checkbox
                        checked={selectedBadges.includes(b.id)}
                        onChange={() => toggle(selectedBadges, b.id, onBadgesChange)}
                        size="small"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: b.color }} />
                        <Typography variant="caption">{b.name}</Typography>
                      </Stack>
                    }
                  />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Courses */}
            <Box>
              <Typography variant="overline" component="h4" sx={{ mb: 1 }}>Linked Courses</Typography>
              <Stack spacing={0.5} sx={{ maxHeight: 128, overflowY: 'auto' }}>
                {courses.map((c) => (
                  <FormControlLabel
                    key={c.id}
                    control={
                      <Checkbox
                        checked={selectedCourses.includes(c.id)}
                        onChange={() => toggle(selectedCourses, c.id, onCoursesChange)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="caption">
                        <Box component="span" sx={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'text.secondary' }}>
                          {c.code}
                        </Box>
                        {' '}{c.name}
                      </Typography>
                    }
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Popover>

        {/* Desktop featured toggle */}
        <FormControlLabel
          sx={{ display: { xs: 'none', md: 'inline-flex' }, ml: 0 }}
          control={
            <Switch
              checked={starredOnly}
              onChange={(_, checked) => onStarredOnlyChange(checked)}
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

        {hasActiveFilters && (
          <Button size="small" variant="text" startIcon={<X size={14} />} onClick={clearAllFilters}>
            Clear
          </Button>
        )}
      </Stack>

      {/* Active chips for tags/badges/courses */}
      {(selectedTags.length > 0 || selectedBadges.length > 0 || selectedCourses.length > 0) && (
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            if (!tag) return null
            return (
              <Chip
                key={tagId}
                label={tag.name}
                size="small"
                onDelete={() => toggle(selectedTags, tagId, onTagsChange)}
                sx={{ bgcolor: 'accent.main', color: 'common.white', '& .MuiChip-deleteIcon': { color: 'common.white' } }}
              />
            )
          })}
          {selectedBadges.map((badgeId) => {
            const b = badges.find((bb) => bb.id === badgeId)
            if (!b) return null
            return (
              <Chip
                key={badgeId}
                label={b.name}
                size="small"
                onDelete={() => toggle(selectedBadges, badgeId, onBadgesChange)}
                sx={{ bgcolor: 'secondary.main', color: 'common.white', '& .MuiChip-deleteIcon': { color: 'common.white' } }}
              />
            )
          })}
          {selectedCourses.map((courseId) => {
            const c = courses.find((cc) => cc.id === courseId)
            if (!c) return null
            return (
              <Chip
                key={courseId}
                label={c.code}
                size="small"
                onDelete={() => toggle(selectedCourses, courseId, onCoursesChange)}
                variant="outlined"
                sx={{ bgcolor: 'grey.100', color: 'text.secondary' }}
              />
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}
