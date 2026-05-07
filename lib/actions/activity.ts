'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActivityLog } from '@/lib/types'

export async function getActivityLogs(limit = 50): Promise<ActivityLog[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActivityLog[]
}

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action,
    entity_type: entityType || null,
    entity_id: entityId || null,
    details: details || null,
  })
}
