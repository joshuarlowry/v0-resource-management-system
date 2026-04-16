"use client"

import * as React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/lib/theme'

/**
 * App Router-compatible MUI setup.
 * - AppRouterCacheProvider handles Emotion SSR cache with React 19 / Next 16.
 * - ThemeProvider injects our enterprise palette and component overrides.
 * - CssBaseline normalizes styles and applies theme.palette.background.default.
 */
export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
