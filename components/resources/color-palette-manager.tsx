"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { useResources } from '@/lib/resources-context'
import { ColorVariantPreview } from './tag-badge'
import type { ColorVariant, CreateColorVariantInput } from '@/lib/types'

export function ColorPaletteManager() {
  const {
    colorVariants,
    addColorVariant,
    updateColorVariant,
    deleteColorVariant,
    getColorVariantUsageCount,
  } = useResources()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ColorVariant | null>(null)
  const [deletingVariant, setDeletingVariant] = useState<ColorVariant | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleCreate = async (data: CreateColorVariantInput) => {
    await addColorVariant(data)
    setIsCreateOpen(false)
  }

  const handleUpdate = async (data: CreateColorVariantInput) => {
    if (editingVariant) {
      await updateColorVariant(editingVariant.id, data)
      setEditingVariant(null)
    }
  }

  const handleDelete = async () => {
    if (!deletingVariant) return
    try {
      await deleteColorVariant(deletingVariant.id)
      setDeletingVariant(null)
      setDeleteError(null)
    } catch (err) {
      setDeleteError((err as Error).message)
    }
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'cardHeader.main', py: 1, px: 2, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
        <Typography variant="overline" component="h3" sx={{ color: 'common.white', display: 'block', textAlign: 'center' }}>
          Color Palette
        </Typography>
      </Box>

      <Paper sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, p: 2 }}>
        <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
          {colorVariants.map((variant) => {
            const usage = getColorVariantUsageCount(variant.id)
            return (
              <Tooltip
                key={variant.id}
                arrow
                title={`${variant.name} - ${usage} tag${usage !== 1 ? 's' : ''}`}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setEditingVariant(variant)}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    p: 0,
                  }}
                >
                  <Badge
                    invisible={usage === 0}
                    badgeContent={usage}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'accent.main',
                        color: 'common.white',
                        fontSize: '0.5625rem',
                        minWidth: 16,
                        height: 16,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        bgcolor: variant.background,
                        border: variant.borderColor ? `2px solid ${variant.borderColor}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s',
                        boxShadow: '0 1px 2px 0 rgba(26, 38, 52, 0.05)',
                        '& .edit-icon': { opacity: 0, transition: 'opacity 0.15s' },
                        '&:hover': {
                          transform: 'scale(1.05)',
                          '& .edit-icon': { opacity: 1 },
                        },
                      }}
                    >
                      <Box className="edit-icon" sx={{ color: variant.text, display: 'flex' }}>
                        <Pencil size={16} />
                      </Box>
                    </Box>
                  </Badge>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: '0.625rem',
                    }}
                  >
                    {variant.name}
                  </Typography>
                </Box>
              </Tooltip>
            )
          })}

          <Box
            component="button"
            type="button"
            onClick={() => setIsCreateOpen(true)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              border: '2px dashed',
              borderColor: 'grey.300',
              bgcolor: 'transparent',
              color: 'grey.400',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              '&:hover': { borderColor: 'accent.main', color: 'accent.main' },
            }}
            aria-label="Add color variant"
          >
            <Plus size={20} />
          </Box>
        </Stack>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'text.secondary',
            fontSize: '0.625rem',
          }}
        >
          Click to edit - Numbers show tag usage
        </Typography>
      </Paper>

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="overline" component="span">Add Color Variant</Typography>
        </DialogTitle>
        <DialogContent>
          <ColorVariantForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingVariant} onClose={() => setEditingVariant(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="overline" component="span">Edit Color Variant</Typography>
        </DialogTitle>
        <DialogContent>
          {editingVariant && (
            <ColorVariantForm
              variant={editingVariant}
              onSubmit={handleUpdate}
              onCancel={() => setEditingVariant(null)}
              onDelete={() => {
                setDeletingVariant(editingVariant)
                setEditingVariant(null)
              }}
              usageCount={getColorVariantUsageCount(editingVariant.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deletingVariant}
        onClose={() => {
          setDeletingVariant(null)
          setDeleteError(null)
        }}
      >
        <DialogTitle>
          <Typography variant="overline" component="span">Delete Color Variant</Typography>
        </DialogTitle>
        <DialogContent>
          {deleteError ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
              <AlertCircle size={16} />
              <Typography variant="body2">{deleteError}</Typography>
            </Stack>
          ) : (
            <Typography variant="body2">
              Are you sure you want to delete the &ldquo;{deletingVariant?.name}&rdquo; color variant? This action cannot
              be undone.
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDeletingVariant(null)
                setDeleteError(null)
              }}
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

interface ColorVariantFormProps {
  variant?: ColorVariant
  onSubmit: (data: CreateColorVariantInput) => void
  onCancel: () => void
  onDelete?: () => void
  usageCount?: number
}

function ColorVariantForm({ variant, onSubmit, onCancel, onDelete, usageCount = 0 }: ColorVariantFormProps) {
  const [name, setName] = useState(variant?.name || '')
  const [background, setBackground] = useState(variant?.background || '#3D5B78')
  const [textColor, setTextColor] = useState<'light' | 'dark'>(
    variant?.text === '#FFFFFF' || !variant?.text ? 'light' : 'dark'
  )
  const [hasBorder, setHasBorder] = useState(!!variant?.borderColor)
  const [borderColor, setBorderColor] = useState(variant?.borderColor || '#CBD5E1')

  const textValue = textColor === 'light' ? '#FFFFFF' : '#475569'
  const previewVariant: ColorVariant = {
    id: 'preview',
    name: name || 'Sample Tag',
    background,
    text: textValue,
    borderColor: hasBorder ? borderColor : undefined,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      background,
      text: textValue,
      borderColor: hasBorder ? borderColor : undefined,
    })
  }

  const isValid = name.trim().length > 0

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Navy, Teal, Coral"
          size="small"
          fullWidth
        />

        <Stack spacing={1}>
          <FormLabel>Background Color</FormLabel>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="input"
              type="color"
              value={background}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackground(e.target.value)}
              sx={{
                height: 40,
                width: 64,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                p: 0,
                bgcolor: 'transparent',
              }}
            />
            <TextField
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="#3D5B78"
              size="small"
              fullWidth
              sx={{ '& input': { fontFamily: 'var(--font-geist-mono), monospace' } }}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <FormLabel>Text Color</FormLabel>
          <RadioGroup
            row
            value={textColor}
            onChange={(e) => setTextColor(e.target.value as 'light' | 'dark')}
          >
            <FormControlLabel
              value="light"
              control={<Radio size="small" />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ffffff', border: '1px solid', borderColor: 'grey.300' }} />
                  <Typography variant="caption">White</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              value="dark"
              control={<Radio size="small" />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'grey.600' }} />
                  <Typography variant="caption">Dark</Typography>
                </Stack>
              }
            />
          </RadioGroup>
        </Stack>

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasBorder}
                onChange={(_, v) => setHasBorder(v)}
                size="small"
              />
            }
            label={<Typography variant="overline">Add Border (for light backgrounds)</Typography>}
          />
          {hasBorder && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
              <Box
                component="input"
                type="color"
                value={borderColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBorderColor(e.target.value)}
                sx={{
                  height: 32,
                  width: 48,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  p: 0,
                  bgcolor: 'transparent',
                }}
              />
              <TextField
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                placeholder="#CBD5E1"
                size="small"
                fullWidth
                sx={{ '& input': { fontFamily: 'var(--font-geist-mono), monospace' } }}
              />
            </Stack>
          )}
        </Stack>

        <Stack spacing={1}>
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
            <ColorVariantPreview variant={previewVariant} label={name || 'Sample Tag'} size="md" />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
          <Box>
            {onDelete && usageCount === 0 && (
              <Button
                type="button"
                variant="text"
                color="error"
                size="small"
                startIcon={<Trash2 size={16} />}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
            {onDelete && usageCount > 0 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>
                Used by {usageCount} tag{usageCount !== 1 ? 's' : ''} - cannot delete
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button type="button" variant="outlined" size="small" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={!isValid}
              sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
            >
              {variant ? 'Save Changes' : 'Add Variant'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
