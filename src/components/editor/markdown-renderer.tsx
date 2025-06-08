'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { InlineMath, BlockMath } from 'react-katex'
import { useTheme } from 'next-themes'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
  enableMath?: boolean
  enableSVG?: boolean
  enableSyntaxHighlighting?: boolean
  maxWidth?: string
}

export function MarkdownRenderer({
  content,
  className = '',
  enableMath = true,
  enableSVG = true,
  enableSyntaxHighlighting = true,
  maxWidth = 'none',
}: MarkdownRendererProps) {
  const { theme } = useTheme()

  const syntaxTheme = theme === 'dark' ? oneDark : oneLight

  const processedContent = useMemo(() => {
    if (!content) return ''
    
    let processed = content

    // Process LaTeX math expressions
    if (enableMath) {
      // Block math: $$...$$
      processed = processed.replace(
        /\$\$([\s\S]*?)\$\$/g,
        (match, formula) => `<div class="math-block">${formula.trim()}</div>`
      )
      
      // Inline math: $...$
      processed = processed.replace(
        /\$([^$\n]+?)\$/g,
        (match, formula) => `<span class="math-inline">${formula.trim()}</span>`
      )
    }

    return processed
  }, [content, enableMath])

  const components = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (!inline && enableSyntaxHighlighting && language) {
        // Handle special languages
        if (language === 'svg') {
          return enableSVG ? (
            <div className="my-4 p-4 border rounded-lg bg-muted/50">
              <div 
                className="svg-container"
                dangerouslySetInnerHTML={{ __html: String(children).replace(/\n$/, '') }}
              />
            </div>
          ) : (
            <SyntaxHighlighter
              style={syntaxTheme}
              language="xml"
              PreTag="div"
              className="rounded-md"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          )
        }

        if (language === 'math' || language === 'latex') {
          return enableMath ? (
            <div className="my-4">
              <BlockMath math={String(children).replace(/\n$/, '')} />
            </div>
          ) : (
            <SyntaxHighlighter
              style={syntaxTheme}
              language="latex"
              PreTag="div"
              className="rounded-md"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          )
        }

        return (
          <SyntaxHighlighter
            style={syntaxTheme}
            language={language}
            PreTag="div"
            className="rounded-md"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      }

      return (
        <code className={cn("px-1 py-0.5 bg-muted rounded text-sm font-mono", className)} {...props}>
          {children}
        </code>
      )
    },

    // Math rendering
    div({ className, children, ...props }: any) {
      if (className === 'math-block' && enableMath) {
        return (
          <div className="my-4 text-center">
            <BlockMath math={String(children)} />
          </div>
        )
      }
      return <div className={className} {...props}>{children}</div>
    },

    span({ className, children, ...props }: any) {
      if (className === 'math-inline' && enableMath) {
        return <InlineMath math={String(children)} />
      }
      return <span className={className} {...props}>{children}</span>
    },

    // Enhanced headings with anchor links
    h1({ children, ...props }: any) {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return (
        <h1 id={id} className="group relative" {...props}>
          {children}
          <a
            href={`#${id}`}
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            aria-label="Link to heading"
          >
            #
          </a>
        </h1>
      )
    },

    h2({ children, ...props }: any) {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return (
        <h2 id={id} className="group relative" {...props}>
          {children}
          <a
            href={`#${id}`}
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            aria-label="Link to heading"
          >
            #
          </a>
        </h2>
      )
    },

    h3({ children, ...props }: any) {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return (
        <h3 id={id} className="group relative" {...props}>
          {children}
          <a
            href={`#${id}`}
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            aria-label="Link to heading"
          >
            #
          </a>
        </h3>
      )
    },

    // Enhanced tables
    table({ children, ...props }: any) {
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-border" {...props}>
            {children}
          </table>
        </div>
      )
    },

    th({ children, ...props }: any) {
      return (
        <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props}>
          {children}
        </th>
      )
    },

    td({ children, ...props }: any) {
      return (
        <td className="border border-border px-4 py-2" {...props}>
          {children}
        </td>
      )
    },

    // Enhanced blockquotes
    blockquote({ children, ...props }: any) {
      return (
        <blockquote 
          className="my-6 border-l-4 border-primary pl-6 italic text-muted-foreground" 
          {...props}
        >
          {children}
        </blockquote>
      )
    },

    // Enhanced lists
    ul({ children, ...props }: any) {
      return (
        <ul className="my-4 list-disc list-inside space-y-2" {...props}>
          {children}
        </ul>
      )
    },

    ol({ children, ...props }: any) {
      return (
        <ol className="my-4 list-decimal list-inside space-y-2" {...props}>
          {children}
        </ol>
      )
    },

    li({ children, ...props }: any) {
      return (
        <li className="leading-relaxed" {...props}>
          {children}
        </li>
      )
    },

    // Enhanced links
    a({ href, children, ...props }: any) {
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          className="text-primary hover:underline font-medium"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && (
            <span className="inline-block ml-1 text-xs">↗</span>
          )}
        </a>
      )
    },

    // Enhanced images
    img({ src, alt, ...props }: any) {
      return (
        <figure className="my-6">
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded-lg border border-border"
            loading="lazy"
            {...props}
          />
          {alt && (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {alt}
            </figcaption>
          )}
        </figure>
      )
    },

    // Horizontal rule
    hr({ ...props }: any) {
      return <hr className="my-8 border-border" {...props} />
    },

    // Paragraphs
    p({ children, ...props }: any) {
      return (
        <p className="my-4 leading-relaxed" {...props}>
          {children}
        </p>
      )
    },
  }

  const remarkPlugins = [
    remarkGfm, // GitHub Flavored Markdown
    ...(enableMath ? [remarkMath] : []),
  ]

  const rehypePlugins = [
    ...(enableSVG ? [rehypeRaw] : []), // Allow raw HTML for SVG
    ...(enableMath ? [rehypeKatex] : []),
  ]

  return (
    <div 
      className={cn(
        'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert',
        'prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border',
        className
      )}
      style={{ maxWidth }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}