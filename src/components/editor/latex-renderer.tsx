'use client'

import { useMemo, useEffect, useRef } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import 'katex/dist/katex.min.css'

interface LaTeXRendererProps {
  math: string
  displayMode?: boolean
  className?: string
  onError?: (error: string) => void
}

export function LaTeXRenderer({ 
  math, 
  displayMode = false, 
  className = '',
  onError 
}: LaTeXRendererProps) {
  const errorRef = useRef<string | null>(null)

  const renderedMath = useMemo(() => {
    try {
      errorRef.current = null
      
      // Clean the math string
      const cleanMath = math.trim()
      
      if (!cleanMath) {
        return null
      }

      // Validate basic LaTeX syntax
      if (cleanMath.includes('\\begin') && !cleanMath.includes('\\end')) {
        throw new Error('Unclosed \\begin environment')
      }

      if (displayMode) {
        return <BlockMath math={cleanMath} />
      } else {
        return <InlineMath math={cleanMath} />
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'LaTeX rendering error'
      errorRef.current = errorMessage
      onError?.(errorMessage)
      return null
    }
  }, [math, displayMode, onError])

  if (errorRef.current) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          LaTeX Error: {errorRef.current}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm opacity-70">Show LaTeX code</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs font-mono overflow-x-auto">
              {math}
            </pre>
          </details>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={className}>
      {renderedMath}
    </div>
  )
}

// Hook for processing LaTeX in markdown content
export function useProcessLaTeX(content: string) {
  return useMemo(() => {
    let processed = content

    // Process block math: $$...$$
    processed = processed.replace(
      /\$\$([\s\S]*?)\$\$/g,
      (match, formula) => {
        const cleanFormula = formula.trim()
        return `<div class="latex-block" data-math="${encodeURIComponent(cleanFormula)}"></div>`
      }
    )

    // Process inline math: $...$
    processed = processed.replace(
      /\$([^$\n]+?)\$/g,
      (match, formula) => {
        const cleanFormula = formula.trim()
        return `<span class="latex-inline" data-math="${encodeURIComponent(cleanFormula)}"></span>`
      }
    )

    return processed
  }, [content])
}

// LaTeX Editor Component
interface LaTeXEditorProps {
  value: string
  onChange: (value: string) => void
  displayMode?: boolean
  placeholder?: string
  className?: string
}

export function LaTeXEditor({
  value,
  onChange,
  displayMode = false,
  placeholder = 'Enter LaTeX formula...',
  className = ''
}: LaTeXEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = value.slice(0, start) + symbol + value.slice(end)
    
    onChange(newValue)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + symbol.length, start + symbol.length)
    }, 0)
  }

  const commonSymbols = [
    { label: 'α', symbol: '\\alpha' },
    { label: 'β', symbol: '\\beta' },
    { label: 'γ', symbol: '\\gamma' },
    { label: 'δ', symbol: '\\delta' },
    { label: 'ε', symbol: '\\epsilon' },
    { label: 'π', symbol: '\\pi' },
    { label: 'σ', symbol: '\\sigma' },
    { label: 'θ', symbol: '\\theta' },
    { label: 'λ', symbol: '\\lambda' },
    { label: 'μ', symbol: '\\mu' },
    { label: '∑', symbol: '\\sum' },
    { label: '∫', symbol: '\\int' },
    { label: '√', symbol: '\\sqrt{}' },
    { label: 'x²', symbol: '^2' },
    { label: 'x₁', symbol: '_1' },
    { label: '≤', symbol: '\\leq' },
    { label: '≥', symbol: '\\geq' },
    { label: '≠', symbol: '\\neq' },
    { label: '∞', symbol: '\\infty' },
    { label: '±', symbol: '\\pm' },
  ]

  const templates = [
    { label: 'Fraction', symbol: '\\frac{}{}' },
    { label: 'Subscript', symbol: '_{}' },
    { label: 'Superscript', symbol: '^{}' },
    { label: 'Square root', symbol: '\\sqrt{}' },
    { label: 'Sum', symbol: '\\sum_{}^{}' },
    { label: 'Integral', symbol: '\\int_{}^{}' },
    { label: 'Limit', symbol: '\\lim_{x \\to}' },
    { label: 'Matrix', symbol: '\\begin{pmatrix}\n & \\\\\n & \n\\end{pmatrix}' },
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Symbol palette */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded">
        <div className="text-xs font-medium text-muted-foreground mb-2 w-full">
          Common Symbols:
        </div>
        {commonSymbols.map((item) => (
          <button
            key={item.symbol}
            onClick={() => insertSymbol(item.symbol)}
            className="px-2 py-1 text-sm bg-background hover:bg-accent rounded border transition-colors"
            title={item.symbol}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="flex flex-wrap gap-2 p-2 bg-muted rounded">
        <div className="text-xs font-medium text-muted-foreground mb-2 w-full">
          Templates:
        </div>
        {templates.map((item) => (
          <button
            key={item.label}
            onClick={() => insertSymbol(item.symbol)}
            className="px-3 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">LaTeX Code:</label>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preview:</label>
          <div className="w-full h-32 p-3 border rounded-md bg-background overflow-auto">
            {value ? (
              <LaTeXRenderer math={value} displayMode={displayMode} />
            ) : (
              <div className="text-muted-foreground text-sm italic">
                Preview will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}