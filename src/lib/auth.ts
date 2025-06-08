import { createClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import type { User } from '@/types'

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      return null
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (userError || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return user
}

export async function signUp(email: string, password: string, displayName: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function resetPassword(email: string) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

export async function updatePassword(password: string) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw error
  }
}

export async function updateProfile(data: {
  display_name?: string
  avatar_url?: string
}) {
  const supabase = createBrowserClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', user.id)

  if (error) {
    throw error
  }
}

export async function getUserSettings(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateUserSettings(userId: string, settings: Partial<{
  theme: string
  editor_font_size: number
  editor_font_family: string
  preview_font_size: number
  auto_save_interval: number
  show_line_numbers: boolean
  word_wrap: boolean
  minimap_enabled: boolean
  vim_mode_enabled: boolean
  notifications_enabled: boolean
  email_notifications: boolean
}>) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}

export async function getCurrentSession() {
  const supabase = await createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}