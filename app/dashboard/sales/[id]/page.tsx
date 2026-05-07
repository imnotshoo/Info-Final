import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSaleById } from '@/lib/actions/sales'
import { cn } from '@/lib/utils'
import { ArrowLeft, Edit, Calendar, User, Mail, Package, DollarSign, FileText } from 'lucide-react'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  refunded: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let sale
  try {
    sale = await getSaleById(id)
  } catch {
    notFound()
  }

  if (!sale) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/sales">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sale Details</h2>
            <p className="text-slate-500 mt-1">View sale information</p>
          </div>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/dashboard/sales/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Sale
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Product Name</p>
              <p className="text-lg font-medium text-slate-900">{sale.product_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Category</p>
              {sale.categories ? (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mt-1"
                  style={{
                    backgroundColor: `${sale.categories.color}20`,
                    color: sale.categories.color,
                  }}
                >
                  {sale.categories.name}
                </span>
              ) : (
                <p className="text-slate-400">No category</p>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <Badge variant="outline" className={cn('border mt-1', statusStyles[sale.status])}>
                {sale.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-slate-500" />
              Pricing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Quantity</p>
                <p className="text-lg font-medium text-slate-900">{sale.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Unit Price</p>
                <p className="text-lg font-medium text-slate-900">${sale.unit_price.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">${sale.total_amount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-slate-500" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{sale.customer_name || 'No name provided'}</p>
                {sale.customer_email && (
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {sale.customer_email}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-500" />
              Date Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Sale Date</p>
              <p className="font-medium text-slate-900">
                {new Date(sale.sale_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created At</p>
              <p className="font-medium text-slate-900">
                {new Date(sale.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {sale.notes && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 whitespace-pre-wrap">{sale.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
