import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { Paper, PaperVersion, PaperCollaborator } from '@/types'

// Client-side functions
export async function createPaper(title: string, content: string = '') {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('papers')
    .insert({
      title,
      content,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePaper(id: string, updates: Partial<Paper>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('papers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePaper(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('papers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getPaper(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('papers')
    .select(`
      *,
      author:users(id, display_name, email, avatar_url),
      versions:paper_versions(
        id, version_name, commit_message, created_at,
        created_by_user:users(id, display_name, avatar_url)
      ),
      collaborators:paper_collaborators(
        id, role, invited_at, accepted_at,
        user:users(id, display_name, email, avatar_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getUserPapers(userId?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('papers')
    .select(`
      *,
      author:users(id, display_name, email, avatar_url),
      versions:paper_versions(id, version_name, created_at),
      collaborators:paper_collaborators(
        id, role,
        user:users(id, display_name, avatar_url)
      )
    `)
    .order('updated_at', { ascending: false })

  if (userId) {
    query = query.eq('author_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getSharedPapers() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('papers')
    .select(`
      *,
      author:users(id, display_name, email, avatar_url),
      collaborators!inner(
        id, role, accepted_at,
        user:users(id, display_name, avatar_url)
      )
    `)
    .eq('collaborators.user_id', user.id)
    .not('collaborators.accepted_at', 'is', null)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

// Version management functions
export async function createVersion(
  paperId: string, 
  content: string, 
  versionName?: string, 
  commitMessage?: string
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get current version count to generate version name
  const { count } = await supabase
    .from('paper_versions')
    .select('*', { count: 'exact', head: true })
    .eq('paper_id', paperId)

  const { data, error } = await supabase
    .from('paper_versions')
    .insert({
      paper_id: paperId,
      content,
      version_name: versionName || `v${(count || 0) + 1}`,
      commit_message: commitMessage,
      created_by: user.id,
    })
    .select(`
      *,
      created_by_user:users(id, display_name, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getPaperVersions(paperId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('paper_versions')
    .select(`
      *,
      created_by_user:users(id, display_name, avatar_url)
    `)
    .eq('paper_id', paperId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVersion(versionId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('paper_versions')
    .select(`
      *,
      paper:papers(id, title, author_id),
      created_by_user:users(id, display_name, avatar_url)
    `)
    .eq('id', versionId)
    .single()

  if (error) throw error
  return data
}

export async function restoreVersion(paperId: string, versionId: string) {
  const supabase = createClient()
  
  // Get the version content
  const { data: version, error: versionError } = await supabase
    .from('paper_versions')
    .select('content')
    .eq('id', versionId)
    .single()

  if (versionError) throw versionError

  // Update the paper with the version content
  const { data, error } = await supabase
    .from('papers')
    .update({ content: version.content })
    .eq('id', paperId)
    .select()
    .single()

  if (error) throw error

  // Create a new version to mark the restoration
  await createVersion(
    paperId,
    version.content,
    undefined,
    `Restored from version ${versionId}`
  )

  return data
}

// Collaboration functions
export async function inviteCollaborator(
  paperId: string, 
  email: string, 
  role: 'viewer' | 'editor' | 'admin' = 'editor'
) {
  const supabase = createClient()
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError || !user) {
    throw new Error('User not found')
  }

  const { data, error } = await supabase
    .from('paper_collaborators')
    .insert({
      paper_id: paperId,
      user_id: user.id,
      role,
    })
    .select(`
      *,
      user:users(id, display_name, email, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateCollaboratorRole(
  collaboratorId: string, 
  role: 'viewer' | 'editor' | 'admin'
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('paper_collaborators')
    .update({ role })
    .eq('id', collaboratorId)
    .select(`
      *,
      user:users(id, display_name, email, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

export async function removeCollaborator(collaboratorId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('paper_collaborators')
    .delete()
    .eq('id', collaboratorId)

  if (error) throw error
}

export async function acceptCollaboration(collaboratorId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('paper_collaborators')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', collaboratorId)
    .select(`
      *,
      paper:papers(id, title),
      user:users(id, display_name, email, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

// Server-side functions
export async function getServerPaper(id: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('papers')
    .select(`
      *,
      author:users(id, display_name, email, avatar_url),
      versions:paper_versions(
        id, version_name, commit_message, created_at,
        created_by_user:users(id, display_name, avatar_url)
      ),
      collaborators:paper_collaborators(
        id, role, invited_at, accepted_at,
        user:users(id, display_name, email, avatar_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getServerUserPapers(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('papers')
    .select(`
      *,
      author:users(id, display_name, email, avatar_url),
      versions:paper_versions(id, version_name, created_at),
      collaborators:paper_collaborators(
        id, role,
        user:users(id, display_name, avatar_url)
      )
    `)
    .eq('author_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}