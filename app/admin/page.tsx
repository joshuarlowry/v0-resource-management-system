"use client"

import { useState, useEffect } from 'react'
import { Settings, Save } from 'lucide-react'
import { AppShell } from '@/components/resources/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResources } from '@/lib/resources-context'

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings, isLoading } = useResources()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Sync local state with context when loaded
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
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground text-sm uppercase tracking-wider">Loading...</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Admin Settings">
      <div className="space-y-6 max-w-2xl">
        {/* Site Settings Card */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="bg-[#8192A6] py-2 px-4">
            <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center">
              <Settings className="h-4 w-4" />
              Site Configuration
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Site Title */}
            <div className="space-y-2">
              <Label htmlFor="siteTitle" className="text-xs uppercase tracking-wider font-bold text-card-foreground">
                Site Title
              </Label>
              <Input
                id="siteTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter site title"
                className="bg-card border-border rounded-md"
              />
              <p className="text-[11px] text-muted-foreground">
                The site title appears in the top navigation bar and browser tab.
              </p>
            </div>

            {/* Site Description */}
            <div className="space-y-2">
              <Label htmlFor="siteDescription" className="text-xs uppercase tracking-wider font-bold text-card-foreground">
                Site Description
              </Label>
              <Textarea
                id="siteDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter site description"
                className="bg-card border-border rounded-md resize-none"
                rows={3}
              />
              <p className="text-[11px] text-muted-foreground">
                Used for SEO and meta descriptions.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 text-xs uppercase tracking-wider bg-[#3D5B78] hover:bg-[#4B6785] text-white rounded-md"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              {showSuccess && (
                <span className="text-xs uppercase tracking-wider text-green-600">
                  Settings saved successfully
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#A5CDE0]/20 rounded-md border border-[#3D5B78]/30 p-4">
          <p className="text-xs text-[#3D5B78]">
            <strong className="uppercase tracking-wider">Note:</strong> These settings are stored in-memory for demonstration purposes. 
            Changes will reset when the page is refreshed. In production, these would be persisted to a database.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="bg-[#8192A6] py-2 px-4">
            <span className="text-white text-xs font-bold uppercase tracking-wider block text-center">
              Quick Links
            </span>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-3">
            <a 
              href="/admin/resources"
              className="flex flex-col items-center justify-center p-4 rounded-md bg-slate-100 hover:bg-[#8192A6] hover:text-white transition-colors group"
            >
              <span className="text-xs uppercase tracking-wider font-medium text-slate-600 group-hover:text-white">
                Manage Resources
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-white/80">
                Add, edit, and organize resources
              </span>
            </a>
            <a 
              href="/admin/tags"
              className="flex flex-col items-center justify-center p-4 rounded-md bg-slate-100 hover:bg-[#8192A6] hover:text-white transition-colors group"
            >
              <span className="text-xs uppercase tracking-wider font-medium text-slate-600 group-hover:text-white">
                Manage Tags
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-white/80">
                Configure tags and color palette
              </span>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
