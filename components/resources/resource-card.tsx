"use client"

import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import { ResourceTypeIcon, getResourceTypeLabel } from './resource-type-icon'
import { TagBadge } from './tag-badge'
import { EntityLinks } from './entity-links'
import type { ResourceWithRelations, Tag } from '@/lib/types'

interface ResourceCardProps {
  resource: ResourceWithRelations
  tags: Tag[]
}

export function ResourceCard({ resource, tags }: ResourceCardProps) {
  const resourceTags = resource.tags
    .map((tagId) => tags.find((t) => t.id === tagId))
    .filter(Boolean) as Tag[]

  const formatEventDate = () => {
    if (resource.type !== 'event' || !resource.startDate) return null
    const start = new Date(resource.startDate)
    const end = resource.endDate ? new Date(resource.endDate) : null
    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    }
    return format(start, 'MMM d, yyyy')
  }

  const eventDate = formatEventDate()

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px rgba(26, 38, 52, 0.1)' },
        ...(resource.isStarred && {
          outline: '2px solid',
          outlineColor: 'accent.main',
          outlineOffset: -2,
          bgcolor: 'rgba(165, 205, 224, 0.1)',
        }),
      }}
    >
      <CardActionArea
        component={Link}
        href={`/resources/${resource.id}`}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '& .MuiCardActionArea-focusHighlight': { display: 'none' },
        }}
      >
        {/* Header band */}
        <Box
          sx={{
            bgcolor: 'cardHeader.main',
            py: 1,
            px: 1.5,
            position: 'relative',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'common.white', display: 'block', textAlign: 'center', lineHeight: 1 }}
          >
            {getResourceTypeLabel(resource.type)}
          </Typography>
          {resource.isStarred && (
            <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <Star size={14} fill="#ffffff" color="#ffffff" />
            </Box>
          )}
        </Box>

        {/* Body */}
        <Stack sx={{ p: 2, flex: 1 }} spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <ResourceTypeIcon type={resource.type} size="md" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                component="h3"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {resource.title}
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {resource.description}
          </Typography>

          {eventDate && (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'accent.main' }}>
              <Clock size={12} />
              <Typography variant="caption">{eventDate}</Typography>
            </Stack>
          )}

          {resourceTags.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {resourceTags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
              ))}
              {resourceTags.length > 3 && (
                <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                  +{resourceTags.length - 3}
                </Typography>
              )}
            </Stack>
          )}

          <Box sx={{ mt: 'auto' }}>
            <EntityLinks badges={resource.linkedBadges} courses={resource.linkedCourses} />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  )
}
