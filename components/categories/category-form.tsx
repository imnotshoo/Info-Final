'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createCategory, updateCategory } from '@/lib/actions/categories'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Category } from '@/lib/types'

const colorOptions = [
  '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', 
  '#ec4899', '#06b6d4', '#6366f1', '#ef4444',
  '#14b8a6', '#f97316', '#84cc16', '#a855f7',
]

interface CategoryFormProps {
  category?: Category
  open: boolean
  onClose: () => void
}

export function CategoryForm({ category, open, onClose }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(category?.color || '#3b82f6')

  async function handleSubmit(formData: FormData) {
    formData.set('color', selectedColor)
    setIsLoading(true)

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData)

    if (result.error) {
      toast.error(result.error)
      setIsLoading(false)
      return
    }

    toast.success(category ? 'Category updated successfully' : 'Category created successfully')
    setIsLoading(false)
    onClose()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'New Category'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              placeholder="Enter category name"
              required
              className="border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description || ''}
              placeholder="Enter category description"
              rows={3}
              className="border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                category ? 'Update Category' : 'Create Category'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
