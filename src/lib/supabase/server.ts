/**
 * Server-side Supabase client for use in server components and API routes
 * This file provides a way to create a Supabase client for server-side operations
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createClient = cache(() => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, any>) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, any>) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
})
