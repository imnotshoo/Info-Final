import { DollarSign, ShoppingCart, Clock, CheckCircle2 } from 'lucide-react'
import { getDashboardStats, getSalesChartData, getSales } from '@/lib/actions/sales'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { SalesStatusChart } from '@/components/dashboard/sales-status-chart'
import { RecentSales } from '@/components/dashboard/recent-sales'

export default async function DashboardPage() {
  let stats, chartData, sales

  try {
    ;[stats, chartData, sales] = await Promise.all([
      getDashboardStats(),
      getSalesChartData(),
      getSales(),
    ])
  } catch (error) {
    console.error('Dashboard error:', error)

    return (
      <div className="p-6 text-red-500">
        Dashboard failed to load. Check server data.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Track your sales performance and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
          trend={stats?.revenueGrowth ?? 0}
          description="vs last 30 days"
          icon={DollarSign}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Total Sales"
          value={stats?.totalSales ?? 0}
          trend={stats?.salesGrowth ?? 0}
          description="vs last 30 days"
          icon={ShoppingCart}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Pending Sales"
          value={stats?.pendingSales ?? 0}
          description="awaiting completion"
          icon={Clock}
          iconClassName="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Completed Sales"
          value={stats?.completedSales ?? 0}
          description="successfully closed"
          icon={CheckCircle2}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={chartData?.revenueByMonth ?? []} />
        <SalesStatusChart data={chartData?.salesByStatus ?? []} />
      </div>

      <RecentSales sales={sales ?? []} />
    </div>
  )
}