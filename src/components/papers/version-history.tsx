'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  History, 
  RotateCcw, 
  Eye, 
  GitBranch, 
  Calendar,
  User,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { restoreVersion } from '@/lib/papers'
import { MarkdownRenderer } from '@/components/editor/markdown-renderer'
import type { PaperVersion } from '@/types'

interface VersionHistoryProps {
  paperId: string
  versions: PaperVersion[]
  currentContent: string
  onRestore?: (content: string) => void
}

export function VersionHistory({ 
  paperId, 
  versions, 
  currentContent, 
  onRestore 
}: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<PaperVersion | null>(null)
  const [restoreDialog, setRestoreDialog] = useState<PaperVersion | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [error, setError] = useState('')

  const handleRestore = async (version: PaperVersion) => {
    setIsRestoring(true)
    setError('')

    try {
      await restoreVersion(paperId, version.id)
      onRestore?.(version.content)
      setRestoreDialog(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore version')
    } finally {
      setIsRestoring(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Version History</h3>
        <Badge variant="secondary">{versions.length} versions</Badge>
      </div>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No versions yet</h4>
              <p className="text-muted-foreground">
                Versions will appear here when you save changes to your paper.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => (
            <Card key={version.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={version.created_by_user?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(version.created_by_user?.display_name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm">{version.version_name}</CardTitle>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">Latest</Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        by {version.created_by_user?.display_name || 'Unknown'} • {' '}
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVersion(version)}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    {index !== 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestoreDialog(version)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {version.commit_message && (
                <CardContent className="pt-0">
                  <div className="flex items-start space-x-2 text-sm">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-muted-foreground">{version.commit_message}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Version Preview Dialog */}
      <Dialog 
        open={!!selectedVersion} 
        onOpenChange={() => setSelectedVersion(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Version Preview: {selectedVersion?.version_name}</span>
            </DialogTitle>
            <DialogDescription>
              Created {selectedVersion && formatDistanceToNow(new Date(selectedVersion.created_at), { addSuffix: true })} 
              {' '}by {selectedVersion?.created_by_user?.display_name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {selectedVersion && (
              <MarkdownRenderer 
                content={selectedVersion.content}
                className="max-w-none"
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVersion(null)}>
              Close
            </Button>
            {selectedVersion && versions[0]?.id !== selectedVersion.id && (
              <Button onClick={() => {
                setRestoreDialog(selectedVersion)
                setSelectedVersion(null)
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore This Version
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog 
        open={!!restoreDialog} 
        onOpenChange={() => setRestoreDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Restore Version</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to restore to version "{restoreDialog?.version_name}"?
              This will replace the current content with the selected version.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Version Details:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {restoreDialog && formatDistanceToNow(new Date(restoreDialog.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Author: {restoreDialog?.created_by_user?.display_name}</span>
              </div>
              {restoreDialog?.commit_message && (
                <div className="flex items-start space-x-2 mt-2">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <span className="italic">"{restoreDialog.commit_message}"</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRestoreDialog(null)}
              disabled={isRestoring}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => restoreDialog && handleRestore(restoreDialog)}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore Version
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}