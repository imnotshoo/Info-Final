'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createSale, updateSale } from '@/lib/actions/sales'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Sale, Category } from '@/lib/types'

interface SaleFormProps {
  sale?: Sale & { categories: { id: string; name: string; color: string } | null }
  categories: Category[]
}

export function SaleForm({ sale, categories }: SaleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = sale
      ? await updateSale(sale.id, formData)
      : await createSale(formData)

    if (result.error) {
      toast.error(result.error)
      setIsLoading(false)
      return
    }

    toast.success(sale ? 'Sale updated successfully' : 'Sale created successfully')
    router.push('/dashboard/sales')
    router.refresh()
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">
          {sale ? 'Edit Sale' : 'New Sale'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                name="product_name"
                defaultValue={sale?.product_name}
                placeholder="Enter product name"
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={sale?.category_id || ''}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue={sale?.quantity || 1}
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price *</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={sale?.unit_price}
                placeholder="0.00"
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                defaultValue={sale?.customer_name || ''}
                placeholder="Enter customer name"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Customer Email</Label>
              <Input
                id="customer_email"
                name="customer_email"
                type="email"
                defaultValue={sale?.customer_email || ''}
                placeholder="customer@example.com"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select name="status" defaultValue={sale?.status || 'pending'}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_date">Sale Date *</Label>
              <Input
                id="sale_date"
                name="sale_date"
                type="datetime-local"
                defaultValue={sale?.sale_date ? new Date(sale.sale_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                required
                className="border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={sale?.notes || ''}
              placeholder="Add any additional notes..."
              rows={3}
              className="border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {sale ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                sale ? 'Update Sale' : 'Create Sale'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
