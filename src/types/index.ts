export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Paper {
  id: string
  title: string
  content: string
  author_id: string
  author?: User
  is_public: boolean
  created_at: string
  updated_at: string
  versions?: PaperVersion[]
  collaborators?: PaperCollaborator[]
}

export interface PaperVersion {
  id: string
  paper_id: string
  content: string
  version_name: string
  commit_message?: string
  created_at: string
  created_by: string
  created_by_user?: User
}

export interface PaperCollaborator {
  id: string
  paper_id: string
  user_id: string
  user?: User
  role: 'viewer' | 'editor' | 'admin'
  invited_at: string
  accepted_at?: string
}

export interface EditorState {
  content: string
  cursorPosition: number
  selectedText: string
  isPreviewMode: boolean
  isDirty: boolean
}

export interface PaperComment {
  id: string
  paper_id: string
  user_id: string
  user?: User
  content: string
  line_number?: number
  resolved: boolean
  created_at: string
  updated_at: string
  replies?: PaperComment[]
  parent_id?: string
}

export interface ExportOptions {
  format: 'pdf' | 'html' | 'markdown' | 'docx'
  includeMetadata: boolean
  paperSize: 'a4' | 'letter' | 'a3'
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  includeTableOfContents: boolean
  includeLineNumbers: boolean
  fontSize: number
  fontFamily: string
}

export interface UploadedFile {
  id: string
  paper_id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_by: string
  uploaded_at: string
}

export interface PaperTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  author_id: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
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
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'paper_shared' | 'comment_added' | 'version_created' | 'collaboration_invite'
  title: string
  message: string
  paper_id?: string
  comment_id?: string
  read: boolean
  created_at: string
}

export interface SearchResult {
  id: string
  type: 'paper' | 'version' | 'comment'
  title: string
  excerpt: string
  paper_id?: string
  version_id?: string
  comment_id?: string
  relevance: number
  highlighted_content: string
  created_at: string
}

export interface APIResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface FormState {
  isLoading: boolean
  errors: Record<string, string>
  success: boolean
  message?: string
}

export interface EditorConfig {
  theme: 'vs-dark' | 'vs-light'
  fontSize: number
  fontFamily: string
  lineNumbers: 'on' | 'off' | 'relative'
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  scrollBeyondLastLine: boolean
  automaticLayout: boolean
  readOnly: boolean
  language: string
}

export interface SVGElement {
  id: string
  type: 'rect' | 'circle' | 'line' | 'path' | 'text' | 'group'
  attributes: Record<string, string | number>
  children?: SVGElement[]
  content?: string
}

export interface ChartData {
  id: string
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area'
  data: any[]
  title?: string
  xAxis?: string
  yAxis?: string
  config?: Record<string, any>
}

export interface LaTeXFormula {
  id: string
  formula: string
  display: boolean
  error?: string
  rendered?: string
}

export type Theme = 'light' | 'dark' | 'system'
export type UserRole = 'viewer' | 'editor' | 'admin'
export type PaperStatus = 'draft' | 'published' | 'archived'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface ContextMenuAction {
  id: string
  label: string
  icon?: string
  shortcut?: string
  action: () => void
  disabled?: boolean
  separator?: boolean
}