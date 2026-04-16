"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Star, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Tags,
  Eye
} from 'lucide-react'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { ResourceForm } from '@/components/resources/resource-form'
import { TagBadge } from '@/components/resources/tag-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Resource } from '@/lib/types'

export default function AdminPage() {
  const { 
    resources, 
    tags, 
    badges, 
    courses,
    addResource,
    updateResource,
    deleteResource,
    toggleStar,
  } = useResources()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredResources = useMemo(() => {
    if (!searchQuery) return resources
    
    const query = searchQuery.toLowerCase()
    return resources.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    )
  }, [resources, searchQuery])

  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [filteredResources])

  const allSelected = selectedIds.length === sortedResources.length && sortedResources.length > 0
  const someSelected = selectedIds.length > 0 && selectedIds.length < sortedResources.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedResources.map(r => r.id))
    }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleCreate = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    addResource(data)
    setIsCreateOpen(false)
  }

  const handleEdit = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingResource) {
      updateResource(editingResource.id, data)
      setEditingResource(null)
    }
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteResource(deletingId)
      setDeletingId(null)
      setSelectedIds(prev => prev.filter(id => id !== deletingId))
    }
  }

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteResource(id))
    setSelectedIds([])
  }

  const handleBulkStar = () => {
    selectedIds.forEach(id => {
      const resource = resources.find(r => r.id === id)
      if (resource && !resource.isStarred) {
        toggleStar(id)
      }
    })
  }

  const handleBulkUnstar = () => {
    selectedIds.forEach(id => {
      const resource = resources.find(r => r.id === id)
      if (resource && resource.isStarred) {
        toggleStar(id)
      }
    })
  }

  return (
    <AppShell title="Manage Resources">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="bg-card rounded-md shadow-sm py-2 px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="pl-9 bg-card border-border rounded-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/admin/tags">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
                >
                  <Tags className="h-4 w-4" />
                  Manage Tags
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="gap-2 text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md" 
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-[#A5CDE0]/20 rounded-md border border-[#3D5B78]/30 p-3">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#3D5B78]">
                {selectedIds.length} selected
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkStar}
                className="text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
              >
                <Star className="h-4 w-4 mr-1" />
                Star
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkUnstar}
                className="text-xs uppercase tracking-wider bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#8192A6] hover:text-white rounded-md"
              >
                Unstar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkDelete}
                className="text-xs uppercase tracking-wider border-destructive text-destructive hover:bg-destructive hover:text-white rounded-md"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Resource Table */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#8192A6] hover:bg-[#8192A6]">
                  <TableHead className="w-12 text-white">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                      className={cn(someSelected && "data-[state=checked]:bg-muted")}
                    />
                  </TableHead>
                  <TableHead className="w-8 text-white"></TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-white min-w-[180px]">Title</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-white hidden sm:table-cell">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-white hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-white hidden md:table-cell">Updated</TableHead>
                  <TableHead className="w-12 text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResources.map(resource => {
                  const resourceTags = resource.tags
                    .map(tagId => tags.find(t => t.id === tagId))
                    .filter(Boolean)

                  return (
                    <TableRow 
                      key={resource.id}
                      className={cn(
                        'hover:bg-muted/50',
                        resource.isStarred && 'bg-[#A5CDE0]/10'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(resource.id)}
                          onCheckedChange={() => toggleSelected(resource.id)}
                          aria-label={`Select ${resource.title}`}
                        />
                      </TableCell>
                      <TableCell className="pr-0">
                        {resource.isStarred && (
                          <Star className="h-4 w-4 fill-[#3D5B78] text-[#3D5B78]" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ResourceTypeIcon type={resource.type} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[140px] sm:max-w-xs text-card-foreground">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-xs">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {getResourceTypeLabel(resource.type)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {resourceTags.slice(0, 2).map(tag => tag && (
                            <TagBadge key={tag.id} name={tag.name} colorVariantId={tag.colorVariantId} size="sm" />
                          ))}
                          {resourceTags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{resourceTags.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(resource.updatedAt), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border rounded-md">
                            <DropdownMenuItem asChild>
                              <Link href={`/resources/${resource.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingResource(resource)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStar(resource.id)}>
                              <Star className={cn(
                                "h-4 w-4 mr-2",
                                resource.isStarred && "fill-[#3D5B78] text-[#3D5B78]"
                              )} />
                              {resource.isStarred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeletingId(resource.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {sortedResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {searchQuery ? 'No resources found' : 'No resources yet'}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-[11px] uppercase tracking-wider text-[#8192A6]">
          {sortedResources.length} OF {resources.length} RESOURCES
        </p>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Create Resource</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new resource by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          <ResourceForm
            tags={tags}
            badges={badges}
            courses={courses}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Edit Resource</DialogTitle>
            <DialogDescription className="sr-only">
              Edit the resource details using the form below.
            </DialogDescription>
          </DialogHeader>
          {editingResource && (
            <ResourceForm
              resource={editingResource}
              tags={tags}
              badges={badges}
              courses={courses}
              onSubmit={handleEdit}
              onCancel={() => setEditingResource(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-card border-border rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold uppercase tracking-wider">Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
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
