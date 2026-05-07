'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Home,
  ShoppingCart,
  FolderTree,
  Activity,
  Settings,
  User,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
  { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-slate-900">Sales Monitor</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-slate-400')} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-100 p-4">
          <h4 className="text-sm font-medium text-slate-900">Information Management</h4>
          <p className="mt-1 text-xs text-slate-500">Final Project - Sales Monitoring Dashboard</p>
        </div>
      </div>
    </aside>
  )
}
