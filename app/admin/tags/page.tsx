"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Check } from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { TagBadge, ColorVariantPreview } from '@/components/resources/tag-badge'
import { ColorPaletteManager } from '@/components/resources/color-palette-manager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Tag, CreateTagInput } from '@/lib/types'

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
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  
  const [name, setName] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState(colorVariants[0]?.id || '')

  const openCreate = () => {
    setName('')
    setSelectedVariantId(colorVariants[0]?.id || '')
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
    setSelectedVariantId(colorVariants[0]?.id || '')
  }

  const handleEdit = async () => {
    if (!editingTag || !name.trim() || !selectedVariantId) return
    await updateTag(editingTag.id, { name: name.trim(), colorVariantId: selectedVariantId })
    setEditingTag(null)
    setName('')
    setSelectedVariantId(colorVariants[0]?.id || '')
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

  const selectedVariant = colorVariants.find(v => v.id === selectedVariantId)

  return (
    <AppShell title="Manage Tags">
      <div className="max-w-3xl space-y-6">
        {/* Back Button & Add */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="gap-2 text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md" 
            onClick={openCreate}
          >
            <Plus className="h-4 w-4" />
            Add Tag
          </Button>
        </div>

        {/* Color Palette Manager */}
        <ColorPaletteManager />

        {/* Tags Table */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="bg-[#8192A6] py-2 px-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white text-center">
              Tags
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-card-foreground">Tag</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-card-foreground hidden sm:table-cell">Color Variant</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-card-foreground hidden sm:table-cell">Usage</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map(tag => {
                  const usageCount = getTagUsageCount(tag.id)
                  const variant = getColorVariant(tag.colorVariantId)
                  return (
                    <TableRow key={tag.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <TagBadge name={tag.name} colorVariantId={tag.colorVariantId} size="md" />
                          {/* Mobile-only: show color + usage inline */}
                          <div className="sm:hidden flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <span 
                                className="h-3 w-3 rounded"
                                style={{ 
                                  backgroundColor: variant?.background || '#E2E8F0',
                                  border: variant?.borderColor ? `1px solid ${variant.borderColor}` : undefined,
                                }}
                              />
                              <span className="text-[10px] text-muted-foreground">{variant?.name || 'Unknown'}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{usageCount} resource{usageCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span 
                            className="h-4 w-4 rounded-md"
                            style={{ 
                              backgroundColor: variant?.background || '#E2E8F0',
                              border: variant?.borderColor ? `1px solid ${variant.borderColor}` : undefined,
                            }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {variant?.name || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {usageCount} resource{usageCount !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEdit(tag)}
                            className="hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeletingTag(tag)}
                            className="hover:bg-muted"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {tags.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">No tags yet</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-[#8192A6]">
          {tags.length} TAG{tags.length !== 1 ? 'S' : ''}
        </p>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Create Tag</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new tag by entering a name and selecting a color variant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name" className="text-xs uppercase tracking-wider">Name</Label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                className="bg-card border-border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map(variant => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      'relative h-10 min-w-[80px] px-3 rounded-md transition-all flex items-center justify-center',
                      selectedVariantId === variant.id && 'ring-2 ring-offset-2 ring-[#3D5B78]'
                    )}
                    style={{ 
                      backgroundColor: variant.background,
                      color: variant.text,
                      border: variant.borderColor ? `1px solid ${variant.borderColor}` : undefined,
                    }}
                  >
                    <span className="text-xs font-medium">{variant.name}</span>
                    {selectedVariantId === variant.id && (
                      <Check className="absolute -top-1 -right-1 h-4 w-4 bg-[#3D5B78] text-white rounded-full p-0.5" />
                    )}
                  </button>
                ))}
              </div>
              {colorVariants.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No color variants available. Add colors in the Color Palette above.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Preview</Label>
              <div className="bg-muted/30 p-4 rounded-md">
                {selectedVariant ? (
                  <ColorVariantPreview 
                    variant={selectedVariant} 
                    label={name || 'Tag Name'} 
                    size="md" 
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Select a color</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
                className="text-xs uppercase tracking-wider border-border rounded-md"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={!name.trim() || !selectedVariantId}
                className="text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md"
              >
                Create Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent className="bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Edit Tag</DialogTitle>
            <DialogDescription className="sr-only">
              Edit the tag name and color variant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name" className="text-xs uppercase tracking-wider">Name</Label>
              <Input
                id="edit-tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                className="bg-card border-border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map(variant => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      'relative h-10 min-w-[80px] px-3 rounded-md transition-all flex items-center justify-center',
                      selectedVariantId === variant.id && 'ring-2 ring-offset-2 ring-[#3D5B78]'
                    )}
                    style={{ 
                      backgroundColor: variant.background,
                      color: variant.text,
                      border: variant.borderColor ? `1px solid ${variant.borderColor}` : undefined,
                    }}
                  >
                    <span className="text-xs font-medium">{variant.name}</span>
                    {selectedVariantId === variant.id && (
                      <Check className="absolute -top-1 -right-1 h-4 w-4 bg-[#3D5B78] text-white rounded-full p-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Preview</Label>
              <div className="bg-muted/30 p-4 rounded-md">
                {selectedVariant ? (
                  <ColorVariantPreview 
                    variant={selectedVariant} 
                    label={name || 'Tag Name'} 
                    size="md" 
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Select a color</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setEditingTag(null)}
                className="text-xs uppercase tracking-wider border-border rounded-md"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEdit} 
                disabled={!name.trim() || !selectedVariantId}
                className="text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingTag} onOpenChange={() => setDeletingTag(null)}>
        <AlertDialogContent className="bg-card border-border rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold uppercase tracking-wider">Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag &ldquo;{deletingTag?.name}&rdquo;? 
              {deletingTag && getTagUsageCount(deletingTag.id) > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  This tag is used by {getTagUsageCount(deletingTag.id)} resource(s) and will be removed from them.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs uppercase tracking-wider border-border rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="text-xs uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}
