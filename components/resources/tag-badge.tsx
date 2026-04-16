"use client"

import Chip from '@mui/material/Chip'
import type { SxProps, Theme } from '@mui/material/styles'
import { useResources } from '@/lib/resources-context'
import type { ColorVariant } from '@/lib/types'

interface TagBadgeProps {
  name: string
  colorVariantId?: string
  colorVariant?: ColorVariant
  size?: 'sm' | 'md'
  onClick?: () => void
  onRemove?: () => void
  sx?: SxProps<Theme>
}

const defaultVariant: ColorVariant = {
  id: 'default',
  name: 'Default',
  background: '#E2E8F0',
  text: '#475569',
  borderColor: '#CBD5E1',
}

/**
 * Tag pill rendered with the per-tag color variant. These colors are
 * user-configurable at runtime, so they can't come from the theme
 * palette — we apply them as inline `sx` values on an MUI Chip.
 */
export function TagBadge({
  name,
  colorVariantId,
  colorVariant,
  size = 'sm',
  onClick,
  onRemove,
  sx,
}: TagBadgeProps) {
  const { colorVariants } = useResources()

  const variant =
    colorVariant
    ?? colorVariants.find((v) => v.id === colorVariantId)
    ?? defaultVariant

  return (
    <Chip
      label={name}
      size={size === 'sm' ? 'small' : 'medium'}
      onClick={onClick}
      onDelete={onRemove}
      sx={{
        bgcolor: variant.background,
        color: variant.text,
        border: variant.borderColor ? `1px solid ${variant.borderColor}` : 'none',
        fontWeight: 500,
        borderRadius: 1,
        height: size === 'sm' ? 22 : 28,
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        '& .MuiChip-label': {
          px: 1,
        },
        '& .MuiChip-deleteIcon': {
          color: variant.text,
          opacity: 0.75,
          '&:hover': { color: variant.text, opacity: 1 },
        },
        ...(onClick && {
          cursor: 'pointer',
          '&:hover': { opacity: 0.85, bgcolor: variant.background },
        }),
        ...sx,
      }}
    />
  )
}

interface ColorVariantPreviewProps {
  variant: ColorVariant
  label?: string
  size?: 'sm' | 'md'
  sx?: SxProps<Theme>
}

/**
 * Standalone preview for the palette manager — does not use the
 * resources context (needed before the variant is saved).
 */
export function ColorVariantPreview({
  variant,
  label,
  size = 'sm',
  sx,
}: ColorVariantPreviewProps) {
  return (
    <Chip
      label={label ?? variant.name}
      size={size === 'sm' ? 'small' : 'medium'}
      sx={{
        bgcolor: variant.background,
        color: variant.text,
        border: variant.borderColor ? `1px solid ${variant.borderColor}` : 'none',
        fontWeight: 500,
        borderRadius: 1,
        height: size === 'sm' ? 22 : 28,
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        ...sx,
      }}
    />
  )
}
