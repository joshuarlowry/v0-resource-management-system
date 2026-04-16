import { FileText, Video, Link as LinkIcon, Calendar, Image as ImageIcon, Headphones } from 'lucide-react'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ResourceType } from '@/lib/types'

const iconMap = {
  document: FileText,
  video: Video,
  link: LinkIcon,
  event: Calendar,
  image: ImageIcon,
  audio: Headphones,
} as const

/**
 * Per-type color treatment. Uses theme-palette colors where possible
 * and falls back to literal hex for the "event" and "image" tints so
 * the enterprise look stays intact.
 */
const colorMap: Record<ResourceType, { fg: string; bg: string }> = {
  document: { fg: '#3D5B78', bg: 'rgba(61, 91, 120, 0.1)' },
  video: { fg: '#363940', bg: 'rgba(54, 57, 64, 0.1)' },
  link: { fg: '#4B6785', bg: 'rgba(75, 103, 133, 0.1)' },
  event: { fg: '#3D5B78', bg: 'rgba(165, 205, 224, 0.3)' },
  image: { fg: '#8192A6', bg: 'rgba(129, 146, 166, 0.1)' },
  audio: { fg: '#4B6785', bg: 'rgba(75, 103, 133, 0.1)' },
}

const boxSizes = {
  sm: { size: 24, pad: 0.5, icon: 16 },
  md: { size: 32, pad: 0.75, icon: 20 },
  lg: { size: 40, pad: 1, icon: 24 },
} as const

interface ResourceTypeIconProps {
  type: ResourceType
  size?: 'sm' | 'md' | 'lg'
  showBackground?: boolean
  sx?: SxProps<Theme>
  color?: string
}

export function ResourceTypeIcon({
  type,
  size = 'md',
  showBackground = true,
  sx,
  color,
}: ResourceTypeIconProps) {
  const Icon = iconMap[type]
  const dims = boxSizes[size]
  const palette = colorMap[type]

  if (!showBackground) {
    return (
      <Box
        component={Icon}
        sx={{
          width: dims.icon,
          height: dims.icon,
          color: color ?? palette.fg,
          flexShrink: 0,
          ...sx,
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        width: dims.size,
        height: dims.size,
        borderRadius: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: palette.fg,
        bgcolor: palette.bg,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Icon size={dims.icon} />
    </Box>
  )
}

export function getResourceTypeLabel(type: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    document: 'Document',
    video: 'Video',
    link: 'Link',
    event: 'Event',
    image: 'Image',
    audio: 'Audio',
  }
  return labels[type]
}
