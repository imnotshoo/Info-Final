import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // safety check (prevents server crash)
  if (user === undefined) {
    redirect('/auth/login')
  }

  if (user) {
    redirect('/dashboard')
  }

  redirect('/auth/login')
}