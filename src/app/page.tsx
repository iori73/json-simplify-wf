'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header from '@/components/Header'
import ViewTabs from '@/components/ViewTabs'
import EmptyState from '@/components/EmptyState'
import TreeView from '@/components/TreeView'
import TextView from '@/components/TextView'
import ValidationPanel from '@/components/ValidationPanel'
import ShortcutsModal from '@/components/ShortcutsModal'
import MobileWarning from '@/components/MobileWarning'
import { 
  ViewMode, 
  JsonNode, 
  SearchResult, 
  FileStats,
  ConvertFormat,
  SaveFormat 
} from '@/types'
import {
  formatFileSize,
  searchInJson,
  countJsonNodes,
  convertToCSV,
  convertToYAML,
  copyToClipboard,
  downloadFile,
  generateShareUrl,
  parseShareUrl
} from '@/lib/utils'
import { jsonrepair } from 'jsonrepair'

const SAMPLE_JSON = {
  users: [
    {
      id: 1,
      name: "Alice",
      address: {
        street: "123 Main St",
        city: "Boston"
      }
    },
    {
      id: 2,
      name: "Bob", 
      address: {
        street: "456 Oak Ave",
        city: "New York"
      }
    }
  ],
  meta: {
    total: 2,
    generated: "2025-01-15T10:30:00Z"
  }
}

