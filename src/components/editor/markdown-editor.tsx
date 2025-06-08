'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useEditorStore } from '@/store/editor'
import { useTheme } from 'next-themes'
import { debounce } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  EyeOff, 
  Save, 
  Settings, 
  Maximize, 
  Minimize, 
  FileText,
  Download,
  Share
} from 'lucide-react'
import type { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }
)

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  onSave?: () => void
  readOnly?: boolean
  height?: string | number
  className?: string
}

export function MarkdownEditor({
  value = '',
  onChange,
  onSave,
  readOnly = false,
  height = '600px',
  className = '',
}: MarkdownEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const {
    content,
    updateContent,
    isDirty,
    isPreviewMode,
    togglePreviewMode,
    config,
    updateConfig,
    showLineNumbers,
    wordWrap,
  } = useEditorStore()

  // Debounced content update
  const debouncedOnChange = debounce((value: string) => {
    updateContent(value)
    onChange?.(value)
  }, 300)

  useEffect(() => {
    if (value !== undefined && value !== content) {
      updateContent(value)
    }
  }, [value, content, updateContent])

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      fontSize: config.fontSize,
      fontFamily: config.fontFamily,
      lineNumbers: config.lineNumbers,
      wordWrap: config.wordWrap,
      minimap: { enabled: config.minimap },
      scrollBeyondLastLine: config.scrollBeyondLastLine,
      automaticLayout: config.automaticLayout,
      readOnly: readOnly || config.readOnly,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      togglePreviewMode()
    })

    editor.addCommand(monaco.KeyCode.F11, () => {
      setIsFullscreen(prev => !prev)
    })

    // Focus editor
    editor.focus()
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      debouncedOnChange(value)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const insertText = (text: string) => {
    const editor = editorRef.current
    if (!editor) return

    const selection = editor.getSelection()
    if (selection) {
      editor.executeEdits('', [{
        range: selection,
        text,
        forceMoveMarkers: true,
      }])
    }
    editor.focus()
  }

  const formatText = (prefix: string, suffix: string = '') => {
    const editor = editorRef.current
    if (!editor) return

    const selection = editor.getSelection()
    if (selection) {
      const selectedText = editor.getModel()?.getValueInRange(selection) || ''
      const newText = `${prefix}${selectedText}${suffix}`
      
      editor.executeEdits('', [{
        range: selection,
        text: newText,
        forceMoveMarkers: true,
      }])
    }
    editor.focus()
  }

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs-light'

  return (
    <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePreviewMode}
            className="h-8"
          >
            {isPreviewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <div className="w-px h-6 bg-border" />
          
          {/* Format buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('**', '**')}
            className="h-8 font-bold"
            title="Bold (Ctrl+B)"
          >
            B
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('*', '*')}
            className="h-8 italic"
            title="Italic (Ctrl+I)"
          >
            I
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('# ', '')}
            className="h-8"
            title="Heading"
          >
            H1
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText('\n- ')}
            className="h-8"
            title="List"
          >
            •
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText('\n```\n\n```\n')}
            className="h-8"
            title="Code Block"
          >
            {'</>'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertText('[]()')}
            className="h-8"
            title="Link"
          >
            🔗
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {isDirty && (
            <span className="text-sm text-orange-500 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Unsaved changes
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            disabled={!isDirty}
            className="h-8"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="h-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative" style={{ height }}>
        {!isPreviewMode ? (
          <MonacoEditor
            value={content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            language="markdown"
            theme={editorTheme}
            options={{
              fontSize: config.fontSize,
              fontFamily: config.fontFamily,
              lineNumbers: showLineNumbers ? 'on' : 'off',
              wordWrap: wordWrap ? 'on' : 'off',
              minimap: { enabled: config.minimap },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: readOnly,
              formatOnPaste: true,
              formatOnType: true,
              rulers: [80, 120],
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              matchBrackets: 'always',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
            }}
          />
        ) : (
          <div className="h-full p-6 overflow-auto bg-background">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  )
}

// Markdown Preview Component
function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="text-muted-foreground italic">
          Start typing to see your content rendered here...
        </div>
      )}
    </div>
  )
}