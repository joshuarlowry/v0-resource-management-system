"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Save } from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { AppShell } from '@/components/resources/app-shell'
import { useResources } from '@/lib/resources-context'

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings, isLoading } = useResources()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setTitle(siteSettings.title)
      setDescription(siteSettings.description)
    }
  }, [isLoading, siteSettings.title, siteSettings.description])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSiteSettings({ title, description })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppShell title="Admin Settings">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Loading...</Typography>
        </Box>
      </AppShell>
    )
  }

  return (
    <AppShell title="Admin Settings">
      <Stack spacing={3} sx={{ maxWidth: 640 }}>
        <Paper sx={{ overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ color: 'common.white' }}>
              <Settings size={16} />
              <Typography variant="overline" sx={{ color: 'inherit' }}>Site Configuration</Typography>
            </Stack>
          </Box>

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box>
              <TextField
                label="Site Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter site title"
                size="small"
                fullWidth
                helperText="The site title appears in the top navigation bar and browser tab."
              />
            </Box>

            <Box>
              <TextField
                label="Site Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter site description"
                size="small"
                fullWidth
                multiline
                rows={3}
                helperText="Used for SEO and meta descriptions."
              />
            </Box>

            <Divider />

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                disabled={isSaving}
                onClick={handleSave}
                startIcon={<Save size={16} />}
                sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              {showSuccess && (
                <Typography variant="overline" sx={{ color: 'success.main' }}>
                  Settings saved successfully
                </Typography>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            bgcolor: 'rgba(165, 205, 224, 0.2)',
            border: '1px solid',
            borderColor: 'rgba(61, 91, 120, 0.3)',
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'accent.main' }}>
            <Box component="strong" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Note:</Box>{' '}
            These settings are stored in-memory for demonstration purposes. Changes will reset when the page is
            refreshed. In production, these would be persisted to a database.
          </Typography>
        </Box>

        <Paper sx={{ overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
            <Typography variant="overline" sx={{ color: 'common.white', display: 'block', textAlign: 'center' }}>
              Quick Links
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <QuickLink href="/admin/resources" title="Manage Resources" subtitle="Add, edit, and organize resources" />
            <QuickLink href="/admin/tags" title="Manage Tags" subtitle="Configure tags and color palette" />
          </Box>
        </Paper>
      </Stack>
    </AppShell>
  )
}

function QuickLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderRadius: 1,
        bgcolor: 'grey.100',
        textDecoration: 'none',
        color: 'text.secondary',
        transition: 'all 0.15s',
        '&:hover': {
          bgcolor: 'secondary.main',
          color: 'common.white',
        },
      }}
    >
      <Typography variant="overline" sx={{ color: 'inherit', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.625rem' }}>
        {subtitle}
      </Typography>
    </Box>
  )
}
