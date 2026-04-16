"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Settings, 
  LayoutGrid,
  User,
  FolderOpen,
  Tags,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResources } from '@/lib/resources-context'

// Admin-only sidebar items (hidden in user context, shown for admins)
const sidebarItems = [
  { href: '/admin', icon: Settings, label: 'Settings' },
  { href: '/admin/resources', icon: FolderOpen, label: 'Manage Resources' },
  { href: '/admin/tags', icon: Tags, label: 'Manage Tags' },
]

// Top navigation for all users
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/resources', label: 'Resources' },
  { href: '/calendar', label: 'Calendar' },
]

interface AppShellProps {
  children: React.ReactNode
  title: string
}

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname()
  const { siteSettings } = useResources()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    // Exact match for root and admin settings
    if (href === '/' || href === '/admin') return pathname === href
    // Prefix match for other routes
    return pathname.startsWith(href)
  }

  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 bg-[#1A2634] flex items-center justify-between px-4 shrink-0 z-30 relative">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-6 w-6 text-white" />
          <span className="text-white font-bold text-lg tracking-widest">{siteSettings.title}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-wider transition-colors",
                  isActive(link.href)
                    ? "text-white font-medium"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User profile */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#3D5B78] flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-white text-sm hidden sm:block">Admin</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A2634] border-t border-white/10 z-20 relative">
          {/* Main nav links */}
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-6 py-3 text-xs uppercase tracking-wider border-b border-white/10 transition-colors",
                isActive(link.href)
                  ? "text-white font-medium bg-[#3D5B78]/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Admin section divider */}
          <div className="px-6 py-2 border-b border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Admin</span>
          </div>
          {sidebarItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-xs uppercase tracking-wider border-b border-white/10 transition-colors",
                  isActive(item.href)
                    ? "text-white font-medium bg-[#3D5B78]/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — desktop only */}
        <aside className="hidden md:flex flex-col w-16 shrink-0 bg-[#2C313C] py-4 gap-1 items-center">
          {sidebarItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center transition-colors",
                  active
                    ? "bg-[#3D5B78] text-white"
                    : "text-white/60 hover:text-white hover:bg-[#363940]"
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </Link>
            )
          })}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Page Sub-Header */}
          <div className="bg-[#3D5B78] px-4 sm:px-6 py-3 sm:py-4 shrink-0">
            <h1 className="text-white text-lg sm:text-xl font-light">{title}</h1>
          </div>

          {/* Scrollable Canvas */}
          <main className="flex-1 overflow-auto bg-[#F0F2F5] p-3 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
