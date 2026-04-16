"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Library, Calendar, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Browse', icon: Library },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' 
          ? pathname === '/' 
          : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
