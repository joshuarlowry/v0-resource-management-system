"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { ColorVariantPreview } from './tag-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ColorVariant, CreateColorVariantInput } from '@/lib/types'

interface ColorPaletteManagerProps {
  className?: string
}

export function ColorPaletteManager({ className }: ColorPaletteManagerProps) {
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
    if (deletingVariant) {
      try {
        await deleteColorVariant(deletingVariant.id)
        setDeletingVariant(null)
        setDeleteError(null)
      } catch (error) {
        setDeleteError((error as Error).message)
      }
    }
  }

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="bg-[#8192A6] py-2 px-4 rounded-t-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white text-center">
          Color Palette
        </h3>
      </div>

      {/* Palette Grid */}
      <div className="bg-card rounded-b-md shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <TooltipProvider>
            {colorVariants.map(variant => {
              const usageCount = getColorVariantUsageCount(variant.id)
              return (
                <Tooltip key={variant.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setEditingVariant(variant)}
                      className="group relative flex flex-col items-center"
                    >
                      <div 
                        className="h-12 w-12 rounded-md shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                        style={{ 
                          backgroundColor: variant.background,
                          border: variant.borderColor ? `2px solid ${variant.borderColor}` : undefined,
                        }}
                      >
                        <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: variant.text }} />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        {variant.name}
                      </span>
                      {usageCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#3D5B78] text-white text-[9px] flex items-center justify-center">
                          {usageCount}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border-border rounded-md">
                    <p className="text-xs">{variant.name} - {usageCount} tag{usageCount !== 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>

          {/* Add New Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-12 w-12 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#3D5B78] hover:text-[#3D5B78] transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 text-center uppercase tracking-wider">
          Click to edit - Numbers show tag usage
        </p>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Add Color Variant</DialogTitle>
            <DialogDescription className="sr-only">
              Add a new color variant to the palette by specifying a name and colors.
            </DialogDescription>
          </DialogHeader>
          <ColorVariantForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingVariant} onOpenChange={() => setEditingVariant(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Edit Color Variant</DialogTitle>
            <DialogDescription className="sr-only">
              Edit the color variant name and color values.
            </DialogDescription>
          </DialogHeader>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingVariant} onOpenChange={() => { setDeletingVariant(null); setDeleteError(null); }}>
        <AlertDialogContent className="bg-card border-border rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold uppercase tracking-wider">Delete Color Variant</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <span className="text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {deleteError}
                </span>
              ) : (
                <>Are you sure you want to delete the &ldquo;{deletingVariant?.name}&rdquo; color variant? This action cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs uppercase tracking-wider border-border rounded-md">Cancel</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction 
                onClick={handleDelete} 
                className="text-xs uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ============================================
// Color Variant Form
// ============================================

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider">Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Navy, Teal, Coral"
          className="bg-card border-border rounded-md"
        />
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider">Background Color</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="h-10 w-16 rounded-md cursor-pointer border border-border"
          />
          <Input
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="#3D5B78"
            className="flex-1 font-mono text-sm bg-card border-border rounded-md"
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider">Text Color</Label>
        <RadioGroup 
          value={textColor} 
          onValueChange={(v) => setTextColor(v as 'light' | 'dark')}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="light" id="text-light" />
            <Label htmlFor="text-light" className="cursor-pointer flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-white border border-slate-300" />
              <span className="text-xs">White</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="dark" id="text-dark" />
            <Label htmlFor="text-dark" className="cursor-pointer flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-slate-600" />
              <span className="text-xs">Dark</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Border Option */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="has-border"
            checked={hasBorder}
            onChange={(e) => setHasBorder(e.target.checked)}
            className="rounded border-border"
          />
          <Label htmlFor="has-border" className="text-xs uppercase tracking-wider cursor-pointer">
            Add Border (for light backgrounds)
          </Label>
        </div>
        {hasBorder && (
          <div className="flex items-center gap-3 ml-5">
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="h-8 w-12 rounded cursor-pointer border border-border"
            />
            <Input
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              placeholder="#CBD5E1"
              className="flex-1 font-mono text-sm bg-card border-border rounded-md"
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider">Preview</Label>
        <div className="bg-muted/30 rounded-md p-4 flex items-center justify-center">
          <ColorVariantPreview variant={previewVariant} label={name || 'Sample Tag'} size="md" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {onDelete && usageCount === 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="text-xs uppercase tracking-wider">Delete</span>
            </Button>
          )}
          {onDelete && usageCount > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Used by {usageCount} tag{usageCount !== 1 ? 's' : ''} - cannot delete
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs uppercase tracking-wider border-border rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isValid}
            className="text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md"
          >
            {variant ? 'Save Changes' : 'Add Variant'}
          </Button>
        </div>
      </div>
    </form>
  )
}
