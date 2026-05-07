import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/actions/categories'
import { SaleForm } from '@/components/sales/sale-form'
import { ArrowLeft } from 'lucide-react'

export default async function NewSalePage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/sales">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create New Sale</h2>
          <p className="text-slate-500 mt-1">Add a new sales transaction</p>
        </div>
      </div>

      <SaleForm categories={categories} />
    </div>
  )
}
