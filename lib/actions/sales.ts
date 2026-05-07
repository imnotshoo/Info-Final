'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Sale } from '@/lib/types'

export async function getSales() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sales')
    .select('*, categories(id, name, color)')
    .order('sale_date', { ascending: false })

  if (error) throw error
  return data as (Sale & { categories: { id: string; name: string; color: string } | null })[]
}

export async function getSaleById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sales')
    .select('*, categories(id, name, color)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Sale & { categories: { id: string; name: string; color: string } | null }
}

export async function createSale(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const saleData = {
    user_id: user.id,
    product_name: formData.get('product_name') as string,
    quantity: parseInt(formData.get('quantity') as string),
    unit_price: parseFloat(formData.get('unit_price') as string),
    category_id: formData.get('category_id') as string || null,
    customer_name: formData.get('customer_name') as string || null,
    customer_email: formData.get('customer_email') as string || null,
    status: formData.get('status') as string || 'pending',
    notes: formData.get('notes') as string || null,
    sale_date: formData.get('sale_date') as string || new Date().toISOString(),
  }

  const { error } = await supabase.from('sales').insert(saleData)

  if (error) {
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Created sale',
    entity_type: 'sale',
    details: { product_name: saleData.product_name },
  })

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateSale(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const saleData = {
    product_name: formData.get('product_name') as string,
    quantity: parseInt(formData.get('quantity') as string),
    unit_price: parseFloat(formData.get('unit_price') as string),
    category_id: formData.get('category_id') as string || null,
    customer_name: formData.get('customer_name') as string || null,
    customer_email: formData.get('customer_email') as string || null,
    status: formData.get('status') as string,
    notes: formData.get('notes') as string || null,
    sale_date: formData.get('sale_date') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('sales')
    .update(saleData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Updated sale',
    entity_type: 'sale',
    entity_id: id,
    details: { product_name: saleData.product_name },
  })

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get sale details before deleting
  const { data: sale } = await supabase
    .from('sales')
    .select('product_name')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Deleted sale',
    entity_type: 'sale',
    entity_id: id,
    details: { product_name: sale?.product_name },
  })

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  
  const { data: sales } = await supabase
    .from('sales')
    .select('total_amount, status, sale_date')

  if (!sales) {
    return {
      totalSales: 0,
      totalRevenue: 0,
      pendingSales: 0,
      completedSales: 0,
      revenueGrowth: 0,
      salesGrowth: 0,
    }
  }

  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)
  const pendingSales = sales.filter(s => s.status === 'pending').length
  const completedSales = sales.filter(s => s.status === 'completed').length

  // Calculate growth (comparing last 30 days to previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentSales = sales.filter(s => new Date(s.sale_date) >= thirtyDaysAgo)
  const previousSales = sales.filter(s => {
    const date = new Date(s.sale_date)
    return date >= sixtyDaysAgo && date < thirtyDaysAgo
  })

  const recentRevenue = recentSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)
  const previousRevenue = previousSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)

  const revenueGrowth = previousRevenue > 0 
    ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
    : 0

  const salesGrowth = previousSales.length > 0 
    ? ((recentSales.length - previousSales.length) / previousSales.length) * 100 
    : 0

  return {
    totalSales,
    totalRevenue,
    pendingSales,
    completedSales,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    salesGrowth: Math.round(salesGrowth * 10) / 10,
  }
}

export async function getSalesChartData() {
  const supabase = await createClient()
  
  const { data: sales } = await supabase
    .from('sales')
    .select('total_amount, sale_date, status')
    .order('sale_date', { ascending: true })

  if (!sales || sales.length === 0) {
    return {
      revenueByMonth: { labels: [], data: [] },
      salesByStatus: { labels: [], data: [] },
    }
  }

  // Group by month for revenue chart
  const revenueByMonth: Record<string, number> = {}
  sales.forEach(sale => {
    const month = new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (sale.total_amount || 0)
  })

  // Sales by status
  const salesByStatus: Record<string, number> = { pending: 0, completed: 0, cancelled: 0, refunded: 0 }
  sales.forEach(sale => {
    if (sale.status in salesByStatus) {
      salesByStatus[sale.status]++
    }
  })

  return {
    revenueByMonth: {
      labels: Object.keys(revenueByMonth),
      data: Object.values(revenueByMonth),
    },
    salesByStatus: {
      labels: Object.keys(salesByStatus),
      data: Object.values(salesByStatus),
    },
  }
}
