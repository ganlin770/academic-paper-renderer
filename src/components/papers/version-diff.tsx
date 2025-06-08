'use client'

import { useMemo } from 'react'
import { diffLines, Change } from 'diff'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitCompare, Plus, Minus, Equal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaperVersion } from '@/types'

interface VersionDiffProps {
  oldVersion: PaperVersion
  newVersion: PaperVersion
  className?: string
}

export function VersionDiff({ 
  oldVersion, 
  newVersion, 
  className 
}: VersionDiffProps) {
  const diff = useMemo(() => {
    return diffLines(oldVersion.content, newVersion.content)
  }, [oldVersion.content, newVersion.content])

  const stats = useMemo(() => {
    return diff.reduce((acc, change) => {
      if (change.added) {
        acc.additions += change.count || 0
      } else if (change.removed) {
        acc.deletions += change.count || 0
      }
      return acc
    }, { additions: 0, deletions: 0 })
  }, [diff])

  const renderDiffLine = (change: Change, index: number) => {
    const lines = change.value.split('\n').filter(line => line !== '')
    
    if (lines.length === 0) return null

    return lines.map((line, lineIndex) => (
      <div
        key={`${index}-${lineIndex}`}
        className={cn(
          'flex items-start space-x-3 px-4 py-2 font-mono text-sm',
          change.added && 'bg-green-50 border-l-4 border-green-500 dark:bg-green-900/20',
          change.removed && 'bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20',
          !change.added && !change.removed && 'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        <div className="flex items-center space-x-2 flex-shrink-0">
          {change.added ? (
            <Plus className="h-4 w-4 text-green-600" />
          ) : change.removed ? (
            <Minus className="h-4 w-4 text-red-600" />
          ) : (
            <Equal className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
            {index + lineIndex + 1}
          </span>
        </div>
        <div 
          className={cn(
            'flex-1 whitespace-pre-wrap break-words',
            change.added && 'text-green-800 dark:text-green-200',
            change.removed && 'text-red-800 dark:text-red-200'
          )}
        >
          {line || ' '}
        </div>
      </div>
    ))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitCompare className="h-5 w-5" />
            <CardTitle className="text-lg">Version Comparison</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="text-xs">
              -{stats.deletions} lines
            </Badge>
            <Badge variant="default" className="text-xs bg-green-600">
              +{stats.additions} lines
            </Badge>
          </div>
        </div>
        <CardDescription>
          Comparing {oldVersion.version_name} → {newVersion.version_name}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-muted px-4 py-2 border-b">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {oldVersion.version_name} → {newVersion.version_name}
                </span>
                <span className="text-muted-foreground">
                  {diff.length} changes
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-red-600">
                  -{stats.deletions}
                </span>
                <span className="text-green-600">
                  +{stats.additions}
                </span>
              </div>
            </div>
          </div>

          {/* Diff Content */}
          <div className="max-h-96 overflow-y-auto">
            {diff.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <Equal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No differences found between these versions.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {diff.map((change, index) => (
                  <div key={index}>
                    {renderDiffLine(change, index)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Side-by-side diff component
interface SideBySideDiffProps {
  oldVersion: PaperVersion
  newVersion: PaperVersion
  className?: string
}

export function SideBySideDiff({ 
  oldVersion, 
  newVersion, 
  className 
}: SideBySideDiffProps) {
  const oldLines = oldVersion.content.split('\n')
  const newLines = newVersion.content.split('\n')
  const maxLines = Math.max(oldLines.length, newLines.length)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <GitCompare className="h-5 w-5" />
          <CardTitle className="text-lg">Side-by-Side Comparison</CardTitle>
        </div>
        <CardDescription>
          {oldVersion.version_name} vs {newVersion.version_name}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          {/* Headers */}
          <div className="grid grid-cols-2 border-b bg-muted">
            <div className="px-4 py-2 border-r">
              <div className="font-medium text-sm">{oldVersion.version_name}</div>
              <div className="text-xs text-muted-foreground">
                {oldLines.length} lines
              </div>
            </div>
            <div className="px-4 py-2">
              <div className="font-medium text-sm">{newVersion.version_name}</div>
              <div className="text-xs text-muted-foreground">
                {newLines.length} lines
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2">
              {/* Old version */}
              <div className="border-r">
                {Array.from({ length: maxLines }, (_, i) => (
                  <div
                    key={`old-${i}`}
                    className="flex items-start space-x-2 px-4 py-1 font-mono text-sm border-b last:border-b-0"
                  >
                    <span className="text-xs text-muted-foreground min-w-[2rem] text-right">
                      {i + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-words">
                      {oldLines[i] || ''}
                    </span>
                  </div>
                ))}
              </div>

              {/* New version */}
              <div>
                {Array.from({ length: maxLines }, (_, i) => (
                  <div
                    key={`new-${i}`}
                    className="flex items-start space-x-2 px-4 py-1 font-mono text-sm border-b last:border-b-0"
                  >
                    <span className="text-xs text-muted-foreground min-w-[2rem] text-right">
                      {i + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-words">
                      {newLines[i] || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}