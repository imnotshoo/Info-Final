'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Category } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Category
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const categoryData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    color: formData.get('color') as string || '#3b82f6',
  }

  const { error } = await supabase.from('categories').insert(categoryData)

  if (error) {
    if (error.code === '23505') {
      return { error: 'A category with this name already exists.' }
    }
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Created category',
    entity_type: 'category',
    details: { name: categoryData.name },
  })

  revalidatePath('/dashboard/categories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const categoryData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    color: formData.get('color') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'A category with this name already exists.' }
    }
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Updated category',
    entity_type: 'category',
    entity_id: id,
    details: { name: categoryData.name },
  })

  revalidatePath('/dashboard/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get category details before deleting
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Deleted category',
    entity_type: 'category',
    entity_id: id,
    details: { name: category?.name },
  })

  revalidatePath('/dashboard/categories')
  return { success: true }
}

export async function getCategoriesWithSalesCount() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*, sales(count)')
    .order('name', { ascending: true })

  return categories?.map(cat => ({
    ...cat,
    salesCount: cat.sales?.[0]?.count || 0,
  })) || []
}
