'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface EditorSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditorSettings({ open, onOpenChange }: EditorSettingsProps) {
  const {
    config,
    updateConfig,
    showLineNumbers,
    setShowLineNumbers,
    wordWrap,
    setWordWrap,
    autoSaveEnabled,
    setAutoSaveEnabled,
    autoSaveInterval,
    setAutoSaveInterval,
  } = useEditorStore()

  const [localConfig, setLocalConfig] = useState(config)
  const [localSettings, setLocalSettings] = useState({
    showLineNumbers,
    wordWrap,
    autoSaveEnabled,
    autoSaveInterval,
  })

  const handleSave = () => {
    updateConfig(localConfig)
    setShowLineNumbers(localSettings.showLineNumbers)
    setWordWrap(localSettings.wordWrap)
    setAutoSaveEnabled(localSettings.autoSaveEnabled)
    setAutoSaveInterval(localSettings.autoSaveInterval)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setLocalConfig(config)
    setLocalSettings({
      showLineNumbers,
      wordWrap,
      autoSaveEnabled,
      autoSaveInterval,
    })
    onOpenChange(false)
  }

  const fontFamilies = [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Consolas',
    'Monaco',
    'Menlo',
    'Ubuntu Mono',
    'Courier New',
  ]

  const themes = [
    { value: 'vs-light', label: 'Light' },
    { value: 'vs-dark', label: 'Dark' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Font Settings</CardTitle>
                <CardDescription>
                  Customize the editor font family and size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={localConfig.fontFamily}
                    onValueChange={(value) =>
                      setLocalConfig(prev => ({ ...prev, fontFamily: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size: {localConfig.fontSize}px</Label>
                  <Slider
                    value={[localConfig.fontSize]}
                    onValueChange={(value) =>
                      setLocalConfig(prev => ({ ...prev, fontSize: value[0] }))
                    }
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>
                  Configure editor display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="line-numbers">Show Line Numbers</Label>
                  <Switch
                    id="line-numbers"
                    checked={localSettings.showLineNumbers}
                    onCheckedChange={(checked) =>
                      setLocalSettings(prev => ({ ...prev, showLineNumbers: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="word-wrap">Word Wrap</Label>
                  <Switch
                    id="word-wrap"
                    checked={localSettings.wordWrap}
                    onCheckedChange={(checked) =>
                      setLocalSettings(prev => ({ ...prev, wordWrap: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="minimap">Show Minimap</Label>
                  <Switch
                    id="minimap"
                    checked={localConfig.minimap}
                    onCheckedChange={(checked) =>
                      setLocalConfig(prev => ({ ...prev, minimap: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="scroll-beyond">Scroll Beyond Last Line</Label>
                  <Switch
                    id="scroll-beyond"
                    checked={localConfig.scrollBeyondLastLine}
                    onCheckedChange={(checked) =>
                      setLocalConfig(prev => ({ ...prev, scrollBeyondLastLine: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Choose your preferred editor theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="theme">Editor Theme</Label>
                  <Select
                    value={localConfig.theme}
                    onValueChange={(value: 'vs-light' | 'vs-dark') =>
                      setLocalConfig(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout</CardTitle>
                <CardDescription>
                  Configure editor layout preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="automatic-layout">Automatic Layout</Label>
                  <Switch
                    id="automatic-layout"
                    checked={localConfig.automaticLayout}
                    onCheckedChange={(checked) =>
                      setLocalConfig(prev => ({ ...prev, automaticLayout: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto Save</CardTitle>
                <CardDescription>
                  Configure automatic saving behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save">Enable Auto Save</Label>
                  <Switch
                    id="auto-save"
                    checked={localSettings.autoSaveEnabled}
                    onCheckedChange={(checked) =>
                      setLocalSettings(prev => ({ ...prev, autoSaveEnabled: checked }))
                    }
                  />
                </div>

                {localSettings.autoSaveEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="auto-save-interval">
                      Auto Save Interval: {localSettings.autoSaveInterval} seconds
                    </Label>
                    <Slider
                      value={[localSettings.autoSaveInterval]}
                      onValueChange={(value) =>
                        setLocalSettings(prev => ({ ...prev, autoSaveInterval: value[0] }))
                      }
                      min={5}
                      max={300}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Editor Behavior</CardTitle>
                <CardDescription>
                  Configure editor behavior settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="word-wrap-column">Word Wrap</Label>
                  <Select
                    value={localConfig.wordWrap}
                    onValueChange={(value: any) =>
                      setLocalConfig(prev => ({ ...prev, wordWrap: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="wordWrapColumn">Word Wrap Column</SelectItem>
                      <SelectItem value="bounded">Bounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line-numbers-mode">Line Numbers</Label>
                  <Select
                    value={localConfig.lineNumbers}
                    onValueChange={(value: any) =>
                      setLocalConfig(prev => ({ ...prev, lineNumbers: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}