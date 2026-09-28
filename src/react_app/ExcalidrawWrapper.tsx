import { useState, useEffect, useRef, useCallback } from 'react'
import { Excalidraw, serializeAsJSON, loadFromBlob } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import type { ExcalidrawImperativeAPI, AppState, BinaryFiles } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'

interface ExcalidrawWrapperProps {
  initialData?: string
  readOnly?: boolean
  onChange?: (data: string) => void
  onSave?: () => void
}

export default function ExcalidrawWrapper({
  initialData,
  readOnly = false,
  onChange,
  onSave
}: ExcalidrawWrapperProps) {
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null)
  const [apiReady, setApiReady] = useState(false)
  const loadedDataRef = useRef<string | null>(null)
  const isInternalChange = useRef(false)

  // Load data when both API is ready and initialData is available
  useEffect(() => {
    if (!apiReady || !initialData || !excalidrawAPIRef.current) return
    // Don't reload the same data
    if (loadedDataRef.current === initialData) return
    // Don't reload if this was our own change
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }

    loadedDataRef.current = initialData

    try {
      const blob = new Blob([initialData], { type: 'application/json' })
      loadFromBlob(blob, null, null).then((data) => {
        if (data && excalidrawAPIRef.current) {
          excalidrawAPIRef.current.updateScene({
            elements: data.elements,
            appState: data.appState
          })
          if (data.files) {
            excalidrawAPIRef.current.addFiles(Object.values(data.files))
          }
        }
      })
    } catch (e) {
      console.error('Failed to load Excalidraw data:', e)
    }
  }, [initialData, apiReady])

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave()
    }
  }, [onSave])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (!onChange || !excalidrawAPIRef.current) return

    isInternalChange.current = true
    const data = serializeAsJSON(elements, appState, files, 'local')
    onChange(data)
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current = api
          setApiReady(true)
        }}
        onChange={handleChange}
        viewModeEnabled={readOnly}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: true,
            export: readOnly ? false : {}
          }
        }}
      />
    </div>
  )
}
