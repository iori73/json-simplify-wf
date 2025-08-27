'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'

interface EmptyStateProps {
  onFileUpload: (file: File) => void
  onJsonPaste: (json: string) => void
  onLoadSample: () => void
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function EmptyState({ onFileUpload, onJsonPaste, onLoadSample, language }: EmptyStateProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [inputText, setInputText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const labels = {
    en: {
      title: 'Drop JSON here or Paste (⌘V)',
      subtitle: '• Max: 50MB  • Data never leaves your browser',
      privacy: '• Privacy-first local processing',
      sample: '💡 Try sample → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'Choose File',
      pasteButton: 'Paste JSON',
      textInputPlaceholder: 'Paste or type your JSON here...',
      parseButton: 'Parse JSON',
      cancelButton: 'Cancel'
    },
    jp: {
      title: 'JSONをドロップまたは貼り付け (⌘V)',
      subtitle: '• 最大: 50MB  • データはブラウザから出ません',
      privacy: '• プライバシーファーストのローカル処理',
      sample: '💡 サンプルを試す → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'ファイルを選択',
      pasteButton: 'JSONを貼り付け',
      textInputPlaceholder: 'JSONを貼り付けまたは入力...',
      parseButton: 'JSONを解析',
      cancelButton: 'キャンセル'
    },
    es: {
      title: 'Suelta JSON aquí o Pegar (⌘V)',
      subtitle: '• Max: 50MB  • Los datos nunca salen de tu navegador',
      privacy: '• Procesamiento local con privacidad',
      sample: '💡 Prueba ejemplo → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'Elegir Archivo',
      pasteButton: 'Pegar JSON',
      textInputPlaceholder: 'Pega o escribe tu JSON aquí...',
      parseButton: 'Analizar JSON',
      cancelButton: 'Cancelar'
    },
    fr: {
      title: 'Déposez JSON ici ou Coller (⌘V)',
      subtitle: '• Max: 50MB  • Les données ne quittent jamais votre navigateur',
      privacy: '• Traitement local respectueux de la vie privée',
      sample: '💡 Essayez l\'exemple → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'Choisir Fichier',
      pasteButton: 'Coller JSON',
      textInputPlaceholder: 'Collez ou tapez votre JSON ici...',
      parseButton: 'Analyser JSON',
      cancelButton: 'Annuler'
    },
    de: {
      title: 'JSON hier ablegen oder Einfügen (⌘V)',
      subtitle: '• Max: 50MB  • Daten verlassen nie Ihren Browser',
      privacy: '• Datenschutzfreundliche lokale Verarbeitung',
      sample: '💡 Beispiel testen → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'Datei Wählen',
      pasteButton: 'JSON Einfügen',
      textInputPlaceholder: 'JSON hier einfügen oder eingeben...',
      parseButton: 'JSON Analysieren',
      cancelButton: 'Abbrechen'
    },
    zh: {
      title: '拖拽JSON文件或粘贴 (⌘V)',
      subtitle: '• 最大: 50MB  • 数据不会离开您的浏览器',
      privacy: '• 隐私优先的本地处理',
      sample: '💡 试试示例 → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: '选择文件',
      pasteButton: '粘贴JSON',
      textInputPlaceholder: '在此粘贴或输入您的JSON...',
      parseButton: '解析JSON',
      cancelButton: '取消'
    },
    ko: {
      title: 'JSON 파일을 드롭하거나 붙여넣기 (⌘V)',
      subtitle: '• 최대: 50MB  • 데이터가 브라우저를 벗어나지 않습니다',
      privacy: '• 개인정보 우선 로컬 처리',
      sample: '💡 샘플 시도 → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: '파일 선택',
      pasteButton: 'JSON 붙여넣기',
      textInputPlaceholder: 'JSON을 붙여넣거나 입력하세요...',
      parseButton: 'JSON 분석',
      cancelButton: '취소'
    },
    pt: {
      title: 'Solte JSON aqui ou Colar (⌘V)',
      subtitle: '• Max: 50MB  • Dados nunca saem do seu navegador',
      privacy: '• Processamento local com foco na privacidade',
      sample: '💡 Teste exemplo → {"users":[{"id":1,"name":"Alice"}]}',
      uploadButton: 'Escolher Arquivo',
      pasteButton: 'Colar JSON',
      textInputPlaceholder: 'Cole ou digite seu JSON aqui...',
      parseButton: 'Analisar JSON',
      cancelButton: 'Cancelar'
    }
  }

  const t = labels[language]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const jsonFile = files.find(file => 
      file.type === 'application/json' || 
      file.name.endsWith('.json') || 
      file.name.endsWith('.geojson')
    )
    
    if (jsonFile) {
      onFileUpload(jsonFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handlePasteButton = () => {
    setShowTextInput(true)
    // Try to auto-paste from clipboard
    navigator.clipboard.readText().then(text => {
      if (text.trim()) {
        setInputText(text)
      }
    }).catch(() => {
      // Silently fail - user can manually paste or type
    })
  }

  const handleParse = () => {
    if (inputText.trim()) {
      onJsonPaste(inputText.trim())
      setShowTextInput(false)
      setInputText('')
    }
  }

  const handleCancel = () => {
    setShowTextInput(false)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.ctrlKey && e.key === 'Enter') {
      handleParse()
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={`drop-zone w-full max-w-2xl p-12 rounded-lg text-center transition-all ${
          isDragOver ? 'dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          {!showTextInput ? (
            <>
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">{t.title}</h2>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{t.subtitle}</p>
                <p>{t.privacy}</p>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                  <span>{t.uploadButton}</span>
                </button>
                
                <button
                  onClick={handlePasteButton}
                  className="inline-flex items-center space-x-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  <FileText className="h-4 w-4" />
                  <span>{t.pasteButton}</span>
                </button>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={onLoadSample}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.sample}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">{t.pasteButton}</h2>
              </div>
              
              <div className="w-full space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.textInputPlaceholder}
                  className="w-full h-64 p-4 border border-input rounded-md bg-background text-sm font-mono resize-none focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleParse}
                    disabled={!inputText.trim()}
                    className="inline-flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{t.parseButton}</span>
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center space-x-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <span>{t.cancelButton}</span>
                  </button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Enter</kbd> to parse or <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to cancel
                </div>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.geojson"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}