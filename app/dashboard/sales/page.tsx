import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSales } from '@/lib/actions/sales'
import { SalesTable } from '@/components/sales/sales-table'
import { Plus } from 'lucide-react'

export default async function SalesPage() {
  const sales = await getSales()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales</h2>
          <p className="text-slate-500 mt-1">Manage your sales transactions</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/sales/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Link>
        </Button>
      </div>

      <SalesTable sales={sales} />
    </div>
  )
}
