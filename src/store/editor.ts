import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EditorConfig, Paper } from '@/types'

interface EditorState {
  // Current paper being edited
  currentPaper: Paper | null
  
  // Editor content and state
  content: string
  originalContent: string
  isDirty: boolean
  
  // UI state
  isPreviewMode: boolean
  showLineNumbers: boolean
  wordWrap: boolean
  
  // Editor configuration
  config: EditorConfig
  
  // Auto-save
  autoSaveEnabled: boolean
  autoSaveInterval: number
  lastSaved: Date | null
  
  // Actions
  setCurrentPaper: (paper: Paper | null) => void
  setContent: (content: string) => void
  updateContent: (content: string) => void
  setIsDirty: (isDirty: boolean) => void
  setPreviewMode: (isPreview: boolean) => void
  togglePreviewMode: () => void
  setShowLineNumbers: (show: boolean) => void
  setWordWrap: (wrap: boolean) => void
  updateConfig: (config: Partial<EditorConfig>) => void
  setAutoSaveEnabled: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  markSaved: () => void
  reset: () => void
}

const defaultConfig: EditorConfig = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  lineNumbers: 'on',
  wordWrap: 'on',
  minimap: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  readOnly: false,
  language: 'markdown',
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      currentPaper: null,
      content: '',
      originalContent: '',
      isDirty: false,
      isPreviewMode: false,
      showLineNumbers: true,
      wordWrap: true,
      config: defaultConfig,
      autoSaveEnabled: true,
      autoSaveInterval: 30,
      lastSaved: null,
      
      setCurrentPaper: (paper) => {
        const content = paper?.content || ''
        set({
          currentPaper: paper,
          content,
          originalContent: content,
          isDirty: false,
        })
      },
      
      setContent: (content) => set({ content, originalContent: content, isDirty: false }),
      
      updateContent: (content) => {
        const { originalContent } = get()
        set({
          content,
          isDirty: content !== originalContent,
        })
      },
      
      setIsDirty: (isDirty) => set({ isDirty }),
      
      setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
      
      togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
      
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      
      setWordWrap: (wordWrap) => set({ wordWrap }),
      
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      
      setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),
      
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
      
      markSaved: () => {
        const { content } = get()
        set({
          originalContent: content,
          isDirty: false,
          lastSaved: new Date(),
        })
      },
      
      reset: () =>
        set({
          currentPaper: null,
          content: '',
          originalContent: '',
          isDirty: false,
          isPreviewMode: false,
          lastSaved: null,
        }),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        config: state.config,
        isPreviewMode: state.isPreviewMode,
        showLineNumbers: state.showLineNumbers,
        wordWrap: state.wordWrap,
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveInterval: state.autoSaveInterval,
      }),
    }
  )
)