'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(ArcElement, Tooltip, Legend)

interface SalesStatusChartProps {
  data: {
    labels: string[]
    data: number[]
  }
}

export function SalesStatusChart({ data }: SalesStatusChartProps) {
  const chartData = useMemo(() => ({
    labels: data.labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        data: data.data,
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // pending - amber
          'rgba(34, 197, 94, 0.8)',   // completed - green
          'rgba(239, 68, 68, 0.8)',   // cancelled - red
          'rgba(59, 130, 246, 0.8)',  // refunded - blue
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 2,
      },
    ],
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: 'rgb(71, 85, 105)',
        },
      },
      tooltip: {
        backgroundColor: 'rgb(15, 23, 42)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgb(51, 65, 85)',
        borderWidth: 1,
      },
    },
    cutout: '60%',
  }), [])

  const total = data.data.reduce((a, b) => a + b, 0)

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Sales by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">{total}</p>
              <p className="text-sm text-slate-500">Total Sales</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
