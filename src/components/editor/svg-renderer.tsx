'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Download, Copy, RefreshCw, ZoomIn, ZoomOut, Move } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SVGRendererProps {
  svgCode: string
  className?: string
  onError?: (error: string) => void
  maxWidth?: number
  maxHeight?: number
  interactive?: boolean
}

export function SVGRenderer({ 
  svgCode, 
  className = '',
  onError,
  maxWidth = 800,
  maxHeight = 600,
  interactive = false
}: SVGRendererProps) {
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const processedSVG = useMemo(() => {
    try {
      setError(null)
      
      if (!svgCode.trim()) {
        return null
      }

      // Clean and validate SVG
      let cleanSVG = svgCode.trim()
      
      // Check if it's a valid SVG
      if (!cleanSVG.toLowerCase().includes('<svg')) {
        throw new Error('Invalid SVG: Missing <svg> tag')
      }

      // Extract SVG content
      const svgMatch = cleanSVG.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
      if (!svgMatch) {
        throw new Error('Invalid SVG: Malformed SVG structure')
      }

      // Ensure SVG has proper attributes
      if (!cleanSVG.includes('xmlns')) {
        cleanSVG = cleanSVG.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }

      // Add viewBox if missing but width/height are present
      const widthMatch = cleanSVG.match(/width=["'](\d+)["']/i)
      const heightMatch = cleanSVG.match(/height=["'](\d+)["']/i)
      
      if (widthMatch && heightMatch && !cleanSVG.includes('viewBox')) {
        const width = widthMatch[1]
        const height = heightMatch[1]
        cleanSVG = cleanSVG.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`)
      }

      // Constrain dimensions
      cleanSVG = cleanSVG.replace(/width=["']\d+["']/i, `width="${Math.min(maxWidth, 800)}"`)
      cleanSVG = cleanSVG.replace(/height=["']\d+["']/i, `height="${Math.min(maxHeight, 600)}"`)

      return cleanSVG
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SVG rendering error'
      setError(errorMessage)
      onError?.(errorMessage)
      return null
    }
  }, [svgCode, maxWidth, maxHeight, onError])

  const handleDownload = () => {
    if (!processedSVG) return

    const blob = new Blob([processedSVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'chart.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!processedSVG) return

    try {
      await navigator.clipboard.writeText(processedSVG)
    } catch (err) {
      console.error('Failed to copy SVG:', err)
    }
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.2))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          SVG Error: {error}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm opacity-70">Show SVG code</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs font-mono overflow-x-auto max-h-40">
              {svgCode}
            </pre>
          </details>
        </AlertDescription>
      </Alert>
    )
  }

  if (!processedSVG) {
    return (
      <div className={cn("flex items-center justify-center h-32 bg-muted rounded-lg text-muted-foreground", className)}>
        No SVG content to display
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">SVG Chart</CardTitle>
          <div className="flex items-center space-x-1">
            {interactive && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-7 w-7 p-0"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-7 w-7 p-0"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 w-7 p-0"
                  title="Reset View"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 p-0"
              title="Copy SVG"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 w-7 p-0"
              title="Download SVG"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div
          ref={containerRef}
          className={cn(
            "overflow-hidden rounded border bg-white relative",
            interactive && "cursor-move",
            isDragging && "cursor-grabbing"
          )}
          style={{ maxHeight: maxHeight + 40 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="transition-transform duration-150"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center'
            }}
            dangerouslySetInnerHTML={{ __html: processedSVG }}
          />
        </div>
        
        {interactive && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Zoom: {Math.round(scale * 100)}% | Click and drag to pan
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// SVG Editor Component
interface SVGEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SVGEditor({
  value,
  onChange,
  placeholder = 'Enter SVG code...',
  className = ''
}: SVGEditorProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertTemplate = (template: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = value.slice(0, start) + template + value.slice(end)
    
    onChange(newValue)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + template.length, start + template.length)
    }, 0)
  }

  const templates = [
    {
      name: 'Circle',
      code: '<circle cx="50" cy="50" r="30" fill="blue" />'
    },
    {
      name: 'Rectangle',
      code: '<rect x="10" y="10" width="80" height="60" fill="red" />'
    },
    {
      name: 'Line',
      code: '<line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="2" />'
    },
    {
      name: 'Text',
      code: '<text x="50" y="50" text-anchor="middle" font-size="16" fill="black">Sample Text</text>'
    },
    {
      name: 'Path',
      code: '<path d="M 10 50 Q 50 10 90 50" stroke="green" stroke-width="2" fill="none" />'
    },
    {
      name: 'Basic Chart',
      code: `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Chart background -->
  <rect width="300" height="200" fill="#f8f9fa" stroke="#dee2e6" />
  
  <!-- Chart title -->
  <text x="150" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">Sample Chart</text>
  
  <!-- Bars -->
  <rect x="50" y="60" width="40" height="80" fill="#007bff" />
  <rect x="110" y="40" width="40" height="100" fill="#28a745" />
  <rect x="170" y="80" width="40" height="60" fill="#dc3545" />
  <rect x="230" y="30" width="40" height="110" fill="#ffc107" />
  
  <!-- Labels -->
  <text x="70" y="160" text-anchor="middle" font-size="12" fill="#666">A</text>
  <text x="130" y="160" text-anchor="middle" font-size="12" fill="#666">B</text>
  <text x="190" y="160" text-anchor="middle" font-size="12" fill="#666">C</text>
  <text x="250" y="160" text-anchor="middle" font-size="12" fill="#666">D</text>
</svg>`
    }
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Templates */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded">
        <div className="text-sm font-medium text-muted-foreground mb-2 w-full">
          Quick Templates:
        </div>
        {templates.map((template) => (
          <Button
            key={template.name}
            variant="outline"
            size="sm"
            onClick={() => insertTemplate(template.code)}
            className="text-xs"
          >
            {template.name}
          </Button>
        ))}
      </div>

      {/* Editor Tabs */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex border-b bg-muted">
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-r transition-colors',
              activeTab === 'code' 
                ? 'bg-background text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            SVG Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'preview' 
                ? 'bg-background text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Preview
          </button>
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'code' ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-[300px] p-4 border-0 font-mono text-sm resize-none focus:outline-none focus:ring-0 bg-background"
            />
          ) : (
            <div className="p-4 h-[300px] overflow-auto bg-background">
              {value ? (
                <SVGRenderer svgCode={value} interactive />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  SVG preview will appear here...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for processing SVG in markdown content
export function useProcessSVG(content: string) {
  return useMemo(() => {
    // Replace SVG code blocks with rendered SVG
    return content.replace(
      /```svg\n([\s\S]*?)\n```/g,
      (match, svgCode) => {
        // Create a container div for the SVG
        return `<div class="svg-container" data-svg="${encodeURIComponent(svgCode.trim())}"></div>`
      }
    )
  }, [content])
}