export default function JSONSimplify() {
  // State management
  const [jsonData, setJsonData] = useState<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('tree')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'>('en')
  const [isValidationPanelOpen, setIsValidationPanelOpen] = useState(false)
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<JsonNode | null>(null)
  const [fileStats, setFileStats] = useState<FileStats>({
    size: '0 B',
    nodeCount: 0,
    renderTime: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check for mobile view on mount and resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Load shared JSON on mount
  useEffect(() => {
    const sharedData = parseShareUrl()
    if (sharedData) {
      handleJsonData(sharedData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update search results when query or data changes
  useEffect(() => {
    if (jsonData && searchQuery.trim()) {
      const results = searchInJson(jsonData, searchQuery)
      setSearchResults(results)
      setCurrentSearchIndex(0)
    } else {
      setSearchResults([])
      setCurrentSearchIndex(0)
    }
  }, [jsonData, searchQuery])

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Language handling
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt' | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + V - Paste
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        if (!document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) {
          event.preventDefault()
          handlePaste()
        }
      }
      
      // Ctrl/Cmd + F - Search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault()
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="key or value"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      
      // Ctrl/Cmd + D - Toggle theme
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault()
        setIsDarkMode(!isDarkMode)
      }
      
      // Ctrl/Cmd + K - Copy path
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        if (selectedNode) {
          handleCopyPath(selectedNode.path)
        }
      }
      
      // Alt + Cmd/Ctrl + → - Expand All
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'ArrowRight') {
        event.preventDefault()
        // Trigger expand all
      }
      
      // Alt + Cmd/Ctrl + ← - Collapse All  
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault()
        // Trigger collapse all
      }
      
      // ? - Show shortcuts
      if (event.key === '?' && !event.shiftKey) {
        if (!document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) {
          event.preventDefault()
          setIsShortcutsModalOpen(true)
        }
      }
      
      // Escape - Close modals
      if (event.key === 'Escape') {
        setIsValidationPanelOpen(false)
        setIsShortcutsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, selectedNode])

  // JSON data processing
  const handleJsonData = useCallback((data: any) => {
    const startTime = performance.now()
    setError(null)
    setIsLoading(true)
    
    try {
      setJsonData(data)
      
      // Calculate stats
      const jsonString = JSON.stringify(data)
      const nodeCount = countJsonNodes(data)
      const renderTime = performance.now() - startTime
      
      setFileStats({
        size: formatFileSize(new Blob([jsonString]).size),
        nodeCount,
        renderTime: Math.round(renderTime * 100) / 100,
        searchMatches: searchResults.length
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process JSON data')
    } finally {
      setIsLoading(false)
    }
  }, [searchResults.length])

  // File upload
  const handleFileUpload = useCallback(async (file: File) => {
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    if (file.size > maxSize) {
      setError(`File too large: ${formatFileSize(file.size)}. Maximum size is ${formatFileSize(maxSize)}.`)
      return
    }

    setIsLoading(true)
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      handleJsonData(data)
    } catch (err) {
      try {
        // Try to repair the JSON
        const repairedText = jsonrepair(await file.text())
        const data = JSON.parse(repairedText)
        handleJsonData(data)
        // Show a warning that JSON was repaired
        setError('JSON was automatically repaired. Please verify the result.')
      } catch (repairErr) {
        setError(`Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [handleJsonData])

  // Paste handling
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) return
      
      try {
        const data = JSON.parse(text)
        handleJsonData(data)
      } catch (err) {
        try {
          // Try to repair the JSON
          const repairedText = jsonrepair(text)
          const data = JSON.parse(repairedText)
          handleJsonData(data)
          setError('JSON was automatically repaired. Please verify the result.')
        } catch (repairErr) {
          setError(`Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
    } catch (err) {
      // Fallback to prompt
      const pasteText = prompt('Paste your JSON here:')
      if (pasteText) {
        try {
          const data = JSON.parse(pasteText)
          handleJsonData(data)
        } catch (parseErr) {
          setError(`Failed to parse JSON: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}`)
        }
      }
    }
  }, [handleJsonData])

  // Load sample data
  const handleLoadSample = useCallback(() => {
    handleJsonData(SAMPLE_JSON)
  }, [handleJsonData])

  // Reset to initial state
  const handleReset = useCallback(() => {
    setJsonData(null)
    setSearchQuery('')
    setSearchResults([])
    setCurrentSearchIndex(0)
    setSelectedNode(null)
    setError(null)
    setIsLoading(false)
    setIsValidationPanelOpen(false)
    setIsShortcutsModalOpen(false)
    setFileStats({
      size: '0 B',
      nodeCount: 0,
      renderTime: 0
    })
    // Clear URL search params if sharing URL was used
    if (window.location.search) {
      window.history.pushState({}, document.title, window.location.pathname)
    }
  }, [])

  // JSON operations
  const handleBeautify = useCallback(() => {
    if (!jsonData) return
    // In tree view, this doesn't need to do anything as it's always beautified
    // In text view, the TextView component handles this
  }, [jsonData])

  const handleMinify = useCallback(() => {
    if (!jsonData) return
    // Similar to beautify - handled by individual views
  }, [jsonData])

  // Validation
  const handleValidate = useCallback(() => {
    setIsValidationPanelOpen(true)
  }, [])

  // Convert operations
  const handleConvert = useCallback((format: ConvertFormat) => {
    if (!jsonData) return

    try {
      let convertedData: string
      let filename: string
      let mimeType: string

      if (format === 'csv') {
        convertedData = convertToCSV(jsonData, { flattenKeys: true })
        filename = 'data.csv'
        mimeType = 'text/csv'
      } else if (format === 'yaml') {
        convertedData = convertToYAML(jsonData)
        filename = 'data.yaml'  
        mimeType = 'text/yaml'
      } else {
        return
      }

      downloadFile(convertedData, filename, mimeType)
    } catch (err) {
      setError(`Conversion failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [jsonData])

  // Save operations
  const handleSave = useCallback((format: SaveFormat) => {
    if (!jsonData) return

    try {
      let content: string
      let filename: string
      let mimeType: string

      if (format === 'json') {
        content = JSON.stringify(jsonData, null, 2)
        filename = 'data.json'
        mimeType = 'application/json'
      } else if (format === 'csv') {
        content = convertToCSV(jsonData, { flattenKeys: true })
        filename = 'data.csv'
        mimeType = 'text/csv'
      } else if (format === 'yaml') {
        content = convertToYAML(jsonData)
        filename = 'data.yaml'
        mimeType = 'text/yaml'
      } else {
        return
      }

      downloadFile(content, filename, mimeType)
    } catch (err) {
      setError(`Save failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [jsonData])

  // Share
  const handleShare = useCallback(async () => {
    if (!jsonData) return

    try {
      const shareUrl = generateShareUrl(jsonData)
      await copyToClipboard(shareUrl)
      // You could show a toast notification here
      alert('Share URL copied to clipboard!')
    } catch (err) {
      setError(`Share failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [jsonData])

  // Search operations
  const handleSearchPrev = useCallback(() => {
    if (searchResults.length === 0) return
    setCurrentSearchIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1))
  }, [searchResults.length])

  const handleSearchNext = useCallback(() => {
    if (searchResults.length === 0) return
    setCurrentSearchIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0))
  }, [searchResults.length])

  // Copy operations
  const handleCopyValue = useCallback(async (value: any) => {
    try {
      const textValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      await copyToClipboard(textValue)
      // You could show a toast notification here
    } catch (err) {
      setError(`Copy failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  const handleCopyPath = useCallback(async (path: string) => {
    try {
      await copyToClipboard(path)
      // You could show a toast notification here
    } catch (err) {
      setError(`Copy failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  // Node selection
  const handleNodeSelect = useCallback((node: JsonNode) => {
    setSelectedNode(node)
  }, [])

  // Show mobile warning for screens < 1024px
  if (isMobileView) {
    return <MobileWarning language={language} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onPaste={handlePaste}
        onUpload={handleFileUpload}
        onBeautify={handleBeautify}
        onMinify={handleMinify}
        onValidate={handleValidate}
        onConvert={handleConvert}
        onSave={handleSave}
        onShare={handleShare}
        onReset={handleReset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchPrev={handleSearchPrev}
        onSearchNext={handleSearchNext}
        searchMatches={searchResults.length}
        currentSearchIndex={currentSearchIndex}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onLanguageChange={setLanguage}
        onShowShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      <ViewTabs
        currentView={viewMode}
        onViewChange={setViewMode}
        language={language}
      />

      <main className="flex-1 flex flex-col min-h-0">
        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 text-sm mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-r-md">
            <span className="font-medium text-destructive">Error: </span>
            <span className="text-destructive">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-destructive hover:text-destructive/80 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Processing...</span>
          </div>
        )}

        {!jsonData ? (
          <EmptyState
            onFileUpload={handleFileUpload}
            onJsonPaste={(json) => {
              try {
                const data = JSON.parse(json)
                handleJsonData(data)
              } catch (err) {
                setError(`Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`)
              }
            }}
            onLoadSample={handleLoadSample}
            language={language}
          />
        ) : (
          <>
            {viewMode === 'tree' && (
              <TreeView
                data={jsonData}
                searchQuery={searchQuery}
                searchResults={searchResults}
                onNodeSelect={handleNodeSelect}
                onCopyValue={handleCopyValue}
                onCopyPath={handleCopyPath}
                language={language}
              />
            )}
            
            {viewMode === 'text' && (
              <TextView
                data={jsonData}
                onDataChange={handleJsonData}
                searchQuery={searchQuery}
                language={language}
              />
            )}
            
            {viewMode === 'table' && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'en' ? 'Table View (Coming Soon)' : 'テーブルビュー (開発中)'}
                  </h3>
                  <p className="text-sm">
                    {language === 'en' 
                      ? 'Table view for tabular JSON data will be available in a future update.'
                      : 'テーブル形式のJSONデータのためのテーブルビューは、将来のアップデートで利用可能になります。'
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ValidationPanel
        isOpen={isValidationPanelOpen}
        onClose={() => setIsValidationPanelOpen(false)}
        jsonData={jsonData}
        language={language}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        language={language}
      />
    </div>
  )
}