import { FileText, Video, Link, Calendar, Image, Headphones } from 'lucide-react'
import type { ResourceType } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap = {
  document: FileText,
  video: Video,
  link: Link,
  event: Calendar,
  image: Image,
  audio: Headphones,
}

const colorMap = {
  document: 'text-[#3D5B78] bg-[#3D5B78]/10',
  video: 'text-[#363940] bg-[#363940]/10',
  link: 'text-[#4B6785] bg-[#4B6785]/10',
  event: 'text-[#3D5B78] bg-[#A5CDE0]/30',
  image: 'text-[#8192A6] bg-[#8192A6]/10',
  audio: 'text-[#4B6785] bg-[#4B6785]/10',
}

interface ResourceTypeIconProps {
  type: ResourceType
  size?: 'sm' | 'md' | 'lg'
  showBackground?: boolean
  className?: string
}

export function ResourceTypeIcon({ 
  type, 
  size = 'md', 
  showBackground = true,
  className 
}: ResourceTypeIconProps) {
  const Icon = iconMap[type]
  
  const sizeClasses = {
    sm: showBackground ? 'h-6 w-6 p-1' : 'h-4 w-4',
    md: showBackground ? 'h-8 w-8 p-1.5' : 'h-5 w-5',
    lg: showBackground ? 'h-10 w-10 p-2' : 'h-6 w-6',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  if (showBackground) {
    return (
      <div className={cn(
        'rounded-md flex items-center justify-center',
        sizeClasses[size],
        colorMap[type],
        className
      )}>
        <Icon className={iconSizes[size]} />
      </div>
    )
  }

  return <Icon className={cn(iconSizes[size], colorMap[type].split(' ')[0], className)} />
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
