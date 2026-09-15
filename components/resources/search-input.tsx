"use client"

import { Search, X } from 'lucide-react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import type { SxProps, Theme } from '@mui/material/styles'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  sx?: SxProps<Theme>
  onKeyDown?: (e: React.KeyboardEvent) => void
  onSubmit?: () => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search resources...',
  sx,
  onKeyDown,
  onSubmit,
}: SearchInputProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      size="small"
      fullWidth
      sx={sx}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} color="var(--mui-palette-text-secondary)" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Clear search"
                onClick={() => onChange('')}
              >
                <X size={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  )
}

