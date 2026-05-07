'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { deleteSale } from '@/lib/actions/sales'
import { toast } from 'sonner'
import { Edit, Trash2, Eye } from 'lucide-react'
import type { Sale } from '@/lib/types'

interface SalesTableProps {
  sales: (Sale & { categories: { id: string; name: string; color: string } | null })[]
}

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  refunded: 'bg-blue-100 text-blue-700 border-blue-200',
}

export function SalesTable({ sales }: SalesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteId) return
    
    setIsDeleting(true)
    const result = await deleteSale(deleteId)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Sale deleted successfully')
    }
    
    setIsDeleting(false)
    setDeleteId(null)
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-16">
        <p className="text-slate-600 mb-4">No sales found. Create your first sale to get started.</p>
        <Button asChild>
          <Link href="/dashboard/sales/new">Create Sale</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Product</TableHead>
              <TableHead className="font-semibold text-slate-700">Category</TableHead>
              <TableHead className="font-semibold text-slate-700">Customer</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Qty</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Unit Price</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Total</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Date</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">{sale.product_name}</TableCell>
                <TableCell>
                  {sale.categories ? (
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${sale.categories.color}20`,
                        color: sale.categories.color,
                      }}
                    >
                      {sale.categories.name}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-600">
                  {sale.customer_name || <span className="text-slate-400">-</span>}
                </TableCell>
                <TableCell className="text-right text-slate-600">{sale.quantity}</TableCell>
                <TableCell className="text-right text-slate-600">${sale.unit_price.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold text-slate-900">
                  ${sale.total_amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('border', statusStyles[sale.status])}>
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">
                  {new Date(sale.sale_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <Link href={`/dashboard/sales/${sale.id}`}>
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <Link href={`/dashboard/sales/${sale.id}/edit`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(sale.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
