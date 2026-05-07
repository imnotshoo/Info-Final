export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  contact_number: string | null
  avatar_url: string | null
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  user_id: string
  category_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_amount: number
  customer_name: string | null
  customer_email: string | null
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  notes: string | null
  sale_date: string
  created_at: string
  updated_at: string
  categories?: Category
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string | null
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  link: string | null
  created_at: string
}

export interface DashboardStats {
  totalSales: number
  totalRevenue: number
  pendingSales: number
  completedSales: number
  revenueGrowth: number
  salesGrowth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}
