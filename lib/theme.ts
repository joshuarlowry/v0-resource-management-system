"use client"

import { createTheme, type PaletteColor, type PaletteColorOptions } from '@mui/material/styles'

/**
 * MUI theme that mirrors the enterprise dashboard palette
 * previously defined as CSS variables in app/globals.css.
 *
 * Palette mapping:
 *   primary       -> #1A2634 (top navbar / strong headings)
 *   secondary     -> #8192A6 (card header bars, subdued controls)
 *   accent        -> #3D5B78 (page sub-header, active/featured elements)
 *   featured      -> #A5CDE0 (light featured tint)
 *   navBg         -> #1A2634 (top nav)
 *   sidebarBg     -> #2C313C (left rail)
 *   background    -> #F0F2F5 (app canvas)
 *   text.primary  -> #1A2634
 *   text.secondary-> #4B6785
 *   divider       -> #E2E8F0
 */
declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColor
    featured: PaletteColor
    navBg: PaletteColor
    sidebarBg: PaletteColor
    pageHeader: PaletteColor
    cardHeader: PaletteColor
  }
  interface PaletteOptions {
    accent?: PaletteColorOptions
    featured?: PaletteColorOptions
    navBg?: PaletteColorOptions
    sidebarBg?: PaletteColorOptions
    pageHeader?: PaletteColorOptions
    cardHeader?: PaletteColorOptions
  }
}

// Allow `color="accent"` on Button and Chip for type-safety
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true
  }
}
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    accent: true
  }
}

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1A2634',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8192A6',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#3D5B78',
      dark: '#2F4860',
      light: '#4B6785',
      contrastText: '#ffffff',
    },
    featured: {
      main: '#A5CDE0',
      dark: '#7FB1C9',
      light: '#C7DEE9',
      contrastText: '#1A2634',
    },
    navBg: {
      main: '#1A2634',
      contrastText: '#ffffff',
    },
    sidebarBg: {
      main: '#2C313C',
      dark: '#363940',
      contrastText: '#ffffff',
    },
    pageHeader: {
      main: '#3D5B78',
      contrastText: '#ffffff',
    },
    cardHeader: {
      main: '#8192A6',
      contrastText: '#ffffff',
    },
    error: {
      main: '#DC2626',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16A34A',
    },
    background: {
      default: '#F0F2F5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A2634',
      secondary: '#4B6785',
      disabled: '#8192A6',
    },
    divider: '#E2E8F0',
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    // The enterprise look uses many ALL-CAPS tracking-wider labels.
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    button: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: { minHeight: '100vh' },
        '*, *::before, *::after': { boxSizing: 'border-box' },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'uppercase',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 2px 0 rgba(26, 38, 52, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#8192A6',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#E2E8F0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A2634',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        arrow: {
          color: '#1A2634',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(26, 38, 52, 0.08)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(26, 38, 52, 0.08)',
        },
      },
    },
  },
})

export default theme
