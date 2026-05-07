import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Sale } from '@/lib/types'

interface RecentSalesProps {
  sales: (Sale & { categories: { id: string; name: string; color: string } | null })[]
}

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  refunded: 'bg-blue-100 text-blue-700 border-blue-200',
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500">
            No sales yet. Create your first sale to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{sale.product_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {sale.categories && (
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${sale.categories.color}20`,
                          color: sale.categories.color,
                        }}
                      >
                        {sale.categories.name}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <Badge variant="outline" className={cn('border', statusStyles[sale.status])}>
                    {sale.status}
                  </Badge>
                  <span className="font-semibold text-slate-900 whitespace-nowrap">
                    ${sale.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
