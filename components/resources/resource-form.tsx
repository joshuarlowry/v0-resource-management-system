"use client"

import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { TagBadge } from './tag-badge'
import { getResourceTypeLabel } from './resource-type-icon'
import type { Resource, ResourceType, Tag, Badge, Course } from '@/lib/types'

const RESOURCE_TYPES: ResourceType[] = ['document', 'video', 'link', 'event', 'image', 'audio']

interface ResourceFormProps {
  resource?: Resource
  tags: Tag[]
  badges: Badge[]
  courses: Course[]
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function ResourceForm({
  resource,
  tags,
  badges,
  courses,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const [title, setTitle] = useState(resource?.title ?? '')
  const [description, setDescription] = useState(resource?.description ?? '')
  const [type, setType] = useState<ResourceType>(resource?.type ?? 'document')
  const [url, setUrl] = useState(resource?.url ?? '')
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(resource?.tags ?? [])
  const [selectedBadges, setSelectedBadges] = useState<string[]>(resource?.linkedBadgeIds ?? [])
  const [selectedCourses, setSelectedCourses] = useState<string[]>(resource?.linkedCourseIds ?? [])
  const [isStarred, setIsStarred] = useState(resource?.isStarred ?? false)
  const [startDate, setStartDate] = useState(
    resource?.startDate ? new Date(resource.startDate).toISOString().slice(0, 16) : ''
  )
  const [endDate, setEndDate] = useState(
    resource?.endDate ? new Date(resource.endDate).toISOString().slice(0, 16) : ''
  )

  const showUrlField = ['video', 'link', 'audio'].includes(type)
  const showFileField = ['document', 'image', 'audio'].includes(type)
  const showEventFields = type === 'event'

  const toggle = (list: string[], value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      type,
      url: showUrlField ? url : undefined,
      fileUrl: showFileField ? fileUrl : undefined,
      tags: selectedTags,
      linkedBadgeIds: selectedBadges,
      linkedCourseIds: selectedCourses,
      isStarred,
      startDate: showEventFields && startDate ? new Date(startDate) : undefined,
      endDate: showEventFields && endDate ? new Date(endDate) : undefined,
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            required
            size="small"
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter resource description"
            required
            multiline
            rows={3}
            size="small"
            fullWidth
          />
          <TextField
            label="Type"
            select
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
            size="small"
            fullWidth
          >
            {RESOURCE_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {getResourceTypeLabel(t)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Divider />

        {(showUrlField || showFileField) && (
          <Stack spacing={2}>
            {showUrlField && (
              <TextField
                label="URL"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/resource"
                size="small"
                fullWidth
              />
            )}
            {showFileField && (
              <TextField
                label="File URL"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/files/document.pdf"
                size="small"
                fullWidth
                helperText="Enter the path to the file (file upload coming soon)"
              />
            )}
          </Stack>
        )}

        {showEventFields && (
          <>
            <Divider />
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Event Details</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Start Date & Time"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date & Time"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Stack>
          </>
        )}

        <Divider />

        <Stack spacing={1.5}>
          <FormLabel>Tags</FormLabel>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tags.map((tag) => (
              <Box
                key={tag.id}
                component="button"
                type="button"
                onClick={() => toggle(selectedTags, tag.id, setSelectedTags)}
                sx={{
                  bgcolor: 'transparent',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <TagBadge
                  name={tag.name}
                  colorVariantId={tag.colorVariantId}
                  size="md"
                  sx={
                    selectedTags.includes(tag.id)
                      ? { outline: '2px solid', outlineColor: 'accent.main', outlineOffset: 1 }
                      : { opacity: 0.6 }
                  }
                />
              </Box>
            ))}
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <FormLabel>Link to Badges</FormLabel>
          <Stack>
            {badges.map((b) => (
              <FormControlLabel
                key={b.id}
                control={
                  <Checkbox
                    checked={selectedBadges.includes(b.id)}
                    onChange={() => toggle(selectedBadges, b.id, setSelectedBadges)}
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: b.color }} />
                    <Typography variant="body2">{b.name}</Typography>
                  </Stack>
                }
              />
            ))}
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <FormLabel>Link to Courses</FormLabel>
          <Stack sx={{ maxHeight: 160, overflowY: 'auto' }}>
            {courses.map((c) => (
              <FormControlLabel
                key={c.id}
                control={
                  <Checkbox
                    checked={selectedCourses.includes(c.id)}
                    onChange={() => toggle(selectedCourses, c.id, setSelectedCourses)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    <Box component="span" sx={{ fontFamily: 'var(--font-geist-mono), monospace', color: 'text.secondary' }}>
                      {c.code}
                    </Box>
                    {' '}{c.name}
                  </Typography>
                }
              />
            ))}
          </Stack>
        </Stack>

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <FormLabel>Featured Resource</FormLabel>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Featured resources are highlighted in search results
            </Typography>
          </Box>
          <Switch checked={isStarred} onChange={(_, v) => setIsStarred(v)} />
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}>
            {resource ? 'Save Changes' : 'Create Resource'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
