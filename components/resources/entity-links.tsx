import { Award, BookOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Badge, Course } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EntityLinksProps {
  badges: Badge[]
  courses: Course[]
  className?: string
  showLabels?: boolean
}

export function EntityLinks({ badges, courses, className, showLabels = false }: EntityLinksProps) {
  if (badges.length === 0 && courses.length === 0) return null

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        {badges.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Award className="h-3.5 w-3.5" />
                {showLabels ? (
                  <span className="text-xs">
                    {badges.length} badge{badges.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-xs">{badges.length}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border rounded-md">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs uppercase tracking-wider text-card-foreground">Linked Badges</span>
                {badges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-1.5">
                    <span 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: badge.color }}
                    />
                    <span className="text-xs text-muted-foreground">{badge.name}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        {courses.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {showLabels ? (
                  <span className="text-xs">
                    {courses.length} course{courses.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-xs">{courses.length}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border rounded-md">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs uppercase tracking-wider text-card-foreground">Linked Courses</span>
                {courses.map(course => (
                  <div key={course.id} className="text-xs text-muted-foreground">
                    <span className="font-mono">{course.code}</span>
                    {' '}
                    {course.name}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
