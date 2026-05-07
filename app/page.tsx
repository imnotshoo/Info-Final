import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}