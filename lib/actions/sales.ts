'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Sale } from '@/lib/types'

/* =========================
   GET SALES
========================= */
export async function getSales() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('sale_date', { ascending: false })

  if (error || !data) return []

  return data as (Sale & {
    categories: { id: string; name: string; color: string } | null
  })[]
}

/* =========================
   GET SINGLE SALE
========================= */
export async function getSaleById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  return data as Sale & {
    categories: { id: string; name: string; color: string } | null
  }
}

/* =========================
   CREATE SALE (FIXED 🔥)
========================= */
export async function createSale(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const quantity = Number(formData.get('quantity'))
  const unit_price = Number(formData.get('unit_price'))

  const saleData = {
    user_id: user.id,
    product_name: formData.get('product_name') as string,

    quantity,
    unit_price,

    // 🔥 IMPORTANT FIX
    total_amount: quantity * unit_price,

    category_id: (formData.get('category_id') as string) || null,
    customer_name: (formData.get('customer_name') as string) || null,
    customer_email: (formData.get('customer_email') as string) || null,
    status: (formData.get('status') as string) || 'pending',
    notes: (formData.get('notes') as string) || null,
    sale_date: (formData.get('sale_date') as string) || new Date().toISOString(),
  }

  const { error } = await supabase.from('sales').insert(saleData)

  if (error) return { error: error.message }

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

/* =========================
   UPDATE SALE
========================= */
export async function updateSale(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const quantity = Number(formData.get('quantity'))
  const unit_price = Number(formData.get('unit_price'))

  const saleData = {
    product_name: formData.get('product_name') as string,
    quantity,
    unit_price,
    total_amount: quantity * unit_price,

    category_id: (formData.get('category_id') as string) || null,
    customer_name: (formData.get('customer_name') as string) || null,
    customer_email: (formData.get('customer_email') as string) || null,
    status: (formData.get('status') as string) || 'pending',
    notes: (formData.get('notes') as string) || null,
    sale_date: (formData.get('sale_date') as string) || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('sales')
    .update(saleData)
    .eq('id', id)

  if (error) return { error: error.message }

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

/* =========================
   DELETE SALE
========================= */
export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Deleted sale',
    entity_type: 'sale',
    entity_id: id,
  })

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')

  return { success: true }
}

/* =========================
   DASHBOARD STATS
========================= */
export async function getDashboardStats() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('sales')
    .select('total_amount, status')

  const sales = data ?? []

  const totalSales = sales.length
  const totalRevenue = sales.reduce(
    (sum, s) => sum + (s.total_amount || 0),
    0
  )

  const pendingSales = sales.filter(s => s.status === 'pending').length
  const completedSales = sales.filter(s => s.status === 'completed').length

  return {
    totalSales,
    totalRevenue,
    pendingSales,
    completedSales,
    revenueGrowth: 0,
    salesGrowth: 0,
  }
}

/* =========================
   CHART DATA
========================= */
export async function getSalesChartData() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('sales')
    .select('total_amount, sale_date, status')
    .order('sale_date', { ascending: true })

  const sales = data ?? []

  if (sales.length === 0) {
    return {
      revenueByMonth: { labels: [], data: [] },
      salesByStatus: { labels: [], data: [] },
    }
  }

  const revenueByMonth: Record<string, number> = {}

  sales.forEach(sale => {
    const month = new Date(sale.sale_date).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    })

    revenueByMonth[month] =
      (revenueByMonth[month] || 0) + (sale.total_amount || 0)
  })

  const salesByStatus: Record<string, number> = {
    pending: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
  }

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