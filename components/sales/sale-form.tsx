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

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
      return
    }

    toast.success(sale ? 'Sale updated successfully' : 'Sale created successfully')

    // 🔥 IMPORTANT FIX (REAL-TIME UPDATE)
    router.refresh()

    // maliit delay para sure updated data
    setTimeout(() => {
      router.push('/dashboard/sales')
    }, 100)

    setIsLoading(false)
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category_id" defaultValue={sale?.category_id || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                name="quantity"
                type="number"
                defaultValue={sale?.quantity || 1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Unit Price *</Label>
              <Input
                name="unit_price"
                type="number"
                step="0.01"
                defaultValue={sale?.unit_price}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                name="customer_name"
                defaultValue={sale?.customer_name || ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input
                name="customer_email"
                type="email"
                defaultValue={sale?.customer_email || ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={sale?.status || 'pending'}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Sale Date</Label>
              <Input
                name="sale_date"
                type="datetime-local"
                defaultValue={
                  sale?.sale_date
                    ? new Date(sale.sale_date).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16)
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              name="notes"
              defaultValue={sale?.notes || ''}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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