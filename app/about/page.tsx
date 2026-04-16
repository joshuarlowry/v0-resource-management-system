"use client"

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import {
  Layers,
  Database,
  Palette,
  Calendar,
  Search,
  Tags,
  FolderOpen,
  Star,
  Code2,
  Boxes,
  Paintbrush,
  Server,
  GitBranch,
  ExternalLink,
} from 'lucide-react'
import { AppShell } from '@/components/resources/app-shell'

const techStack = [
  {
    category: 'Framework',
    items: [
      { name: 'Next.js 16', description: 'React framework with App Router, server components, and optimized bundling' },
      { name: 'React 19', description: 'Latest React with concurrent features and improved performance' },
      { name: 'TypeScript', description: 'Type-safe development with full IDE support' },
    ],
  },
  {
    category: 'UI Library',
    items: [
      { name: 'Material-UI (MUI) v6', description: 'Comprehensive React component library following Material Design' },
      { name: 'Emotion', description: 'CSS-in-JS styling with the sx prop for inline theming' },
      { name: 'Lucide Icons', description: 'Beautiful, consistent icon set with tree-shaking support' },
    ],
  },
  {
    category: 'State & Data',
    items: [
      { name: 'React Context', description: 'Centralized state management for resources, tags, and settings' },
      { name: 'In-memory storage', description: 'Prototype uses client-side data (easily swappable for a database)' },
    ],
  },
  {
    category: 'Tooling',
    items: [
      { name: 'Vercel', description: 'Deployment platform with edge functions and analytics' },
      { name: 'pnpm', description: 'Fast, disk-efficient package manager' },
    ],
  },
]

const features = [
  {
    icon: FolderOpen,
    title: 'Resource Library',
    description: 'Organize documents, videos, links, images, audio files, and events in a unified library with rich metadata.',
  },
  {
    icon: Tags,
    title: 'Tag System',
    description: 'Categorize resources with customizable tags. Each tag has its own color variant for visual distinction.',
  },
  {
    icon: Palette,
    title: 'Color Palette Manager',
    description: 'Create and manage color variants that can be applied to tags throughout the system.',
  },
  {
    icon: Calendar,
    title: 'Event Calendar',
    description: 'View time-based resources (events) in a calendar format with day, week, and month views.',
  },
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Find resources quickly with full-text search, type filters, tag filters, and date range selection.',
  },
  {
    icon: Star,
    title: 'Featured Resources',
    description: 'Star important resources to feature them on the homepage carousel for quick access.',
  },
]

const useCases = [
  'Learning Management Systems (LMS)',
  'Internal knowledge bases',
  'Documentation portals',
  'Digital asset management',
  'Course material libraries',
  'Training resource hubs',
  'Company intranets',
  'Educational platforms',
]

export default function AboutPage() {
  return (
    <AppShell title="About This Prototype">
      <Stack spacing={4} sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Introduction */}
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'accent.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={24} color="#ffffff" />
            </Box>
            <Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Resource Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A flexible prototype for organizing and browsing digital resources
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            This prototype demonstrates a complete resource management system built with modern web technologies. 
            It provides a foundation for building learning management systems, knowledge bases, documentation portals, 
            or any application that needs to organize and present categorized content to users.
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mt: 2 }}>
            The system supports multiple resource types, a flexible tagging system with customizable colors, 
            full-text search, calendar views for events, and a clean admin interface for content management. 
            All data is currently stored in-memory for demonstration purposes, but the architecture is designed 
            to easily integrate with any backend or database.
          </Typography>
        </Paper>

        {/* Features */}
        <Box>
          <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2 }}>
            Key Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Paper key={feature.title} sx={{ p: 2, height: '100%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#3D5B78" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )
            })}
          </Box>
        </Box>

        {/* Tech Stack */}
        <Box>
          <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2 }}>
            Tech Stack
          </Typography>
          <Paper sx={{ overflow: 'hidden' }}>
            {techStack.map((section, idx) => (
              <Box key={section.category}>
                {idx > 0 && <Divider />}
                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    {section.category === 'Framework' && <Code2 size={16} color="#3D5B78" />}
                    {section.category === 'UI Library' && <Paintbrush size={16} color="#3D5B78" />}
                    {section.category === 'State & Data' && <Database size={16} color="#3D5B78" />}
                    {section.category === 'Tooling' && <Server size={16} color="#3D5B78" />}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                      {section.category}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {section.items.map((item) => (
                      <Stack key={item.name} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} alignItems={{ sm: 'baseline' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 160, flexShrink: 0 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Use Cases */}
        <Box>
          <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2 }}>
            Potential Use Cases
          </Typography>
          <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This prototype can serve as a starting point for various applications:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {useCases.map((useCase) => (
                <Chip
                  key={useCase}
                  label={useCase}
                  size="small"
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Architecture */}
        <Box>
          <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2 }}>
            Architecture Notes
          </Typography>
          <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Boxes size={16} color="#3D5B78" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Component Structure
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Components are organized in <code>components/resources/</code> and use MUI&apos;s sx prop for styling. 
                  The AppShell component provides consistent navigation and layout across all pages. 
                  Each page is a client component that consumes the ResourcesContext for data access.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Database size={16} color="#3D5B78" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Data Layer
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  The <code>lib/resources-context.tsx</code> provides a centralized data store with CRUD operations 
                  for resources, tags, color variants, badges, and courses. The API layer in <code>lib/api.ts</code> 
                  simulates async operations and can be replaced with real API calls to any backend.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Palette size={16} color="#3D5B78" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Theming
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  MUI theming is configured in <code>lib/theme.ts</code> with custom colors that match the original 
                  design palette. The theme includes custom palette entries for navigation, sidebar, page headers, 
                  and accent colors. Components use semantic color tokens for consistency.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <GitBranch size={16} color="#3D5B78" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Extending the Prototype
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  To connect to a real database, replace the mock API functions in <code>lib/api.ts</code> with 
                  actual fetch calls to your backend. The type definitions in <code>lib/types.ts</code> define 
                  the data structures used throughout the application. Add authentication by wrapping the 
                  ResourcesProvider with your auth provider and protecting routes as needed.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Resources */}
        <Box>
          <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2 }}>
            Resources
          </Typography>
          <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={1.5}>
              <Link
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'accent.main',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Next.js Documentation
                <ExternalLink size={14} />
              </Link>
              <Link
                href="https://mui.com/material-ui/getting-started/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'accent.main',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Material-UI Documentation
                <ExternalLink size={14} />
              </Link>
              <Link
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'accent.main',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Lucide Icons
                <ExternalLink size={14} />
              </Link>
              <Link
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'accent.main',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Vercel Documentation
                <ExternalLink size={14} />
              </Link>
            </Stack>
          </Paper>
        </Box>

        {/* Footer note */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Built with Next.js 16, Material-UI, and TypeScript
          </Typography>
        </Box>
      </Stack>
    </AppShell>
  )
}
