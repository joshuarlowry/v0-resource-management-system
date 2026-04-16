"use client"

import { cn } from '@/lib/utils'
import { useResources } from '@/lib/resources-context'
import type { ColorVariant } from '@/lib/types'

interface TagBadgeProps {
  name: string
  colorVariantId?: string
  colorVariant?: ColorVariant // Direct variant object for standalone usage
  size?: 'sm' | 'md'
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

// Default fallback variant for when no variant is found
const defaultVariant: ColorVariant = {
  id: 'default',
  name: 'Default',
  background: '#E2E8F0',
  text: '#475569',
  borderColor: '#CBD5E1',
}

export function TagBadge({ 
  name, 
  colorVariantId,
  colorVariant,
  size = 'sm',
  onClick,
  onRemove,
  className 
}: TagBadgeProps) {
  const { colorVariants } = useResources()
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  // Resolve the variant: prefer direct prop, then lookup by ID, then fallback
  const resolvedVariant = colorVariant 
    || colorVariants.find(v => v.id === colorVariantId) 
    || defaultVariant

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium transition-colors',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      style={{
        backgroundColor: resolvedVariant.background,
        color: resolvedVariant.text,
        border: resolvedVariant.borderColor ? `1px solid ${resolvedVariant.borderColor}` : undefined,
      }}
      onClick={onClick}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9.707 3.707a1 1 0 0 0-1.414-1.414L6 4.586 3.707 2.293a1 1 0 0 0-1.414 1.414L4.586 6 2.293 8.293a1 1 0 1 0 1.414 1.414L6 7.414l2.293 2.293a1 1 0 0 0 1.414-1.414L7.414 6l2.293-2.293Z" />
          </svg>
        </button>
      )}
    </span>
  )
}

// Standalone variant preview (doesn't need context - for color palette manager)
interface ColorVariantPreviewProps {
  variant: ColorVariant
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

export function ColorVariantPreview({ 
  variant, 
  label,
  size = 'sm', 
  className 
}: ColorVariantPreviewProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: variant.background,
        color: variant.text,
        border: variant.borderColor ? `1px solid ${variant.borderColor}` : undefined,
      }}
    >
      {label || variant.name}
    </span>
  )
}
