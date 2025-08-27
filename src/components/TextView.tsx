'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface TextViewProps {
  data: any
  onDataChange: (data: any) => void
  searchQuery: string
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function TextView({ data, onDataChange, searchQuery, language }: TextViewProps) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [textareaHeight, setTextareaHeight] = useState(400)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic height based on available viewport space
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const footerHeight = 80 // Fixed footer height (padding + content)
        const headerHeight = rect.top // Space from top of viewport
        const availableHeight = viewportHeight - headerHeight - footerHeight
        const calculatedHeight = Math.max(300, availableHeight)
        setTextareaHeight(calculatedHeight)
      }
    }

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(calculateHeight, 0)
    
    window.addEventListener('resize', calculateHeight)
    return () => {
      window.removeEventListener('resize', calculateHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (data) {
      try {
        setJsonText(JSON.stringify(data, null, 2))
        setError(null)
      } catch (err) {
        setError(language === 'en' ? 'Failed to stringify JSON' : 'JSONの文字列化に失敗しました')
      }
    }
  }, [data, language])

  const handleTextChange = (value: string) => {
    setJsonText(value)
    
    if (!value.trim()) {
      setError(null)
      onDataChange(null)
      return
    }

    try {
      const parsed = JSON.parse(value)
      setError(null)
      onDataChange(parsed)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
      setError(language === 'en' ? `Parse Error: ${errorMessage}` : `パースエラー: ${errorMessage}`)
    }
  }

  const highlightSearchInText = (text: string, query: string) => {
    if (!query) return text
    
    const lines = text.split('\n')
    return lines.map((line, lineIndex) => {
      if (!line.toLowerCase().includes(query.toLowerCase())) {
        return line + '\n'
      }
      
      const parts = line.split(new RegExp(`(${query})`, 'gi'))
      return parts.map((part, partIndex) => 
        part.toLowerCase() === query.toLowerCase() 
          ? `🔍${part}🔍`
          : part
      ).join('') + '\n'
    }).join('')
  }

  const labels = {
    en: {
      placeholder: 'Paste your JSON here...',
      parseError: 'Parse Error:',
      lines: 'lines'
    },
    jp: {
      placeholder: 'JSONをここに貼り付けてください...',
      parseError: 'パースエラー:',
      lines: '行'
    },
    es: {
      placeholder: 'Pega tu JSON aquí...',
      parseError: 'Error de Análisis:',
      lines: 'líneas'
    },
    fr: {
      placeholder: 'Collez votre JSON ici...',
      parseError: 'Erreur d\'Analyse:',
      lines: 'lignes'
    },
    de: {
      placeholder: 'Fügen Sie Ihr JSON hier ein...',
      parseError: 'Parse-Fehler:',
      lines: 'Zeilen'
    },
    zh: {
      placeholder: '在此粘贴您的JSON...',
      parseError: '解析错误:',
      lines: '行'
    },
    ko: {
      placeholder: '여기에 JSON을 붙여넣으세요...',
      parseError: '구문 분석 오류:',
      lines: '줄'
    },
    pt: {
      placeholder: 'Cole seu JSON aqui...',
      parseError: 'Erro de Análise:',
      lines: 'linhas'
    }
  }

  const t = labels[language]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-3 text-sm flex-shrink-0">
          <span className="font-medium text-destructive">{t.parseError}</span>
          <span className="ml-2 text-destructive">{error}</span>
        </div>
      )}
      
      <div ref={containerRef} className="flex-1 min-h-0 pb-20">
        <div style={{ height: `${textareaHeight}px` }}>
          <textarea
            ref={textareaRef}
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-full p-4 font-mono text-sm bg-background border-0 resize-none focus:outline-none focus:ring-0"
            spellCheck={false}
          />
        </div>
        
        {searchQuery && (
          <div className="absolute top-2 right-2 bg-popover border rounded-md p-2 shadow-lg z-10">
            <div className="flex items-center space-x-1 text-xs">
              <Search className="h-3 w-3" />
              <span>{searchQuery}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Bottom Status Bar for Text View */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 z-30">
        <div className="status-bar text-right max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span>
            {t.lines}: {jsonText.split('\n').length}
            {jsonText && <> • {(new Blob([jsonText]).size / 1024).toFixed(1)} KB</>}
          </span>
        </div>
      </div>
    </div>
  )
}