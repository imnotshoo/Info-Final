import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getSaleById } from '@/lib/actions/sales'
import { getCategories } from '@/lib/actions/categories'
import { SaleForm } from '@/components/sales/sale-form'
import { ArrowLeft } from 'lucide-react'

export default async function EditSalePage({
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

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/sales/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Edit Sale</h2>
          <p className="text-slate-500 mt-1">Update sale information</p>
        </div>
      </div>

      <SaleForm sale={sale} categories={categories} />
    </div>
  )
}
