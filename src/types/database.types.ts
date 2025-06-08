export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          editor_font_size?: number
          editor_font_family?: string
          preview_font_size?: number
          auto_save_interval?: number
          show_line_numbers?: boolean
          word_wrap?: boolean
          minimap_enabled?: boolean
          vim_mode_enabled?: boolean
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          editor_font_size?: number
          editor_font_family?: string
          preview_font_size?: number
          auto_save_interval?: number
          show_line_numbers?: boolean
          word_wrap?: boolean
          minimap_enabled?: boolean
          vim_mode_enabled?: boolean
          notifications_enabled?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      papers: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          status: 'draft' | 'published' | 'archived'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "papers_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_versions: {
        Row: {
          id: string
          paper_id: string
          content: string
          version_name: string
          commit_message: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          paper_id: string
          content: string
          version_name: string
          commit_message?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          paper_id?: string
          content?: string
          version_name?: string
          commit_message?: string | null
          created_at?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_versions_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_collaborators: {
        Row: {
          id: string
          paper_id: string
          user_id: string
          role: 'viewer' | 'editor' | 'admin'
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          paper_id: string
          user_id: string
          role?: 'viewer' | 'editor' | 'admin'
          invited_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          paper_id?: string
          user_id?: string
          role?: 'viewer' | 'editor' | 'admin'
          invited_at?: string
          accepted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_collaborators_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_comments: {
        Row: {
          id: string
          paper_id: string
          user_id: string
          content: string
          line_number: number | null
          resolved: boolean
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          user_id: string
          content: string
          line_number?: number | null
          resolved?: boolean
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          user_id?: string
          content?: string
          line_number?: number | null
          resolved?: boolean
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_comments_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "paper_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          content: string
          category: string
          author_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          content: string
          category?: string
          author_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          content?: string
          category?: string
          author_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_templates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      uploaded_files: {
        Row: {
          id: string
          paper_id: string
          filename: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_by: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          filename: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_by: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          uploaded_by?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'paper_shared' | 'comment_added' | 'version_created' | 'collaboration_invite'
          title: string
          message: string
          paper_id: string | null
          comment_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'paper_shared' | 'comment_added' | 'version_created' | 'collaboration_invite'
          title: string
          message: string
          paper_id?: string | null
          comment_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'paper_shared' | 'comment_added' | 'version_created' | 'collaboration_invite'
          title?: string
          message?: string
          paper_id?: string | null
          comment_id?: string | null
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "paper_comments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'viewer' | 'editor' | 'admin'
      paper_status: 'draft' | 'published' | 'archived'
      notification_type: 'paper_shared' | 'comment_added' | 'version_created' | 'collaboration_invite'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}