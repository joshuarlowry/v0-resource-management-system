"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Settings,
  LayoutGrid,
  User,
  FolderOpen,
  Tags,
  Menu as MenuIcon,
  X as CloseIcon,
} from 'lucide-react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useResources } from '@/lib/resources-context'

const sidebarItems = [
  { href: '/admin', icon: Settings, label: 'Settings' },
  { href: '/admin/resources', icon: FolderOpen, label: 'Manage Resources' },
  { href: '/admin/tags', icon: Tags, label: 'Manage Tags' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/resources', label: 'Resources' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/about', label: 'About' },
]

interface AppShellProps {
  children: React.ReactNode
  title: string
}

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname()
  const { siteSettings } = useResources()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const muiTheme = useTheme()
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'))

  const isActive = (href: string) => {
    if (href === '/' || href === '/admin') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'navBg.main', height: 56, zIndex: (t) => t.zIndex.appBar }}
      >
        <Toolbar sx={{ minHeight: '56px !important', px: 2, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LayoutGrid size={24} color="#ffffff" />
            <Typography
              sx={{
                color: 'common.white',
                fontWeight: 700,
                fontSize: '1.125rem',
                letterSpacing: '0.15em',
              }}
            >
              {siteSettings.title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Desktop nav */}
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Box
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      textDecoration: 'none',
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'common.white' : 'rgba(255,255,255,0.7)',
                      transition: 'color 0.15s',
                      '&:hover': { color: 'common.white' },
                    }}
                  >
                    {link.label}
                  </Box>
                )
              })}
            </Stack>

            {/* User chip */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: 'accent.main', width: 32, height: 32 }}>
                <User size={16} color="#ffffff" />
              </Avatar>
              <Typography sx={{ color: 'common.white', fontSize: '0.875rem', display: { xs: 'none', sm: 'block' } }}>
                Admin
              </Typography>
            </Stack>

            {/* Mobile hamburger */}
            <IconButton
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { color: 'common.white' },
              }}
            >
              {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile collapse menu */}
      <Collapse in={mobileMenuOpen && !isDesktop} sx={{ display: { md: 'none' } }}>
        <Box sx={{ bgcolor: 'navBg.main', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  display: 'block',
                  px: 3,
                  py: 1.5,
                  textDecoration: 'none',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'common.white' : 'rgba(255,255,255,0.7)',
                  bgcolor: active ? 'rgba(61, 91, 120, 0.3)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white' },
                }}
              >
                {link.label}
              </Box>
            )
          })}
          <Box sx={{ px: 3, py: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              sx={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              Admin
            </Typography>
          </Box>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Stack
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  px: 3,
                  py: 1.5,
                  textDecoration: 'none',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'common.white' : 'rgba(255,255,255,0.7)',
                  bgcolor: active ? 'rgba(61, 91, 120, 0.3)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white' },
                }}
              >
                <Icon size={16} />
                <Box component="span">{item.label}</Box>
              </Stack>
            )
          })}
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop-only left rail */}
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: 64,
            flexShrink: 0,
            bgcolor: 'sidebarBg.main',
            py: 2,
            gap: 0.5,
            alignItems: 'center',
          }}
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Tooltip key={item.href} title={item.label} placement="right" arrow>
                <IconButton
                  component={Link}
                  href={item.href}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    color: active ? 'common.white' : 'rgba(255,255,255,0.6)',
                    bgcolor: active ? 'accent.main' : 'transparent',
                    '&:hover': {
                      bgcolor: active ? 'accent.dark' : 'sidebarBg.dark',
                      color: 'common.white',
                    },
                  }}
                >
                  <Icon size={20} />
                </IconButton>
              </Tooltip>
            )
          })}
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Page sub-header */}
          <Box
            sx={{
              bgcolor: 'pageHeader.main',
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              flexShrink: 0,
            }}
          >
            <Typography
              component="h1"
              sx={{
                color: 'common.white',
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                fontWeight: 300,
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Scrollable canvas */}
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: { xs: 1.5, sm: 3 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
