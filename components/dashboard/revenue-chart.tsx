'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface RevenueChartProps {
  data: {
    labels: string[]
    data: number[]
  }
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = useMemo(() => ({
    labels: data.labels.length > 0 ? data.labels : ['No data'],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: data.data.length > 0 ? data.data : [0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgb(15, 23, 42)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgb(51, 65, 85)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `$${context.parsed.y.toLocaleString()}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(100, 116, 139)',
        },
      },
      y: {
        grid: {
          color: 'rgb(226, 232, 240)',
        },
        ticks: {
          color: 'rgb(100, 116, 139)',
          callback: function(value: number | string) {
            return '$' + Number(value).toLocaleString()
          }
        },
      },
    },
  }), [])

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
