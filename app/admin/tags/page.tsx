"use client"

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Check } from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormLabel from '@mui/material/FormLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { TagBadge, ColorVariantPreview } from '@/components/resources/tag-badge'
import { ColorPaletteManager } from '@/components/resources/color-palette-manager'
import type { Tag } from '@/lib/types'

export default function TagsAdminPage() {
  const {
    tags,
    colorVariants,
    addTag,
    updateTag,
    deleteTag,
    getTagUsageCount,
    getColorVariant,
  } = useResources()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = React.useState<Tag | null>(null)

  const [name, setName] = React.useState('')
  const [selectedVariantId, setSelectedVariantId] = React.useState(colorVariants[0]?.id ?? '')

  const openCreate = () => {
    setName('')
    setSelectedVariantId(colorVariants[0]?.id ?? '')
    setIsCreateOpen(true)
  }

  const openEdit = (tag: Tag) => {
    setName(tag.name)
    setSelectedVariantId(tag.colorVariantId)
    setEditingTag(tag)
  }

  const handleCreate = async () => {
    if (!name.trim() || !selectedVariantId) return
    await addTag({ name: name.trim(), colorVariantId: selectedVariantId })
    setIsCreateOpen(false)
    setName('')
    setSelectedVariantId(colorVariants[0]?.id ?? '')
  }

  const handleEdit = async () => {
    if (!editingTag || !name.trim() || !selectedVariantId) return
    await updateTag(editingTag.id, { name: name.trim(), colorVariantId: selectedVariantId })
    setEditingTag(null)
    setName('')
    setSelectedVariantId(colorVariants[0]?.id ?? '')
  }

  const handleDelete = async () => {
    if (!deletingTag) return
    try {
      await deleteTag(deletingTag.id)
      setDeletingTag(null)
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const selectedVariant = colorVariants.find((v) => v.id === selectedVariantId)

  return (
    <AppShell title="Manage Tags">
      <Box sx={{ maxWidth: 960 }}>
        <Stack spacing={3}>
          {/* Top bar */}
          <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center" justifyContent="space-between">
            <Button
              component={Link}
              href="/admin"
              variant="outlined"
              size="small"
              startIcon={<ArrowLeft size={16} />}
              sx={{
                bgcolor: 'grey.100',
                color: 'text.secondary',
                borderColor: 'grey.200',
                '&:hover': {
                  bgcolor: 'secondary.main',
                  color: 'common.white',
                  borderColor: 'secondary.main',
                },
              }}
            >
              Back to Admin
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={openCreate}
              sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
            >
              Add Tag
            </Button>
          </Stack>

          {/* Color palette */}
          <ColorPaletteManager />

          {/* Tags table */}
          <Paper sx={{ overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2 }}>
              <Typography
                variant="overline"
                component="h3"
                sx={{ color: 'common.white', display: 'block', textAlign: 'center' }}
              >
                Tags
              </Typography>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Color Variant</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Usage</TableCell>
                    <TableCell sx={{ width: 96 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tags.map((tag) => {
                    const usageCount = getTagUsageCount(tag.id)
                    const variant = getColorVariant(tag.colorVariantId)
                    return (
                      <TableRow key={tag.id} hover>
                        <TableCell>
                          <Box>
                            <TagBadge name={tag.name} colorVariantId={tag.colorVariantId} size="md" />
                            {/* Mobile-only inline details */}
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                              sx={{ mt: 0.5, display: { xs: 'flex', sm: 'none' } }}
                            >
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 0.5,
                                    bgcolor: variant?.background ?? '#E2E8F0',
                                    border: variant?.borderColor
                                      ? `1px solid ${variant.borderColor}`
                                      : 'none',
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>
                                  {variant?.name ?? 'Unknown'}
                                </Typography>
                              </Stack>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>
                                {usageCount} resource{usageCount !== 1 ? 's' : ''}
                              </Typography>
                            </Stack>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: 1,
                                bgcolor: variant?.background ?? '#E2E8F0',
                                border: variant?.borderColor ? `1px solid ${variant.borderColor}` : 'none',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {variant?.name ?? 'Unknown'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {usageCount} resource{usageCount !== 1 ? 's' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              onClick={() => openEdit(tag)}
                              aria-label={`Edit ${tag.name}`}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setDeletingTag(tag)}
                              aria-label={`Delete ${tag.name}`}
                              sx={{ color: 'error.main' }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {tags.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ height: 128, textAlign: 'center' }}>
                        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                          No tags yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'secondary.main',
              fontSize: '0.6875rem',
            }}
          >
            {tags.length} TAG{tags.length !== 1 ? 'S' : ''}
          </Typography>
        </Stack>
      </Box>

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="overline" component="span">
            Create Tag
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TagFormFields
            name={name}
            onNameChange={setName}
            selectedVariantId={selectedVariantId}
            onSelectedVariantIdChange={setSelectedVariantId}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsCreateOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!name.trim() || !selectedVariantId}
            sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
          >
            Create Tag
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={Boolean(editingTag)} onClose={() => setEditingTag(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="overline" component="span">
            Edit Tag
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TagFormFields
            name={name}
            onNameChange={setName}
            selectedVariantId={selectedVariantId}
            onSelectedVariantIdChange={setSelectedVariantId}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditingTag(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEdit}
            disabled={!name.trim() || !selectedVariantId}
            sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deletingTag)} onClose={() => setDeletingTag(null)}>
        <DialogTitle>
          <Typography variant="overline" component="span">
            Delete Tag
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete the tag &ldquo;{deletingTag?.name}&rdquo;?
          </Typography>
          {deletingTag && getTagUsageCount(deletingTag.id) > 0 && (
            <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 500, color: 'error.main' }}>
              This tag is used by {getTagUsageCount(deletingTag.id)} resource
              {getTagUsageCount(deletingTag.id) !== 1 ? 's' : ''} and will be removed from them.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeletingTag(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  )
}

interface TagFormFieldsProps {
  name: string
  onNameChange: (v: string) => void
  selectedVariantId: string
  onSelectedVariantIdChange: (v: string) => void
}

function TagFormFields({
  name,
  onNameChange,
  selectedVariantId,
  onSelectedVariantIdChange,
}: TagFormFieldsProps) {
  const { colorVariants } = useResources()
  const selectedVariant = colorVariants.find((v) => v.id === selectedVariantId)

  return (
    <Stack spacing={3}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter tag name"
        size="small"
        fullWidth
        autoFocus
      />

      <Stack spacing={1.25}>
        <FormLabel>Color</FormLabel>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {colorVariants.map((variant) => {
            const isSelected = selectedVariantId === variant.id
            return (
              <Box
                key={variant.id}
                component="button"
                type="button"
                onClick={() => onSelectedVariantIdChange(variant.id)}
                sx={{
                  position: 'relative',
                  height: 40,
                  minWidth: 80,
                  px: 1.5,
                  borderRadius: 1,
                  bgcolor: variant.background,
                  color: variant.text,
                  border: variant.borderColor ? `1px solid ${variant.borderColor}` : 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  outline: isSelected ? '2px solid' : 'none',
                  outlineColor: 'accent.main',
                  outlineOffset: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 500, color: 'inherit' }}
                >
                  {variant.name}
                </Typography>
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: 'accent.main',
                      color: 'common.white',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} />
                  </Box>
                )}
              </Box>
            )
          })}
        </Stack>
        {colorVariants.length === 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            No color variants available. Add colors in the Color Palette above.
          </Typography>
        )}
      </Stack>

      <Stack spacing={1.25}>
        <FormLabel>Preview</FormLabel>
        <Box
          sx={{
            bgcolor: 'rgba(232, 234, 237, 0.3)',
            borderRadius: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {selectedVariant ? (
            <ColorVariantPreview variant={selectedVariant} label={name || 'Tag Name'} size="md" />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Select a color
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}
