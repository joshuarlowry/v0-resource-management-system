"use client"

import * as React from 'react'
import Link from 'next/link'
import {
  Plus,
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
  Tags,
  Eye,
} from 'lucide-react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { format } from 'date-fns'
import { useResources } from '@/lib/resources-context'
import { AppShell } from '@/components/resources/app-shell'
import { ResourceTypeIcon, getResourceTypeLabel } from '@/components/resources/resource-type-icon'
import { ResourceForm } from '@/components/resources/resource-form'
import { TagBadge } from '@/components/resources/tag-badge'
import { SearchInput } from '@/components/resources/search-input'
import type { Resource } from '@/lib/types'

export default function AdminResourcesPage() {
  const {
    resources,
    tags,
    badges,
    courses,
    addResource,
    updateResource,
    deleteResource,
    toggleStar,
    bulkStar,
    bulkUnstar,
    bulkDelete,
  } = useResources()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingResource, setEditingResource] = React.useState<Resource | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [menuState, setMenuState] = React.useState<{ anchor: HTMLElement; resource: Resource } | null>(
    null
  )

  const filteredResources = React.useMemo(() => {
    if (!searchQuery) return resources
    const q = searchQuery.toLowerCase()
    return resources.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    )
  }, [resources, searchQuery])

  const sortedResources = React.useMemo(
    () =>
      [...filteredResources].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [filteredResources]
  )

  const allSelected = selectedIds.length === sortedResources.length && sortedResources.length > 0
  const someSelected = selectedIds.length > 0 && selectedIds.length < sortedResources.length

  const toggleAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(sortedResources.map((r) => r.id))
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleCreate = async (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addResource(data)
    setIsCreateOpen(false)
  }

  const handleEdit = async (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingResource) {
      await updateResource(editingResource.id, data)
      setEditingResource(null)
    }
  }

  const handleDelete = async () => {
    if (deletingId) {
      await deleteResource(deletingId)
      setSelectedIds((prev) => prev.filter((id) => id !== deletingId))
      setDeletingId(null)
    }
  }

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds)
    setSelectedIds([])
  }

  const handleBulkStar = async () => {
    await bulkStar(selectedIds)
  }

  const handleBulkUnstar = async () => {
    await bulkUnstar(selectedIds)
  }

  const openMenu = (e: React.MouseEvent<HTMLElement>, resource: Resource) => {
    setMenuState({ anchor: e.currentTarget, resource })
  }
  const closeMenu = () => setMenuState(null)

  return (
    <AppShell title="Manage Resources">
      <Stack spacing={3}>
        {/* Action bar */}
        <Paper sx={{ py: 1.5, px: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
          >
            <Box sx={{ width: { xs: '100%', sm: 320 } }}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search resources..."
              />
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Button
                component={Link}
                href="/admin/tags"
                variant="outlined"
                size="small"
                startIcon={<Tags size={16} />}
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
                Manage Tags
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={() => setIsCreateOpen(true)}
                sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
              >
                Add Resource
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Bulk action bar */}
        {selectedIds.length > 0 && (
          <Box
            sx={{
              bgcolor: 'rgba(165, 205, 224, 0.2)',
              border: '1px solid',
              borderColor: 'rgba(61, 91, 120, 0.3)',
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="overline" sx={{ color: 'accent.main' }}>
                {selectedIds.length} selected
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Star size={16} />}
                onClick={handleBulkStar}
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
                Star
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleBulkUnstar}
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
                Unstar
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Trash2 size={16} />}
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        )}

        {/* Table */}
        <Paper sx={{ overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                      inputProps={{ 'aria-label': 'Select all' }}
                      sx={{ color: 'common.white', '&.Mui-checked': { color: 'common.white' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 32 }} />
                  <TableCell sx={{ minWidth: 200 }}>Title</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Type</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Tags</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Updated</TableCell>
                  <TableCell sx={{ width: 48 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedResources.map((resource) => {
                  const resourceTags = resource.tags
                    .map((tagId) => tags.find((t) => t.id === tagId))
                    .filter(Boolean) as typeof tags

                  return (
                    <TableRow
                      key={resource.id}
                      hover
                      sx={{
                        ...(resource.isStarred && { bgcolor: 'rgba(165, 205, 224, 0.1)' }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(resource.id)}
                          onChange={() => toggleSelected(resource.id)}
                          inputProps={{ 'aria-label': `Select ${resource.title}` }}
                        />
                      </TableCell>
                      <TableCell sx={{ pr: 0 }}>
                        {resource.isStarred && (
                          <Star size={16} fill="#3D5B78" color="#3D5B78" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <ResourceTypeIcon type={resource.type} size="sm" />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: { xs: 160, sm: 320 },
                              }}
                            >
                              {resource.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'block',
                                maxWidth: { xs: 160, sm: 320 },
                              }}
                            >
                              {resource.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                          {getResourceTypeLabel(resource.type)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ maxWidth: 180 }}>
                          {resourceTags.slice(0, 2).map((tag) => (
                            <TagBadge
                              key={tag.id}
                              name={tag.name}
                              colorVariantId={tag.colorVariantId}
                              size="sm"
                            />
                          ))}
                          {resourceTags.length > 2 && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', alignSelf: 'center' }}
                            >
                              +{resourceTags.length - 2}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {format(new Date(resource.updatedAt), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => openMenu(e, resource)}
                          aria-label={`Actions for ${resource.title}`}
                        >
                          <MoreHorizontal size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {sortedResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ height: 128, textAlign: 'center' }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                        {searchQuery ? 'No resources found' : 'No resources yet'}
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
          {sortedResources.length} OF {resources.length} RESOURCES
        </Typography>
      </Stack>

      {/* Row menu */}
      <Menu
        anchorEl={menuState?.anchor ?? null}
        open={Boolean(menuState)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menuState && (
          <Box>
            <MenuItem component={Link} href={`/resources/${menuState.resource.id}`} onClick={closeMenu}>
              <ListItemIcon>
                <Eye size={16} />
              </ListItemIcon>
              <ListItemText>View</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setEditingResource(menuState.resource)
                closeMenu()
              }}
            >
              <ListItemIcon>
                <Pencil size={16} />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await toggleStar(menuState.resource.id)
                closeMenu()
              }}
            >
              <ListItemIcon>
                <Star
                  size={16}
                  fill={menuState.resource.isStarred ? '#3D5B78' : 'none'}
                  color={menuState.resource.isStarred ? '#3D5B78' : 'currentColor'}
                />
              </ListItemIcon>
              <ListItemText>{menuState.resource.isStarred ? 'Unstar' : 'Star'}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setDeletingId(menuState.resource.id)
                closeMenu()
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Trash2 size={16} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Box>
        )}
      </Menu>

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="overline" component="span">
            Create Resource
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '75vh' }}>
          <ResourceForm
            tags={tags}
            badges={badges}
            courses={courses}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={Boolean(editingResource)}
        onClose={() => setEditingResource(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="overline" component="span">
            Edit Resource
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '75vh' }}>
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

      {/* Delete confirmation */}
      <Dialog open={Boolean(deletingId)} onClose={() => setDeletingId(null)}>
        <DialogTitle>
          <Typography variant="overline" component="span">
            Delete Resource
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this resource? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeletingId(null)}>
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
